class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    characterEnergy = 100;
    endbossEnergy = 100;
    lastHit = 0;
    groundLevel;
    isDeadAnimationPlayed = false;
    isImmune = false;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    constructor() {
        super();
        if (this instanceof Character) {
            this.groundLevel = 155;
        } else if (this instanceof Chick) {
            this.groundLevel = 370;
        } else if (this instanceof ThrowableObject) {
            this.groundLevel = 350;
        }
    }

    applyGravity() {
        setInterval(() => {

            if (this instanceof Character && this.isOnBarrel) {

                if (this.y >= this.groundLevel && this.speedY <= 0) {
                    this.y = this.groundLevel;
                    this.speedY = 0;
                } else {
                    this.y -= this.speedY;
                    this.speedY -= this.acceleration;
                }
            } else {

                if (this.y < this.groundLevel || this.speedY > 0) {
                    this.y -= this.speedY;
                    this.speedY -= this.acceleration;
                } else {
                    this.y = this.groundLevel;
                    this.speedY = 0;
                }
            }
        }, 1000 / 35);
    }



    isAboveGround() {

        return this.y < this.groundLevel;

    }



    // hit() {

    //     if (this.isImmune) {
    //         return;
    //     }

    //     if (this instanceof Character)
    //         this.characterEnergy -= 5;
    //     if (this.characterEnergy < 0) {
    //         this.characterEnergy = 0;
    //     } else {
    //         this.lastHit = new Date().getTime();
    //     }

    //     if (this instanceof Endboss)
    //         this.endbossEnergy -= 2;
    //     if (this.endbossEnergy < 0) {
    //         this.endbossEnergy = 0;
    //     } else {
    //         this.lastHit = new Date().getTime();
    //     }
    // }

    hit() {

        if (this.isImmune) {
            return;
        }


        if (this instanceof Character) {
            this.characterEnergy -= 5;
        }


        if (this.characterEnergy < 0) {
            this.characterEnergy = 0;
        } else {

            this.lastHit = new Date().getTime();
        }


        if (this instanceof Endboss) {
            this.endbossEnergy -= 2;
        }
        if (this.endbossEnergy < 0) {
            this.endbossEnergy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.4;

    }

    isDead() {
        if (this.isImmune) {
            return;
        }
        return this.energy == 0;
    }


    isColliding(movableObject) {
        return this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
            this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
            this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
            this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }



    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump() {
        this.speedY = 26;

    }




    chickJump() {
        this.speedY = 10 + Math.random() * 20;
    }


    bounce(enemy) {
        this.isImmune = true;
        this.speedY = 17;

        this.y = enemy.y - this.height + enemy.offset.top;

        setTimeout(() => {
            this.isImmune = false;
        }, 200);
    }

    enemyFollowCharacterAnimation() {
        setInterval(() => {
            if (!this.isDead()) {

                if (this.character) {

                    if (this.character.x > this.x + 10) {
                        this.moveRight();
                        this.otherDirection = true;
                    }

                    else if (this.character.x < this.x - 10) {
                        this.moveLeft();
                        this.otherDirection = false;
                    }

                } else {

                    this.moveLeft();
                    this.otherDirection = false;
                }
            }
        }, 1000 / 60);
    }




}