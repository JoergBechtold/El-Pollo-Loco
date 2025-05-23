class Character extends MovableObject {
    height = 280;
    width = 150;
    y = 155;
    speed = 7.5;
    world;
    isInactive = false;
    throwableBottleArray = [];
    collectCoinsArray = [];
    bottles = [];
    lastThrow = 0;
    throwInterval = 500;
    lastActivityTime = Date.now();
    lengthOfInactivity = 8000;


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
        super().loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.applyGravity();
        this.animate();
    }

    resetsCharacterToY() {
        return this.y = 155;
    }

    isIdle() {
        let timePassed = Date.now() - this.lastActivityTime;
        return timePassed > this.lengthOfInactivity;
    }

    isFalling() {
        return this.isAboveGround() && this.speedY > 0;
    }

    animate() {
        setInterval(() => {

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE || this.world.keyboard.D) {
                this.lastActivityTime = Date.now();
            }

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

                jump_sound.play();
                this.jump();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                death_sound.play();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                hurt_sound.play();
                this.lastActivityTime = Date.now();
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
                this.lastActivityTime = Date.now();
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            }

            if (this.world.keyboard.D) {
                let currentTime = new Date().getTime();
                let timeSinceLastThrow = currentTime - this.lastThrow;

                if (timeSinceLastThrow >= this.throwInterval) {
                    let bottleX = this.x + (this.otherDirection ? -5 : 80);
                    let bottle = new ThrowableObject(bottleX, this.y + 130, this.otherDirection);
                    this.bottles.push(bottle);
                    this.lastThrow = currentTime;
                    this.lastActivityTime = Date.now();
                }
            }
        }, 50);

        setInterval(() => {
            const isCharacterMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE || this.world.keyboard.D;
            if (!this.isDead() && !this.isHurt() && !this.isAboveGround() && !isCharacterMoving) {
                if (this.isIdle()) {
                    this.playAnimation(this.IMAGES_LONG_IDLE);
                    snoring_audio.play()
                    snoring_audio.volume = snoring_audio_volume;
                    game_music.volume = game_music_volume_silence;

                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                    snoring_audio.pause();
                    snoring_audio.currentTime = 0;
                    game_music.volume = game_music_volume_loude;
                }
            }
        }, 200);
    }
}




