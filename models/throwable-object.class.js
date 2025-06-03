class ThrowableObject extends MovableObject {
    offset = {
        top: 8,
        left: 15,
        right: 15,
        bottom: 8
    };
    groundLevel = 350
    isSplashing = false;
    world;


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
        this.throw();
        this.splashWidth = 80;
        this.splashHeight = 80;


    }




    throw() {
        this.speedY = 30;
        this.applyGravity();
        let throwSpeedX = this.otherDirection ? -10 : 10;
        let movementInterval = setInterval(() => {
            this.x += throwSpeedX;
            if (this.y >= this.groundLevel) {
                clearInterval(movementInterval);
                setTimeout(() => {
                    world.character.bottles.splice(0, 1);

                }, 400);

                if (this.y >= this.groundLevel || this.isColliding()) {
                    this.playBottleSplash();
                    clearInterval(this.animationInterval);
                }


            }
        }, 25);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
        }, 1000 / 10);
    }



    playBottleSplash() {
        bottle_splash.play();
        this.width = this.splashWidth;
        this.height = this.splashHeight;
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
        }, 1000 / 10);

    }




}