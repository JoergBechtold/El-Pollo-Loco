class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;
    groundLevel = 348;
    isDeadAnimationPlayed = false;
    isImmune = false;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

            if (this instanceof Character) {
                if (!this.isAboveGround() && this.speedY <= 0) {
                    if (this.y > 155) {
                        this.y = 155;
                    }
                    this.speedY = 0;
                }
            }
        }, 1000 / 35);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < this.groundLevel;
        } else {
            return this.y < 155;
        }
    }


    hit() {

        if (this.isImmune) {
            return;
        }

        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
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

    barrelCollidingX(movableObject) {
        return this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
            this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right
    }

    barrelCollidingY(movableObject) {
        return this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
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


    bounce(enemy) {
        this.isImmune = true;
        this.speedY = 17;

        this.y = enemy.y - this.height + enemy.offset.top;

        setTimeout(() => {
            this.isImmune = false;
        }, 200);
    }




}