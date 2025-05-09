class MovableObject extends DrawableObject {   
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    offset = {
        top:0,
        left:0,
        right:0,
        bottom:0
      };

    applyGravity(){
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        },1000 / 25);
    }

    isAboveGround(){
       if(this instanceof ThrowableObject){
        return true;
       } else {
         return this.y < 155;
       }
    }

    hit(){
        this.energy -= 5;
        if(this.energy < 0){
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isDead(){
        return this.energy == 0;
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.4;

    }

    // isColliding(chicken) beispiel
    // isColliding(movableObject){
    //     return this.x + this.width > movableObject.x &&
    //     this.y + this.height > movableObject.y &&
    //     this.x < movableObject.x +movableObject.width &&
    //     this.y < movableObject.y + movableObject.height;
    // }

    isColliding(movableObject){
        return this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
        this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
        this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
        this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft(){
        this.x -= this.speed;
    }

    playAnimation(images){
        let index = this.currentImage % images.length; // modulo let index = 0 % 6;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump(){
        this.speedY = 25;

    }


}