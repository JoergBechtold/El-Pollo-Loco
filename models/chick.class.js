class Chick extends MovableObject {
    groundLevel = 365
    speed = 0.85
    height = 50;
    width = 70;
    runToJump = 70 + Math.random() * 300;
    distanceSinceLastJump = 0;
    chickAnimationInterval;
    chickDeadAnimationInterval;
    offset = {
        top: -10,
        left: 10,
        right: 10,
        bottom: 5
    };

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.applyGravity();
        let randomX = 900 + Math.random() * 2000;
        this.x = Math.round(randomX / 150) * 150;
        this.speed = 0.85 + Math.random() * 1.1;
        this.animate();
    }

    /**
     * 
     * Initiates all animation and movement intervals for the chick.
     * @memberof Chick
     */
    animate() {
        this.handleChickAnimationInterval();
        this.handleChickDeadAnimationInterval();
    }

    /**
     * 
     * Manages the chick's ongoing movement and jump behavior.
     * This interval causes the chick to move left and triggers jumps based on movement distance.
     * @memberof Chick
     */
    handleChickAnimationInterval() {
        this.chickAnimationInterval = setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
                if (!this.isAboveGround()) {
                    this.distanceSinceLastJump += this.speed;
                } else {
                    this.distanceSinceLastJump = 0;
                }
                if (!this.isAboveGround() && this.speedY === 0 && this.distanceSinceLastJump > this.runToJump) {
                    this.chickJump();
                    this.distanceSinceLastJump = 0;
                }
            }
        }, 1000 / 60);
    }

    /**
     * 
     * Handles the chick's animation, playing walking animation when alive and death animation once.
     * @memberof Chick
     */
    handleChickDeadAnimationInterval() {
        this.chickDeadAnimationInterval = setInterval(() => {
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
     * Stops all active intervals for the chick, including inherited and specific ones.
     * @override
     * @memberof Chick
     */
    stopAllIntervals() {
        super.stopAllIntervals(); // Call parent's stopAllIntervals
        if (this.chickAnimationInterval) {
            clearInterval(this.chickAnimationInterval);
            this.chickAnimationInterval = null;
        }
        if (this.chickDeadAnimationInterval) {
            clearInterval(this.chickDeadAnimationInterval);
            this.chickDeadAnimationInterval = null;
        }
    }

    /**
     * 
     * Starts all necessary intervals for the chick's operation if it is not dead.
     * @override
     * @memberof Chick
     */
    startAllIntervals() {
        if (!this.isDead()) {
            super.startAllIntervals(); // Call parent's startAllIntervals
            this.animate(); // Start chick-specific animations and movements
        }
    }
}