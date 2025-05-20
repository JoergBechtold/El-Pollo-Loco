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

      // this.checkThrowBottles();
      // this.checkBottleCollision();
    }, 50);
  }

  checkThrowBottles() {
    // if (this.world.keyboard.D) {
    //   let currentTime = new Date().getTime();
    //   let timeSinceLastThrow = currentTime - this.lastThrow;

    //   if (timeSinceLastThrow >= this.throwInterval) {
    //     let bottle = new ThrowableObject(this.x + 80, this.y + 130);
    //     this.bottles.push(bottle);
    //     this.lastThrow = currentTime;

    //   }
    // }
    // if (this.keyboard.D) {
    //   let currentTime = new Date().getTime();
    //   let timeSinceLastThrow = currentTime - this.lastThrow;


    //   if (timeSinceLastThrow >= this.throwInterval) {
    //     let bottle = new ThrowableObject(this.character.x + 80, this.character.y + 130);
    //     this.bottles.push(bottle);
    //     this.lastThrow = currentTime;

    //     this.level.enemies.forEach((enemy) => {
    //       if (bottle.isColliding(enemy)) {
    //         console.log('treffer');

    //       }
    //     });
    //   }
    // }
  }

  // collectBottleObject() {
  //   this.level.bottles.forEach((bottle) => {
  //     if (this.character.isColliding(bottle)) {
  //       console.log('flasche eingesammelt');

  //       this.character.bottles.push(bottle);


  //     }
  //   });
  // }

  collectBottleObject() {
    this.level.bottlesArray.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.character.throwableBottleArray.push(bottle);
        this.level.bottlesArray.splice(index, 1);
        collect_bottle_audio.play();

        setTimeout(() => {
          collect_bottle_audio.pause();
          collect_bottle_audio.currentTime = 0;
        }, 1100);
      }
    });

  }

  collectCoinObject() {
    this.level.coinsArray.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.CollectCoinsArray.push(coin);
        this.level.coinsArray.splice(index, 1);
        collect_coin_audio.play();

        setTimeout(() => {
          collect_coin_audio.pause();
          collect_coin_audio.currentTime = 0;
        }, 500);
      }
    });
  }




  checkCollisions() {
    this.level.enemiesArray.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.energy)
      }
    });
  }

  checkBottleCollision() {
    this.level.enemiesArray.forEach((enemy) => {
      if (this.bottle.isColliding(enemy)) {
        console.log('treffer 1');
      }
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