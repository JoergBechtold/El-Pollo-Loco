class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  bottles = [];
  

  constructor(canvas, keyboard){
   this.ctx = canvas.getContext('2d');
   this.canvas = canvas;
   this.keyboard = keyboard;
   this.draw();
   this.setWorld();
   this.allwaysExecuted();
  }

  setWorld(){
    this.character.world = this;
  }

  allwaysExecuted(){
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowBottles();
    }, 200);
  }

  checkThrowBottles(){
    setInterval(() => {
      if(this.keyboard.D){
      let bottle = new ThrowableObject(this.character.x + 80, this.character.y + 130);
      this.bottles.push(bottle); 
    }
    }, 1000);
  }

  checkCollisions(){
    this.level.enemies.forEach( (enemy) => {
       if (this.character.isColliding(enemy)) {
        this.character.hit();
       this.statusBar.setPercentage(this.character.energy )
       }
      });
  }

  draw(){
    this.ctx.clearRect(0 ,0, this.canvas.width, this.canvas.height)

    this.ctx.translate(this.camera_x, 0); 
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
 
    this.ctx.translate(-this.camera_x, 0); 
    // ------------Space for fixed objects-----------
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0); 

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.bottles);

    this.ctx.translate(-this.camera_x, 0); 
 
    let self = this;
    requestAnimationFrame(function(){
        self.draw();
    });
  }  

  addObjectsToMap(objects){
    objects.forEach(object => {
        this.addToMap(object);
    });
  }

  addToMap(movableObject){
    if(movableObject.otherDirection){
      this.flipImage(movableObject);
    }

    movableObject.draw(this.ctx)
    movableObject.drawFrame(this.ctx)
    // movableObject.drawRedFrame(this.ctx)


    if(movableObject.otherDirection){
      this.flipImageBack(movableObject);
    }
  }

  flipImage(movableObject){
    this.ctx.save();
      this.ctx.translate(movableObject.width, 0);
      this.ctx.scale(-1, 1)
      movableObject.x = movableObject.x * -1;
  }

  flipImageBack(movableObject){
      movableObject.x = movableObject.x * -1;
      this.ctx.restore();
  }
}