class Character extends MovableObject {
    height = 280;
    width = 150;
    y = 155;
    speed = 10;
    world;
    death_sound = new Audio('assets/audio/death.mp3');
    jump_sound = new Audio('assets/audio/jump.ogg');
    landing_sound = new Audio('assets/audio/landing.mp3');
    hurt_sound = new Audio('assets/audio/short-oww-46070.mp3');
    // isJumping = false;
    // isPlaying = false;

    offset = {
        top: 120,
        left: 30,
        right: 40,
        bottom: 15
    };

    IMAGES_WALKING = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_DEAD = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png',
        'assets/img/2_character_pepe/5_dead/D-57.png'
    ]

    IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
    ]



    constructor() {
        // super().loadImage('assets/img/2_character_pepe/2_walk/W-21.png')
        super().loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        // this.loadImages(this.IMAGES_BOTTLES);
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                if (!this.isAboveGround()) {
                    walkin_sound.play();
                } if (this.isAboveGround()) {
                    walkin_sound.pause();
                    walkin_sound.currentTime = 0;
                }
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                if (!this.isAboveGround()) {
                    walkin_sound.play();
                } if (this.isAboveGround()) {
                    walkin_sound.pause();
                    walkin_sound.currentTime = 0;
                }
                this.otherDirection = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump_sound.play();
                this.jump();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);


        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                this.death_sound.play();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.hurt_sound.play();
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.world.keyboard.LEFT && this.world.keyboard.RIGHT) {
                walkin_sound.pause();
                walkin_sound.currentTime = 0;
            } else if (this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else if (this.world.keyboard.LEFT && !this.world.keyboard.RIGHT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_IDLE);

            }
        }, 50);


        // setInterval(() => {
        //     if (this.isDead()) {
        //         this.playAnimation(this.IMAGES_DEAD);
        //         this.death_sound.play();
        //     } else if (this.isHurt()) {
        //         this.playAnimation(this.IMAGES_HURT);
        //         this.hurt_sound.play();
        //     } else if (this.isAboveGround()) {
        //         this.playAnimation(this.IMAGES_JUMPING);
        //     } else if (this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
        //         this.playAnimation(this.IMAGES_WALKING);
        //     } else if (this.world.keyboard.LEFT && !this.world.keyboard.RIGHT) {
        //         this.playAnimation(this.IMAGES_WALKING);
        //     } else {
        //         this.loadImage(this.IMAGES_IDLE[0]);
        //     }
        // }, 50);
    }



} 