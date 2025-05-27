class Chicken extends MovableObject {
    y = 360;
    character;

    height = 60;
    width = 80;
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
        let randomX = 400 + Math.random() * 2000;
        this.x = Math.round(randomX / 150) * 150;


        this.animate();
    }

    animate() {

        this.enemyWalkAnimation()

        // setInterval(() => {
        //     if (!this.isDead()) {

        //         if (this.character) {

        //             if (this.character.x > this.x + 10) { 
        //                 this.moveRight();
        //                 this.otherDirection = true; 
        //             }

        //             else if (this.character.x < this.x - 10) { 
        //                 this.moveLeft();
        //                 this.otherDirection = false;
        //             }

        //         } else {

        //             this.moveLeft();
        //             this.otherDirection = false; 
        //         }
        //     }
        // }, 1000 / 60);


        setInterval(() => {
            if (this.isDead()) {
                if (!this.isDeadAnimationPlayed) {
                    this.playAnimation(this.IMAGE_DEAD);
                    this.isDeadAnimationPlayed = true;
                }
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150); // 150ms pro Bild für die Animation
    }

    // animate() {
    //     setInterval(() => {
    //         if (!this.isDead()) {
    //             this.moveLeft();
    //         }
    //     }, 1000 / 60);

    //     setInterval(() => {
    //         if (this.isDead()) {
    //             if (!this.isDeadAnimationPlayed) {
    //                 this.playAnimation(this.IMAGE_DEAD);
    //                 this.isDeadAnimationPlayed = true;
    //             }
    //         } else {
    //             this.playAnimation(this.IMAGES_WALKING);
    //         }
    //     }, 150);
    // }

}