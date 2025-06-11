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

  worldInterval;


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
    this.worldInterval = setInterval(() => {
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
    if (!isMuted && !isGameFinish) {
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
    // this.playBouncingSound();
    this.playEnemyBounceDeadSound();
    this.character.bounce(chicken);
    this.removeEnemyAfterDelay(chicken, 500);
  }

  handleEndbossJumpDamage(endboss) {
    this.endboss.takeBounceDamage();
    endboss.isDeadAnimationPlayed = false;
    this.playBouncingSound();
    this.character.bounce(endboss);
    if (endboss.isDead()) {
      // this.removeEnemyAfterDelay(endboss, 500);
    }
  }

  playBouncingSound() {
    if (!isMuted && !isGameFinish) {
      let bouncing_audio = new Audio(PATH_BOUNCING_AUDIO);
      bouncing_audio.volume = bouncing_audio_volume;
      bouncing_audio.play();
      setTimeout(() => {
        bouncing_audio.pause();
        bouncing_audio.currentTime = 0;
      }, 500);
    }
  }

  playEnemyBounceDeadSound() {
    if (!isMuted && !isGameFinish) {
      let enemy_bouncing_dead_audio = new Audio(PATH_CHICKEN_DEATH_JUMP_AUDIO);
      enemy_bouncing_dead_audio.volume = enemy_bouncing_dead_audio_volume;
      enemy_bouncing_dead_audio.play();
      setTimeout(() => {
        enemy_bouncing_dead_audio.pause();
        enemy_bouncing_dead_audio.currentTime = 0;
      }, 800);
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
  }

  playBottleBreakSound() {
    if (!isMuted && !isGameFinish) {
      bottle_splash.play();
      bottle_splash.volume = bottle_splash_volume;
      setTimeout(() => {
        bottle_splash.pause();
        bottle_splash.currentTime = 0;
      }, 300);
    }
  }

  playChickenDeathSound() {
    if (!isMuted && !isGameFinish) {
      let chicken_death_audio = new Audio(PATH_CHICKEN_DEATH_AUDIO);
      chicken_death_audio.volume = chicken_death_audio_volume;
      chicken_death_audio.play();
      setTimeout(() => {
        chicken_death_audio.pause();
        chicken_death_audio.currentTime = 0;
      }, 1000);
    }
  }

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

  // stopAllIntervals() {
  //   // Stoppe das Haupt-Intervall der World-Klasse
  //   if (this.worldInterval) {
  //     clearInterval(this.worldInterval);
  //     this.worldInterval = null;
  //   }

  //   // Stoppe Intervalle des Charakters
  //   if (this.character && typeof this.character.stopAllIntervals === 'function') {
  //     this.character.stopAllIntervals();
  //   }

  //   // Stoppe Intervalle aller Gegner
  //   this.level.enemiesArray.forEach(enemy => {
  //     if (enemy && typeof enemy.stopAllIntervals === 'function') {
  //       enemy.stopAllIntervals();
  //     }
  //   });

  //   // Stoppe Intervalle aller geworfenen Flaschen
  //   // Es ist wichtig, dass dieser Teil des Arrays geleert wird, da Flaschen sich selbst entfernen
  //   // aber wenn die Flasche noch existiert und nicht explodiert ist, sollten ihre Intervalle gestoppt werden.
  //   // Die Flaschen sollten sich selbst aus dem Array entfernen und ihre Intervalle stoppen,
  //   // aber hier als Backup, falls noch welche da sind.
  //   this.character.bottles.forEach(bottle => {
  //     if (bottle && typeof bottle.stopAllIntervals === 'function') {
  //       bottle.stopAllIntervals();
  //     }
  //   });
  //   // Leere das Array nach dem Stoppen der Intervalle, um sicherzustellen, dass keine Referenzen übrig bleiben.
  //   this.character.bottles = [];


  //   // Optionale: Spielmusik stoppen
  //   if (typeof game_music !== 'undefined' && typeof game_music.pause === 'function') {
  //     game_music.pause();
  //     game_music.currentTime = 0;
  //   }
  //   if (typeof endboss_music !== 'undefined' && typeof endboss_music.pause === 'function') {
  //     endboss_music.pause();
  //     endboss_music.currentTime = 0;
  //   }

  //   // Wenn du weitere globale Intervalle oder Sounds hast, die außerhalb von Klassen verwaltet werden,
  //   // musst du sie hier ebenfalls stoppen.
  // }

  stopAllIntervals() {
    // Stoppe das Haupt-Intervall der World-Klasse
    if (this.worldInterval) {
      clearInterval(this.worldInterval);
      this.worldInterval = null;
    }

    // Stoppe Intervalle des Charakters
    if (this.character && typeof this.character.stopAllIntervals === 'function') {
      this.character.stopAllIntervals();
    }

    // Stoppe Intervalle aller Gegner (Endboss, Chicken, Chick)
    this.level.enemiesArray.forEach(enemy => {
      if (enemy && typeof enemy.stopAllIntervals === 'function') {
        enemy.stopAllIntervals();
      }
    });

    // Stoppe Intervalle aller geworfenen Flaschen
    // Da Flaschen sich beim Aufprall selbst entfernen, sollten sie ihre Intervalle selbst stoppen.
    // Dieser Teil ist eine zusätzliche Absicherung für den Fall, dass Flaschen noch in der Luft sind.
    this.character.bottles.forEach(bottle => {
      if (bottle && typeof bottle.stopAllIntervals === 'function') {
        bottle.stopAllIntervals();
      }
    });
    // Optional: Leere das Array, damit bei Resume keine alten Flaschen wiederbelebt werden
    // this.character.bottles = []; // Nur wenn Sie sicherstellen wollen, dass Flaschen komplett verschwinden

    // --- HIER MUSS DIE LOGIK FÜR COINS HIN ---
    // Stoppe Intervalle aller Münzen
    if (this.level.coinsArray) { // Prüfen, ob coinsArray existiert
      this.level.coinsArray.forEach(coin => {
        if (coin && typeof coin.stopAllIntervals === 'function') {
          coin.stopAllIntervals();
        }
      });
    }

    // --- HIER MUSS DIE LOGIK FÜR CLOUDS HIN ---
    // Stoppe Intervalle aller Wolken
    if (this.level.cloudsArray) { // Prüfen, ob cloudsArray existiert
      this.level.cloudsArray.forEach(cloud => {
        if (cloud && typeof cloud.stopAllIntervals === 'function') {
          cloud.stopAllIntervals();
        }
      });
    }

    // Globale Spielmusik und Sounds pausieren
    if (typeof game_music !== 'undefined' && typeof game_music.pause === 'function') {
      game_music.pause();
      game_music.currentTime = 0;
    }
    if (typeof endboss_music !== 'undefined' && typeof endboss_music.pause === 'function') {
      endboss_music.pause();
      endboss_music.currentTime = 0;
    }
    allAudioArray.forEach(audio => { // Pause alle bekannten Audio-Objekte
      if (audio && typeof audio.pause === 'function') {
        audio.pause();
      }
    });
  }

  /**
   * Startet alle Intervalle der World-Instanz und aller verwalteten Objekte neu.
   * Dies wird beim Fortsetzen des Spiels nach einer Pause aufgerufen.
   */
  startAllIntervals() {
    this.allwaysExecuted(); // Startet das Haupt-Intervall der World-Klasse neu

    // Starte Intervalle des Charakters neu
    if (this.character && typeof this.character.startAllIntervals === 'function') {
      this.character.startAllIntervals();
    }

    // Starte Intervalle aller lebenden Gegner neu
    this.level.enemiesArray.forEach(enemy => {
      if (enemy && !enemy.isDead() && typeof enemy.startAllIntervals === 'function') {
        enemy.startAllIntervals();
      }
    });

    // --- HIER MUSS DIE LOGIK FÜR COINS HIN ---
    // Starte Intervalle aller Münzen neu
    if (this.level.coinsArray) {
      this.level.coinsArray.forEach(coin => {
        // Nur Münzen neu starten, die noch nicht eingesammelt wurden
        // (falls Sie eine `isCollected` Eigenschaft in der Coin-Klasse haben)
        // if (coin && !coin.isCollected && typeof coin.startAllIntervals === 'function') {
        if (coin && typeof coin.startAllIntervals === 'function') { // Wenn keine isCollected-Eigenschaft
          coin.startAllIntervals();
        }
      });
    }

    // --- HIER MUSS DIE LOGIK FÜR CLOUDS HIN ---
    // Starte Intervalle aller Wolken neu
    if (this.level.cloudsArray) {
      this.level.cloudsArray.forEach(cloud => {
        if (cloud && typeof cloud.startAllIntervals === 'function') {
          cloud.startAllIntervals();
        }
      });
    }

    // Globale Spielmusik und Sounds fortsetzen
    if (typeof game_music !== 'undefined' && typeof game_music.play === 'function') {
      game_music.play();
    }
    // Endboss-Musik fortsetzen, falls sie aktiv war (prüfe Endboss-Zustand)
    if (this.endboss && this.endboss.endbossActivated && typeof endboss_music !== 'undefined' && typeof endboss_music.play === 'function') {
      endboss_music.play();
    }
  }


}