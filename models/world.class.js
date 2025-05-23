class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBarHealth = new StatusBar('health');
  statusBarCoins = new StatusBar('coins');
  statusBarBottles = new StatusBar('bottle');

  totalCoinsInLevel;
  totalBottlesInLevel;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.allwaysExecuted();

    this.totalCoinsInLevel = this.level.coinsArray.length;
    this.totalBottlesInLevel = this.level.bottlesArray.length;

  }


  setWorld() {
    this.character.world = this;
  }

  allwaysExecuted() {
    setInterval(() => {
      this.checkCollisions();
      this.collectObjects(this.level.bottlesArray, this.character.throwableBottleArray, PATH_COLLECT_BOTTLE_AUDIO, collect_bottle_audio_volume, 800);
      this.collectObjects(this.level.coinsArray, this.character.collectCoinsArray, PATH_COLLECT_COIN_AUDIO, collect_coin_audio_volume, 500);
      this.updateStatusBars();
    }, 50);
  }

  updateStatusBars() {

    this.statusBarHealth.setPercentage(this.character.energy);

    if (this.totalCoinsInLevel > 0) {
      let collectedCoins = this.character.collectCoinsArray.length;
      let percentage = (collectedCoins / this.totalCoinsInLevel) * 100;
      this.statusBarCoins.setPercentage(percentage);
    } else {
      this.statusBarCoins.setPercentage(100);
    }

    if (this.totalBottlesInLevel > 0) {
      let currentBottles = this.character.throwableBottleArray.length;
      let percentage = (currentBottles / this.totalBottlesInLevel) * 100;
      this.statusBarBottles.setPercentage(Math.min(percentage, 100));
    } else {
      this.statusBarBottles.setPercentage(100);
    }
  }




  collectObjects(levelArray, characterItemArrays, audioPath, volume, timeoutMs) {
    levelArray.forEach((singleObject, index) => {
      if (this.character.isColliding(singleObject)) {
        characterItemArrays.push(singleObject);
        levelArray.splice(index, 1);

        if (!isMuted) {
          let audio = new Audio(audioPath);
          audio.play();
          audio.volume = volume
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, timeoutMs);
        }
      }
    });
  }

  checkCollisions() {
    this.level.enemiesArray.forEach((enemy, index) => {
      if (this.character.isColliding(enemy)) {

        if (this.character.isAboveGround() && this.character.speedY < 0 && (enemy instanceof Chicken || enemy instanceof Chick) && !enemy.isDead()) {
          enemy.energy = 0;
          enemy.isDeadAnimationPlayed = false;

          if (!isMuted) {
            let bouncing_audio = new Audio(PATH_BOUNCING_AUDIO);
            bouncing_audio.volume = bouncing_audio_volume;
            bouncing_audio.play();
            setTimeout(() => {
              bouncing_audio.pause();
              bouncing_audio.currentTime = 0;
            }, 500);
          }

          this.character.bounce();
          this.character.resetsCharacterToY();

          setTimeout(() => {
            this.level.enemiesArray.splice(index, 1);
          }, 500);
        } else if (!enemy.isDead()) {
          this.character.hit();
          // Gesundheitsleiste wird über updateStatusBars() regelmäßig aktualisiert
        }
      }
    });

    //throwing bottle
    this.character.bottles.forEach((bottle, bottleIndex) => {
      this.level.enemiesArray.forEach((enemy, enemyIndex) => {
        if (bottle.isColliding(enemy) && !enemy.isDead()) {

          if (enemy instanceof Chicken || enemy instanceof Chick) {
            enemy.energy = 0;
            enemy.isDeadAnimationPlayed = false;
            if (!isMuted) {
              let chicken_death_audio = new Audio(PATH_CHICKEN_DEATH_AUDIO);
              chicken_death_audio.volume = chicken_death_audio_volume;
              chicken_death_audio.play();
              setTimeout(() => {
                chicken_death_audio.pause();
                chicken_death_audio.currentTime = 0;
              }, 500);
            }
            setTimeout(() => {
              this.level.enemiesArray.splice(enemyIndex, 1);
            }, 500);
          }

        }
      });
    });
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
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);

    this.addObjectsToMap(this.level.enemiesArray);
    // this.addObjectsToMap(this.character.throwableBottleArray);
    this.addObjectsToMap(this.level.bottlesArray)
    this.addObjectsToMap(this.level.coinsArray)

    this.addObjectsToMap(this.character.bottles)
    // this.addObjectsToMap(this.level.barrel)


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

    movableObject.draw(this.ctx)
    movableObject.drawBlueFrame(this.ctx)
    movableObject.drawRedFrame(this.ctx)



    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
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