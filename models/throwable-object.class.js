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

    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.wasThrown = true;


        if (!this.movementInterval && !this.isSplashing) {
            let throwSpeedX = this.otherDirection ? -10 : 10;
            this.movementInterval = setInterval(() => {
                this.x += throwSpeedX;

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
            }, 25);
        }

        if (!this.rotationAnimationInterval && !this.isSplashing) {
            this.rotationAnimationInterval = setInterval(() => {
                this.playAnimation(this.IMAGES_BOTTLES);
            }, 1000 / 25);
        }
    }

    playBottleSplash() {
        if (!this.isSplashing) return;

        bottle_splash.play();
        this.width = this.splashWidth;
        this.height = this.splashHeight;


        this.stopMovementAndRotationIntervals();


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

    startAllIntervals() {
        super.startAllIntervals();

        if (!this.isSplashing) {

            if (this.wasThrown && !this.movementInterval) {

                let throwSpeedX = this.otherDirection ? -10 : 10;
                this.movementInterval = setInterval(() => {
                    this.x += throwSpeedX;

                    if (this.isSplashing || this.y >= this.groundLevel) {
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
                }, 25);
            }

            if (this.wasThrown && !this.rotationAnimationInterval) {
                this.rotationAnimationInterval = setInterval(() => {
                    if (!this.isSplashing) {
                        this.playAnimation(this.IMAGES_BOTTLES);
                    }
                }, 1000 / 25);
            }
        }
    }

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

