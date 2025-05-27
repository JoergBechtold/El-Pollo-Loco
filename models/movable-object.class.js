class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
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
            this.groundLevel = 155; // Spezifischer Bodenlevel für den Charakter
        } else if (this instanceof Chick) {
            this.groundLevel = 370; // Spezifischer Bodenlevel für das Küken
        } else if (this instanceof ThrowableObject) {
            this.groundLevel = 350; // Spezifischer Bodenlevel für die Flasche
        } else {
            this.groundLevel = 348; // Standard-Bodenlevel, falls nicht spezifisch
        }
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

            if (this.y >= this.groundLevel && this.speedY <= 0) {
                this.y = this.groundLevel; // Setze exakt auf den Boden
                this.speedY = 0; // Stoppe vertikale Bewegung
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

    enemyWalkAnimation() {
        setInterval(() => {
            if (!this.isDead()) {
                // Prüfe, ob eine Charakter-Referenz vorhanden ist
                if (this.character) {
                    // Wenn der Charakter rechts vom Huhn ist
                    if (this.character.x > this.x + 10) { // Kleiner Puffer, um ständiges Flackern zu vermeiden
                        this.moveRight();
                        this.otherDirection = true; // Huhn schaut nach rechts (nicht gespiegelt)
                    }
                    // Wenn der Charakter links vom Huhn ist
                    else if (this.character.x < this.x - 10) { // Kleiner Puffer
                        this.moveLeft();
                        this.otherDirection = false; // Huhn schaut nach links (gespiegelt)
                    }
                    // Wenn der Charakter sehr nah ist, kann das Huhn stehen bleiben oder eine Standardbewegung ausführen
                    // Hier bleibt es stehen, wenn es nicht nach links oder rechts zum Charakter muss
                } else {
                    // Standardbewegung, wenn keine Charakter-Referenz vorhanden ist oder außerhalb des Bereichs
                    this.moveLeft();
                    this.otherDirection = false; // Standardmäßig nach links schauen
                }
            }
        }, 1000 / 60); // 60 FPS für Bewegung
    }




}