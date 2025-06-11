class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    lastHit = 0;
    groundLevel;
    isDeadAnimationPlayed = false;
    isImmune = false;
    enemyFollowCharacterAnimationInterval;
    applyGravityInterval;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    constructor() {
        super();
    }


    applyGravity() {
        this.applyGravityInterval = setInterval(() => {

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




    hit() {
        if (this.isImmune) {
            return;
        }

        if (this instanceof Character) {
            this.characterEnergy -= 5;
            if (this.characterEnergy < 0) {
                this.characterEnergy = 0;
            }
        } else if (this instanceof Endboss) {
            this.endbossEnergy -= 25;
            console.log('Endboss getroffen! Energie: ' + this.endbossEnergy);
            if (this.endbossEnergy < 0) {
                this.endbossEnergy = 0;
            }
        }


        this.lastHit = new Date().getTime();
    }

    takeBounceDamage() {
        if (this.isImmune) {
            return;
        }
        this.endbossEnergy -= 15;
        if (this.endbossEnergy < 0) {
            this.endbossEnergy = 0;
        }
        this.lastHit = new Date().getTime();
    }



    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.4;
    }

    isDead() {
        if (this.isImmune) return
        if (this instanceof Endboss) return this.endbossEnergy == 0
        if (this instanceof Character) return this.characterEnergy == 0

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
        this.enemyFollowCharacterAnimationInterval = setInterval(() => {
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

    stopAllIntervals() {
        if (this.enemyFollowCharacterAnimationInterval) {
            clearInterval(this.enemyFollowCharacterAnimationInterval);
            this.enemyFollowCharacterAnimationInterval = null;
        }

        if (this.applyGravityInterval) {
            clearInterval(this.applyGravityInterval);
            this.applyGravityInterval = null;
        }
    }




}