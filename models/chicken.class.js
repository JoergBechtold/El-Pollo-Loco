class Chicken extends MovableObject {
    y = 355;
    character;
    chickenEnergy = 10;
    height = 60;
    width = 80;
    chickenAnimationInterval;
    chickenMovementInterval;
    offset = {
        top: -5,
        left: 0,
        right: 0,
        bottom: 0
    };

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.speed = 0.5 + Math.random() * 1;
        let randomX = 800 + Math.random() * 2000;
        this.x = Math.round(randomX / 150) * 150;
        this.animate();
    }

    /**
     * 
     * Initiates and manages the chicken's animation and movement intervals.
     * It clears any existing intervals before setting up new ones.
     * @memberof Chicken
     */
    animate() {
        if (this.chickenAnimationInterval) {
            clearInterval(this.chickenAnimationInterval);
        }
        this.handleChickenAnimationInterval();
        if (this.chickenMovementInterval) {
            clearInterval(this.chickenMovementInterval);
        }
        this.handleChickenMovementInterval();
    }

    /**
     * 
     * Manages the chicken's visual animation, playing walking animation when alive and death animation once dead.
     * @memberof Chicken
     */
    handleChickenAnimationInterval() {
        this.chickenAnimationInterval = setInterval(() => {
            if (this.isDead()) {
                if (!this.isDeadAnimationPlayed) {
                    this.playAnimation(this.IMAGE_DEAD);
                    this.isDeadAnimationPlayed = true;
                }
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }

    /**
     * 
     * Manages the chicken's movement behavior by regularly checking the character's direction.
     * @memberof Chicken
     */
    handleChickenMovementInterval() {
        this.chickenMovementInterval = setInterval(() => {
            if (!this.isDead()) {
                this.checkCharacterDirection();
            }
        }, 1000 / 60);
    }

    /**
     * 
     * Determines the chicken's movement direction (left/right) based on its character target's position.
     * If no character is present, it defaults to moving left.
     * @memberof Chicken
     */
    checkCharacterDirection() {
        if (this.character) {
            if (this.character.x > this.x + 10) {
                this.moveRight();
                this.otherDirection = true;
            } else if (this.character.x < this.x - 10) {
                this.moveLeft();
                this.otherDirection = false;
            }
        } else {
            this.moveLeft();
            this.otherDirection = false;
        }
    }

    /**
     * 
     * Stops all intervals associated with the chicken, including inherited ones.
     * @override
     * @memberof Chicken
     */
    stopAllIntervals() {
        super.stopAllIntervals();

        if (this.chickenAnimationInterval) {
            clearInterval(this.chickenAnimationInterval);
            this.chickenAnimationInterval = null;
        }
        if (this.chickenMovementInterval) {
            clearInterval(this.chickenMovementInterval);
            this.chickenMovementInterval = null;
        }
    }

    /**
     * 
     * Starts all necessary animation and movement intervals for the chicken if it's not dead.
     * @override
     * @memberof Chicken
     */
    startAllIntervals() {
        if (!this.isDead()) {
            this.animate();
        }
    }
}


