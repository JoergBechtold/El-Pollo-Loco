class Chick extends MovableObject {
    // y = 370;
    groundLevel = 370
    speed = 0.85
    height = 50;
    width = 70;
    runToJump = 70 + Math.random() * 300;
    offset = {
        top: -10,
        left: 10,
        right: 10,
        bottom: 5
    };
    distanceSinceLastJump = 0;

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

        let randomX = 400 + Math.random() * 2000;
        this.x = Math.round(randomX / 150) * 150;
        this.speed = 0.85 + Math.random() * 1.1;
        this.animate();
    }

    animate() {

        setInterval(() => {
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


        setInterval(() => {
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
}