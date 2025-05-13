class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
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
      // this.checkCollisions();
      this.checkThrowBottles();
    }, 200);
  }

  // checkThrowBottles() {
  //   setTimeout(() => {
  //     if (this.keyboard.D) {
  //       let bottle = new ThrowableObject(this.character.x + 80, this.character.y + 130);
  //       this.bottles.push(bottle);

  //     }
  //   }, 3000);
  // }

  checkThrowBottles() {
    let canThrowDown = true;
    let canThrowUp = true;


    window.addEventListener('keydown', (e) => {
      if (e.key === 'd' && canThrowDown && !e.repeat) {
        canThrowDown = false;
        let bottle = new ThrowableObject(this.character.x + 80, this.character.y + 130);
        this.bottles.push(bottle);

        setTimeout(() => {
          canThrowDown = true;
          console.log('keydown');

        }, 2000);
      }
    })

    // window.addEventListener('keyup', (e) => {
    //   if (e.key === 'd' && canThrowUp) {
    //     canThrowUp = false;
    //     let bottle = new ThrowableObject(this.character.x + 80, this.character.y + 130);
    //     this.bottles.push(bottle);

    //     setTimeout(() => {
    //       canThrowUp = true;
    //       console.log('keyup');


    //     }, 2000);
    //   }

    // })
  }










  // checkThrowBottles() {
  //   let start = new Date().getTime();
  //   setInterval(() => {
  //     let currentTime = new Date().getTime();
  //     let delta = currentTime - start;
  //     if (this.keyboard.D && delta > 3000) {
  //       let bottle = new ThrowableObject(this.character.x + 80, this.character.y + 130);
  //       this.bottles.push(bottle);
  //       start = new Date().getTime();
  //     }
  //   }, 1000);
  // }






  // checkThrowBottles() {
  //   let start = new Date().getTime();
  //   setInterval(() => {
  //     let currentTime = new Date().getTime();
  //     let delta = currentTime - start;
  //     if (delta > 1000) {
  //       if (this.keyboard.D && delta > 500) {
  //         let bottle = new ThrowableObject(this.character.x + 80, this.character.y + 130);
  //         this.bottles.push(bottle);
  //         start = new Date().getTime();
  //       }
  //     }

  //   }, 100);
  // }



  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy)
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
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);

    // this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.bottles);

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