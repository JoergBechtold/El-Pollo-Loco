class ThrowableObject extends MovableObject {
    offset = {
        top: 8,
        left: 15,
        right: 15,
        bottom: 8
    };
    groundLevel = 351
    isSplashing = false;
    world;
    movementInterval;
    rotationAnimationInterval;
    splashAnimationInterval;

    IMAGES_BOTTLES = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]

    IMAGES_BOTTLE_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]


    constructor(x, y, otherDirection) {
        super().loadImage('assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_BOTTLES);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 60;
        this.otherDirection = otherDirection;
        this.splashWidth = 80;
        this.splashHeight = 80;
        this.throw();
    }


    /**
    * 
    * Initiates the throwing action for the bottle.
    *
    * This function sets the initial vertical velocity (`speedY`) for the bottle,
    * applies gravity to it, and marks it as `wasThrown`. It then sets up an interval
    * for the bottle's horizontal movement if it's not already moving or splashing.
    * The horizontal movement is determined by the `otherDirection` property.
    * Within the movement interval, it continuously checks if the bottle should
    * start splashing and be removed from the game. Finally, it starts the bottle's
    * rotation animation.
    *
    * @memberof Bottle
    */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.wasThrown = true;

        if (!this.movementInterval && !this.isSplashing) {
            let throwSpeedX = this.otherDirection ? -10 : 10;
            this.movementInterval = setInterval(() => {
                this.x += throwSpeedX;
                this.bottleSplashAndSplice()

            }, 25);
        }
        this.startBottleRotationAnimation()
    }


    /**
    * 
    * Manages the transition of the bottle into a "splashing" state and its subsequent removal from the game.
    *
    * This function checks for conditions that indicate the bottle has hit something or landed on the ground
    * (`isSplashing`, `world.bottleHitSomething`, or `y >= groundLevel`). If these conditions are met and
    * the bottle hasn't already started splashing, it initiates the splash sequence:
    * - Sets `isSplashing` to `true` to prevent re-triggering.
    * - Calls `playBottleSplash()` to handle the splash animation and sound.
    * - Stops all current movement and rotation intervals for the bottle.
    * - Schedules a delayed task to remove the bottle from `world.character.bottles` and stop all its intervals,
    * ensuring proper cleanup.
    *
    * @memberof Bottle
    */
    bottleSplashAndSplice() {
        if (this.isSplashing || world.bottleHitSomething || this.y >= this.groundLevel) {
            if (!this.isSplashing) {
                this.isSplashing = true;
                this.playBottleSplash();
                this.stopMovementAndRotationIntervals();

                setTimeout(() => {
                    const index = world.character.bottles.indexOf(this);
                    if (index > -1) {
                        world.character.bottles.splice(index, 1);
                    }
                    this.stopAllIntervals();
                }, 500);
            }
        }
    }

    /**
     * 
     * Initiates the visual and auditory sequence for a bottle splash.
     *
     * This function is called when a thrown bottle is determined to be splashing (e.g., on impact).
     * It ensures the splash actions are executed only once by checking `isSplashing`.
     * Upon activation, it plays the bottle splash sound, adjusts the bottle's dimensions
     * to fit the splash animation, stops any ongoing movement or rotation,
     * and then starts the specific splash animation interval.
     *
     * @memberof Bottle
     */
    playBottleSplash() {
        if (!this.isSplashing) return;

        if (typeof bottle_splash !== 'undefined' && typeof bottle_splash.play === 'function') {
            bottle_splash.play();
        }

        this.width = this.splashWidth;
        this.height = this.splashHeight;
        this.stopMovementAndRotationIntervals();
        this.startSplashAnimationsInterval();
    }

    /**
    * 
    * Initiates and controls the animation loop for the bottle's splash effect.
    *
    * This method ensures that the splash animation plays only once. It sets up an interval
    * to cycle through the `IMAGES_BOTTLE_SPLASH` frames. Once a full animation cycle is detected
    * (when `currentImage` wraps around and is not the very first frame), the interval
    * is automatically cleared and reset to `null` to stop the animation. The animation
    * plays at a rate of 10 frames per second.
    *
    * @memberof Bottle
    */
    startSplashAnimationsInterval() {
        if (!this.splashAnimationInterval) {
            this.splashAnimationInterval = setInterval(() => {
                this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
                if (this.currentImage % this.IMAGES_BOTTLE_SPLASH.length === 0 && this.currentImage > 0) {
                    clearInterval(this.splashAnimationInterval);
                    this.splashAnimationInterval = null;
                }
            }, 1000 / 10);
        }
    }

    /**
    * 
    * Stops all active intervals associated with this object.
    *
    * This method is crucial for cleaning up resources when the object is no longer active
    * (e.g., removed from the game, or its animations/movements are complete).
    * It calls the `stopAllIntervals` method of its parent class first to ensure
    * inherited intervals are also cleared. Then, it specifically clears and nullifies
    * any intervals managed directly by this object, such as for movement, rotation,
    * or splash animations.
    *
    * @override
    * @memberof YourClassName // Replace 'YourClassName' with the actual class name (e.g., Bottle)
    */
    stopAllIntervals() {
        super.stopAllIntervals();

        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        if (this.rotationAnimationInterval) {
            clearInterval(this.rotationAnimationInterval);
            this.rotationAnimationInterval = null;
        }
        if (this.splashAnimationInterval) {
            clearInterval(this.splashAnimationInterval);
            this.splashAnimationInterval = null;
        }
    }

    /**
    * 
    * Initiates essential intervals for a thrown bottle, including movement and rotation.
    *
    * This function is called when the bottle is thrown. It calls the parent's interval starter.
    * If the bottle isn't already splashing:
    * 1. **Movement:** It sets up an interval for horizontal travel (based on `otherDirection`)
    * that also checks for splash conditions (`bottleSplashAndSplice`). This runs every 25ms.
    * 2. **Rotation:** It starts the bottle's spinning animation.
    *
    * @override
    * @memberof Bottle
    */
    startAllIntervals() {
        if (!this.isSplashing) {
            if (this.wasThrown && !this.movementInterval) {
                let throwSpeedX = this.otherDirection ? -10 : 10;
                this.movementInterval = setInterval(() => {
                    this.x += throwSpeedX;
                    this.bottleSplashAndSplice()
                }, 25);
            }
            this.startBottleRotationAnimation()
        }
    }

    /**
    * 
    * Starts the rotation animation for a thrown bottle.
    * The bottle continuously rotates unless it has started splashing.
    * @memberof Bottle
    */
    startBottleRotationAnimation() {
        if (!this.rotationAnimationInterval) {
            this.rotationAnimationInterval = setInterval(() => {
                if (!this.isSplashing) {
                    this.playAnimation(this.IMAGES_BOTTLES);
                }
            }, 1000 / 25);
        }
    }

    /**
     * 
 * Stops both the movement and rotation intervals of the bottle.
 * This is crucial when the bottle hits something or lands.
 * @memberof Bottle
 */
    stopMovementAndRotationIntervals() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        if (this.rotationAnimationInterval) {
            clearInterval(this.rotationAnimationInterval);
            this.rotationAnimationInterval = null;
        }
    }
}

