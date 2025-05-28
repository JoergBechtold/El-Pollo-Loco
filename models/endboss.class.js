class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    speed = 2;
    offset = {
        top: 70,
        left: 0,
        right: 0,
        bottom: 0
    };
    character;
    // hadFirstContact = false;
    endbossMusic = null;
    // isEndbossMusicPlaying;


    IMAGES_WALKING = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png',

    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;
        this.animate();
        this.endbosseMoveAnimation()
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                endboss_music.pause()

                return;
            }


            if (this.hadFirstContact) {

                if (this.character && Math.abs(this.character.x - this.x) < 200) {
                    this.playAnimation(this.IMAGES_ATTACK);
                    endboss_sound.play()
                } else {
                    this.playAnimation(this.IMAGES_WALKING);
                    endboss_sound.pause();
                    endboss_sound.currentTime = 0;
                }
            } else {

                this.playAnimation(this.IMAGES_ALERT);
                endboss_sound.pause();
                endboss_sound.currentTime = 0;
            }
        }, 250);
    }

    endbosseMoveAnimation() {
        setInterval(() => {
            if (this.isDead()) {
                return;
            }


            if (this.world && this.world.character && this.world.character.x > 2200 && !this.hadFirstContact) {
                this.hadFirstContact = true;
                this.startEndbossMusic();
                console.log('Endboss erreicht und aktiviert!');

            }


            if (this.hadFirstContact) {
                if (this.world.character.x < this.x - 50) {
                    this.moveLeft();
                    this.otherDirection = false;
                } else if (this.world.character.x > this.x + 50) {
                    this.moveRight();
                    this.otherDirection = true;
                }
                // Wenn der Charakter sich in einem "toten Bereich" (hier +/- 50px) befindet,
                // bleibt der Boss stehen oder führt eine Attacke aus (Animation in animate()).
            }
        }, 1000 / 60);
    }

    startEndbossMusic() {
        if (!isMuted) {
            game_music.pause();
            game_music.currentTime = 0;

            endboss_music.play();
            // this.endbossMusic = new Audio(PATH_ENDBOSS_MUSIC);

            // this.endbossMusic.volume = 0.5;
            // this.endbossMusic.play();
            console.log('endboss musik');







        }
    }



}