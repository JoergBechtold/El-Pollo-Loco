class ThrowableObject extends MovableObject {
    // bottle_splash = new Audio('assets/audio/bottle-break.mp3')
    offset = {
        top: 8,
        left: 15,
        right: 15,
        bottom: 8
    };

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



    constructor(x, y) {
        super().loadImage('assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_BOTTLES);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();
        this.splashWidth = 80;
        this.splashHeight = 80;


    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        let movementInterval = setInterval(() => {
            this.x += 10;
            if (this.y >= this.groundLevel) {
                clearInterval(movementInterval);
                this.playBottleSplash();
                clearInterval(this.animationInterval);

            }
        }, 25);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
        }, 250);
    }

    playBottleSplash() {
        bottle_splash.play();
        this.width = this.splashWidth;
        this.height = this.splashHeight;
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
        }, 200);

    }
}