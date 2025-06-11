class World {
  character = new Character();
  endboss;
  movableObject = new MovableObject();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBarHealth = new StatusBar('health');
  statusBarCoins = new StatusBar('coins');
  statusBarBottles = new StatusBar('bottle');
  statusBarEndboss = new StatusBar('endboss');
  totalCoinsInLevel;
  totalBottlesInLevel;
  showEndbossStatusBar = false;
  bottleHitSomething = false;


  constructor(canvas, keyboard,) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.playGameMusic();
    this.draw();
    this.setWorld();
    this.allwaysExecuted();
    this.totalCoinsInLevel = this.level.coinsArray.length;
    this.totalBottlesInLevel = this.level.bottlesArray.length;
  }

  playGameMusic() {
    game_music.play();
    game_music.volume = game_music_volume_loude;

  }

  setWorld() {
    this.character.world = this;
    this.endboss = this.level.enemiesArray.find(enemy => enemy instanceof Endboss);
    this.level.enemiesArray.forEach(enemy => {
      enemy.world = this;
      if (enemy instanceof Chicken || enemy instanceof Chick || enemy instanceof Endboss) {
        enemy.character = this.character;
      }
    });
  }


  allwaysExecuted() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCollisionsBarrel();
      this.collectObjects(this.level.bottlesArray, this.character.collectBottlesArray, PATH_COLLECT_BOTTLE_AUDIO, collect_bottle_audio_volume, 800);
      this.collectObjects(this.level.coinsArray, this.character.collectCoinsArray, PATH_COLLECT_COIN_AUDIO, collect_coin_audio_volume, 500);
      this.updateStatusBars();
    }, 20);
  }

  updateStatusBars() {
    this.statusBarHealth.setPercentage(this.character.characterEnergy);
    if (this.endboss) {
      this.statusBarEndboss.setPercentage(this.endboss.endbossEnergy);
    }

    this.helpFunctionUpdateStatusBar(
      this.totalCoinsInLevel,
      this.character.collectCoinsArray,
      this.statusBarCoins
    );

    this.helpFunctionUpdateStatusBar(
      this.totalBottlesInLevel,
      this.character.collectBottlesArray,
      this.statusBarBottles
    );
  }


  helpFunctionUpdateStatusBar(totalItems, collectedItemsArray, statusBar) {
    if (totalItems > 0) {
      let percentage = (collectedItemsArray.length / totalItems) * 100;
      statusBar.setPercentage(percentage);
    }
  }

  collectObjects(levelArray, characterItemArrays, audioPath, volume, timeoutMs) {
    levelArray.forEach((singleObject, index) => {
      if (this.character.isColliding(singleObject)) {
        characterItemArrays.push(singleObject);
        levelArray.splice(index, 1);
        this.playCollectibleSound(audioPath, volume, timeoutMs);
      }
    });
  }

  playCollectibleSound(audioPath, volume, timeoutMs) {
    if (!isMuted) {
      let audio = new Audio(audioPath);
      audio.play();
      audio.volume = volume;
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, timeoutMs);
    }
  }

  checkCollisionsBarrel() {
    this.resetBarrelCollisionFlags();
    let characterIsCurrentlyOnABarrel = false;

    this.level.barrelArray.forEach((barrel) => {
      this.handleLateralBarrelCollisions(barrel);
      characterIsCurrentlyOnABarrel = this.handleVerticalBarrelCollision(barrel) || characterIsCurrentlyOnABarrel;
    });

    this.updateCharacterGroundLevel(characterIsCurrentlyOnABarrel);
  }

  handleLateralBarrelCollisions(barrel) {
    if (this.character.isColliding(barrel)) {
      this.checkAndSetRightCollision(barrel);
      this.checkAndSetLeftCollision(barrel);
    }
  }

  checkAndSetRightCollision(barrel) {
    if (this.character.x + this.character.width - this.character.offset.right > barrel.x + barrel.offset.left &&
      this.character.x + this.character.offset.left < barrel.x + barrel.offset.left) {
      this.character.canMoveRight = false;
      this.character.barrelRight = true;
    }
  }

  checkAndSetLeftCollision(barrel) {
    if (this.character.x + this.character.offset.left < barrel.x + barrel.width - barrel.offset.right &&
      this.character.x + this.character.width - this.character.offset.right > barrel.x + barrel.width - barrel.offset.right) {
      this.character.canMoveLeft = false;
      this.character.barrelLeft = true;
    }
  }

  handleVerticalBarrelCollision(barrel) {
    const charBottom = this.character.y + this.character.height - this.character.offset.bottom;
    const barrelTop = barrel.y + barrel.offset.top;

    const isVerticallyAligned = charBottom >= barrelTop - 10 && charBottom <= barrelTop + 10;
    const isHorizontallyOverlapping = this.character.x + this.character.offset.left < barrel.x + barrel.width - barrel.offset.right &&
      this.character.x + this.character.width - this.character.offset.right > barrel.x + barrel.offset.left;

    if (isVerticallyAligned && isHorizontallyOverlapping) {
      this.character.isOnBarrel = true;
      this.character.groundLevel = barrelTop - (this.character.height - this.character.offset.bottom);
      return true;
    }
    return false;
  }

  updateCharacterGroundLevel(characterIsCurrentlyOnABarrel) {
    if (!characterIsCurrentlyOnABarrel) {
      this.character.isOnBarrel = false;
      this.character.groundLevel = this.character.resetsCharacterToY();
    }
  }

  resetBarrelCollisionFlags() {
    this.character.canMoveLeft = true;
    this.character.canMoveRight = true;
    this.character.barrelLeft = false;
    this.character.barrelRight = false;

  }
  //hier
  checkCollisions() {
    this.level.enemiesArray.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.handleCharacterEnemyCollision(enemy);
      }
    });

    this.character.bottles.forEach((bottle, bottleIndex) => {
      this.bottleHitSomething = false;

      this.handleBottleEnemyCollisions(bottle, bottleIndex);
      this.handleBottleBarrelCollisions(bottle);

      if (this.bottleHitSomething) {
        this.removeBottle(bottleIndex);
        // this.playBottleBreakSound();

      }
    });
  }

  handleCharacterEnemyCollision(enemy) {
    if (this.character.isAboveGround() && this.character.speedY < 0 && !enemy.isDead()) {
      this.handleCharacterJumpAttack(enemy);
    } else if (!enemy.isDead()) {
      this.character.hit();
    }
  }

  handleCharacterJumpAttack(enemy) {
    if (enemy instanceof Chicken || enemy instanceof Chick) {
      this.handleChickenJumpDeath(enemy);
    } else if (enemy instanceof Endboss) {
      this.handleEndbossJumpDamage(enemy);
    }
  }

  handleChickenJumpDeath(chicken) {
    chicken.energy = 0;
    chicken.isDeadAnimationPlayed = false;
    this.playBouncingSound();
    this.character.bounce(chicken);
    this.removeEnemyAfterDelay(chicken, 500);
  }

  handleEndbossJumpDamage(endboss) {
    this.endboss.takeBounceDamage();
    endboss.isDeadAnimationPlayed = false;
    this.playBouncingSound();
    this.character.bounce(endboss);
    if (endboss.isDead()) {
      this.removeEnemyAfterDelay(endboss, 500);
    }
  }

  playBouncingSound() {
    if (!isMuted) {
      let bouncing_audio = new Audio(PATH_BOUNCING_AUDIO);
      bouncing_audio.volume = bouncing_audio_volume;
      bouncing_audio.play();
      setTimeout(() => {
        bouncing_audio.pause();
        bouncing_audio.currentTime = 0;
      }, 500);
    }
  }
  //hier
  handleBottleEnemyCollisions(bottle, bottleIndex) {
    this.level.enemiesArray.forEach((enemy, enemyIndex) => {
      if (bottle.isColliding(enemy) && !enemy.isDead()) {
        this.bottleHitSomething = true;
        this.handleBottleHitEnemy(enemy, enemyIndex);
      }
    });
  }

  handleBottleHitEnemy(enemy, enemyIndex) {
    if (enemy instanceof Chicken || enemy instanceof Chick) {
      this.handleBottleHitChicken(enemy, enemyIndex);
    } else if (enemy instanceof Endboss) {
      this.handleBottleHitEndboss(enemy, enemyIndex);
      this.bottleHitSomething = true;
      // this.playBottleBreakSound();

    }
  }

  handleBottleHitChicken(chicken, enemyIndex) {
    chicken.energy = 0;
    chicken.isDeadAnimationPlayed = false;
    this.playChickenDeathSound();
    this.removeEnemyAfterDelay(chicken, 500, enemyIndex);
    this.bottleHitSomething = true;
    // this.playBottleBreakSound();


  }

  handleBottleBarrelCollisions(bottle) {
    this.level.barrelArray.forEach((barrel) => {
      if (bottle.isColliding(barrel)) {
        this.bottleHitSomething = true;
        // this.playBottleBreakSound();
      }
    });
  }

  removeEnemyAfterDelay(enemyToRemove, delay, indexToRemove = -1) {
    setTimeout(() => {
      const currentEnemyIndex = indexToRemove !== -1 ? indexToRemove : this.level.enemiesArray.indexOf(enemyToRemove);
      if (currentEnemyIndex > -1) {
        this.level.enemiesArray.splice(currentEnemyIndex, 1);
      }
    }, delay);
  }

  removeBottle(bottleIndex) {
    this.character.bottles.splice(bottleIndex, 1);
  }

  handleBottleHitEndboss(endboss, enemyIndex) {

    this.endboss.hit()
    this.endboss.playAnimation(this.endboss.IMAGES_HURT);

    // this.playChickenDeathSound();
    if (this.endboss.isDead()) {
      this.endboss.playAnimation(this.endboss.IMAGES_DEAD);
      this.removeEnemyAfterDelay(endboss, 500, enemyIndex);
    }
  }

  playBottleBreakSound() {
    if (!isMuted) {
      bottle_splash.play();
      bottle_splash.volume = bottle_splash_volume;
      setTimeout(() => {
        bottle_splash.pause();
        bottle_splash.currentTime = 0;
      }, 300);
    }
  }

  playChickenDeathSound() {
    if (!isMuted) {
      let chicken_death_audio = new Audio(PATH_CHICKEN_DEATH_AUDIO);
      chicken_death_audio.volume = chicken_death_audio_volume;
      chicken_death_audio.play();
      setTimeout(() => {
        chicken_death_audio.pause();
        chicken_death_audio.currentTime = 0;
      }, 500);
    }
  }




  // checkCollisions() {
  //   this.level.enemiesArray.forEach((enemy) => {
  //     if (this.character.isColliding(enemy)) {

  //       if (this.character.isAboveGround() && this.character.speedY < 0 && !enemy.isDead()) {
  //         if (enemy instanceof Chicken || enemy instanceof Chick) {
  //           enemy.energy = 0;
  //           enemy.isDeadAnimationPlayed = false;

  //           if (!isMuted) {
  //             let bouncing_audio = new Audio(PATH_BOUNCING_AUDIO);
  //             bouncing_audio.volume = bouncing_audio_volume;
  //             bouncing_audio.play();
  //             setTimeout(() => {
  //               bouncing_audio.pause();
  //               bouncing_audio.currentTime = 0;
  //             }, 500);
  //           }

  //           this.character.bounce(enemy);
  //           setTimeout(() => {

  //             const currentEnemyIndex = this.level.enemiesArray.indexOf(enemy);
  //             if (currentEnemyIndex > -1) {
  //               this.level.enemiesArray.splice(currentEnemyIndex, 1);
  //             }
  //           }, 500);
  //           // Endboss
  //         } else if (enemy instanceof Endboss) {

  //           this.endboss.takeBounceDamage();


  //           enemy.isDeadAnimationPlayed = false;

  //           if (!isMuted) {
  //             let bouncing_audio = new Audio(PATH_BOUNCING_AUDIO);
  //             bouncing_audio.volume = bouncing_audio_volume;
  //             bouncing_audio.play();
  //             setTimeout(() => {
  //               bouncing_audio.pause();
  //               bouncing_audio.currentTime = 0;
  //             }, 500);
  //           }

  //           this.character.bounce(enemy);

  //           if (enemy.isDead()) {
  //             setTimeout(() => {
  //               const currentEnemyIndex = this.level.enemiesArray.indexOf(enemy);
  //               if (currentEnemyIndex > -1) {
  //                 this.level.enemiesArray.splice(currentEnemyIndex, 1);
  //               }
  //             }, 500);
  //           }
  //         }
  //       } else if (!enemy.isDead()) {
  //         this.character.hit();
  //       }
  //     }
  //   });

  //   // Bottle collisions with enemies and barrels
  //   this.character.bottles.forEach((bottle, bottleIndex) => {
  //     this.bottleHitSomething = false;

  //     // Check collision with enemies
  //     this.level.enemiesArray.forEach((enemy, enemyIndex) => {
  //       if (bottle.isColliding(enemy) && !enemy.isDead()) {
  //         this.bottleHitSomething = true;

  //         if (enemy instanceof Chicken || enemy instanceof Chick) {
  //           enemy.energy = 0;
  //           enemy.isDeadAnimationPlayed = false;
  //           if (!isMuted) {
  //             let chicken_death_audio = new Audio(PATH_CHICKEN_DEATH_AUDIO);
  //             chicken_death_audio.volume = chicken_death_audio_volume;
  //             chicken_death_audio.play();
  //             setTimeout(() => {
  //               chicken_death_audio.pause();
  //               chicken_death_audio.currentTime = 0;
  //             }, 500);
  //           }
  //           setTimeout(() => {
  //             this.level.enemiesArray.splice(enemyIndex, 1);
  //           }, 500);
  //         }

  //         if (enemy instanceof Endboss) {
  //           this.endboss.hit();
  //           enemy.isDeadAnimationPlayed = false;
  //           if (!isMuted) {
  //             let chicken_death_audio = new Audio(PATH_CHICKEN_DEATH_AUDIO);
  //             chicken_death_audio.volume = chicken_death_audio_volume;
  //             chicken_death_audio.play();
  //             setTimeout(() => {
  //               chicken_death_audio.pause();
  //               chicken_death_audio.currentTime = 0;
  //             }, 500);
  //           }


  //           if (this.endboss.isDead()) {
  //             this.playAnimation(this.IMAGES_DEAD);

  //             setTimeout(() => {
  //               this.level.enemiesArray.splice(enemyIndex, 1);
  //             }, 500);
  //           }
  //         }
  //       }
  //     });

  //     // Check collision with barrels
  //     this.level.barrelArray.forEach((barrel) => {
  //       if (bottle.isColliding(barrel)) {
  //         this.bottleHitSomething = true;

  //         if (!isMuted) {
  //           bottle_splash.play();
  //           bottle_splash.volume = bottle_splash_volume;
  //           setTimeout(() => {
  //             bottle_break_audio.pause();
  //             bottle_break_audio.currentTime = 0;
  //           }, 300);
  //         }
  //       }
  //     });

  //     if (this.bottleHitSomething) {
  //       this.character.bottles.splice(bottleIndex, 1);
  //     }
  //   });
  // }



  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjectsArray);
    this.addObjectsToMap(this.level.cloudsArray);
    this.ctx.translate(-this.camera_x, 0);
    // ------------Space for fixed objects-----------
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    if (this.showEndbossStatusBar) {
      this.addToMap(this.statusBarEndboss);
    }

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.coinsArray);
    this.addObjectsToMap(this.level.barrelArray);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemiesArray);
    this.addObjectsToMap(this.level.bottlesArray);
    this.addObjectsToMap(this.character.bottles);
    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach(object => {
      this.addToMap(object);
    });
  }

  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.draw(this.ctx);
    // movableObject.drawRedFrame(this.ctx)
    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
    if (movableObject instanceof Character && movableObject.showSpeechBubble) {
      movableObject.drawSpeechBubbleImage(this.ctx, movableObject.IMAGE_SPEECH_BUBBLE);
    }
  }

  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1)
    movableObject.x = movableObject.x * -1;
  }

  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }


}