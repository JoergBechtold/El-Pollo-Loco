class MovableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;    
    img;
    imageCache = {};
    currentImage = 0;
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
            if(this.isAboceGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        },1000 / 25);
    }

    isAboceGround(){
        return this.y < 155;
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


    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx){
     ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx){
        // instanceof ist dafür das es nur für die klassen angewendet wird
        if(this instanceof Character || this instanceof Chicken || this instanceof Endboss){
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

   
    // isColliding(chicken) beispiel
    isColliding(movableObject){
        return this.x + this.width > movableObject.x &&
        this.y + this.height > movableObject.y &&
        this.x < movableObject.x +movableObject.width &&
        this.y < movableObject.y + movableObject.height;
    }

    isColliding(movableObject){
        return this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
        this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
        this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
        this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom;
    }

    loadImages(array){
       array.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
       });
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