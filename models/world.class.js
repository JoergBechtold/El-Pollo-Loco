class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;


    constructor(canvas, keyboard){
     this.ctx = canvas.getContext('2d');
     this.canvas = canvas;
     this.keyboard = keyboard;
     this.draw();
     this.setWorld();
    }

  setWorld(){
    this.character.world = this;
  }

  draw(){
    this.ctx.clearRect(0 ,0, this.canvas.width, this.canvas.height)

    this.ctx.translate(this.camera_x, 0); 

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);

    this.ctx.translate(-this.camera_x, 0); 
    // Draw() wird immer wieder aufgerufen
    // self wird gesetzt weil this in der function nicht geht
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

    this.ctx.drawImage(movableObject.img, movableObject.x, movableObject.y, movableObject.width, movableObject.height);

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