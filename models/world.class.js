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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.allwaysExecuted();
  }


  setWorld() {
    this.character.world = this;
  }

  allwaysExecuted() {
    setInterval(() => {
      this.checkCollisions();
      this.collectBottleObject();
      this.collectCoinObject();
    }, 50);
  }

  collectBottleObject() {
    this.level.bottlesArray.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.character.throwableBottleArray.push(bottle);
        this.level.bottlesArray.splice(index, 1);
        // collect_bottle_audio.play();
        let collect_bottle_audio = new Audio('assets/audio/collect-bottle.mp3');
        collect_bottle_audio.volume = 1;
        collect_bottle_audio.play();

        setTimeout(() => {
          collect_bottle_audio.pause();
          collect_bottle_audio.currentTime = 0;
        }, 800);
      }
    });

  }

  collectCoinObject() {
    this.level.coinsArray.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.CollectCoinsArray.push(coin);
        this.level.coinsArray.splice(index, 1);
        // collect_coin_audio.play();
        let collect_coin_audio = new Audio('assets/audio/collect-coin.mp3');
        collect_coin_audio.volume = 0.5;
        collect_coin_audio.play();



        setTimeout(() => {
          collect_coin_audio.pause();
          collect_coin_audio.currentTime = 0;
        }, 500);
      }
    });
  }

  checkCollisions() {
    this.level.enemiesArray.forEach((enemy, index) => {
      if (this.character.isColliding(enemy)) {

        if (this.character.isAboveGround() && this.character.speedY < 0) {
          if (enemy instanceof Chicken && !enemy.isDead()) {
            enemy.energy = 0;
            enemy.isDeadAnimationPlayed = false;

            let bounceSound = new Audio('assets/audio/bouncing.mp3');
            bounceSound.volume = 0.5;
            bounceSound.play();

            this.character.bounce();
            this.character.resetsCharacterToY();



            setTimeout(() => {
              this.level.enemiesArray.splice(index, 1);
              bounceSound.pause();
              bounceSound.currentTime = 0;
            }, 500);
          } else if (!this.character.isAboveGround()) {
            this.character.hit();
            this.statusBarHealth.setPercentage(this.character.energy);
          }
        } else if (!this.character.isAboveGround() && !enemy.isDead()) {
          this.character.hit();
          this.statusBarHealth.setPercentage(this.character.energy);
        }
      }
    });

    // flaschen treffer
    this.character.bottles.forEach((bottle, bottleIndex) => {
      this.level.enemiesArray.forEach((enemy, enemyIndex) => {
        if (bottle.isColliding(enemy) && !enemy.isDead()) {
          console.log('treffer');

          // let bounceSound = new Audio('assets/audio/bouncing.mp3');
          // bounceSound.volume = 0.5;
          // bounceSound.play();



          if (enemy instanceof Chicken) {
            enemy.energy = 0;
            enemy.isDeadAnimationPlayed = false;
            setTimeout(() => {
              this.level.enemiesArray.splice(enemyIndex, 1);
            }, 500);
          }

          // this.character.bottles.splice(bottleIndex, 1);
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