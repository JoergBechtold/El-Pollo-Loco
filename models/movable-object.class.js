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


    loadImage(path){
        this.img = new Image();
        this.img.src = path;
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