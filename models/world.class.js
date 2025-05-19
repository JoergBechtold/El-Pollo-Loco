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
  lastThrow = 0;
  throwInterval = 500;
  bottles = [];


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
      this.checkThrowBottles();
    }, 200);
  }

  checkThrowBottles() {
    if (this.keyboard.D) {
      let currentTime = new Date().getTime();
      let timeSinceLastThrow = currentTime - this.lastThrow;


      if (timeSinceLastThrow >= this.throwInterval) {
        let bottle = new ThrowableObject(this.character.x + 80, this.character.y + 130);
        this.bottles.push(bottle);
        this.lastThrow = currentTime;
      }
    }
  }


  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.energy)
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);

    this.ctx.translate(-this.camera_x, 0);
    // ------------Space for fixed objects-----------
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);

    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.bottles);
    this.addObjectsToMap(this.level.bottle)
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