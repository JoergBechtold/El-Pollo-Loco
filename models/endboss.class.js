class Endboss extends MovableObject {
    height = 400;
    width = 250;
    speed = 5;
    y = 46;
    endbossEnergy = 100;
    endbossActivated = false;
    offset = {
        top: 70,
        left: 0,
        right: 0,
        bottom: 0
    };
    character;
    endbossMusic = null;
    isDeadAnimationFinished = false;
    endbossAnimationInterval;
    endbossMoveAniationInterval;


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
        this.endbossAnimationInterval = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                clearInterval(this.endbossMoveAniationInterval);
                this.loadImage(this.IMAGES_DEAD[2]);
                endboss_death.currentTime = 0;

                endboss_death.play();
                endboss_death.volume = endboss_death_volume;
                setTimeout(() => {
                    endboss_death.pause();
                    endboss_death.currentTime = 0;
                }, 1400);
                setTimeout(() => {
                    endboss_music.pause();
                }, 1800);
                clearInterval(this.endbossAnimationInterval);
                setTimeout(() => {
                    handleYouWinScreen()
                }, 2300);
                return;
            }

            if (this.world && this.world.character && this.world.character.x > 1800) {
                this.startEndbossMusic();
            }

            if (!this.endbossActivated && this.world) {
                if (this.endbossEnergy <= 75 || (this.world.character && this.world.character.x > 2200)) {
                    this.world.showEndbossStatusBar = true;
                    this.hadFirstContact = true;
                    this.endbossActivated = true;
                    this.startEndbossMusic();
                }
            }

            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);

                let endboss_hurt_new = new Audio(PATH_ENDBOSS_HURT_AUDIO);
                endboss_hurt_new.volume = bouncing_audio_volume;
                endboss_hurt_new.play();

                setTimeout(() => {
                    endboss_hurt_new.pause();
                    endboss_hurt_new.currentTime = 0;
                }, 1000);
            } else if (this.hadFirstContact) {

                if (this.world.character.x < this.x - 50) {
                    this.moveLeft();
                    this.otherDirection = false;
                } else if (this.world.character.x > this.x + 50) {
                    this.moveRight();
                    this.otherDirection = true;
                }


                if (this.character && Math.abs(this.character.x - this.x) < 200) {
                    this.playAnimation(this.IMAGES_ATTACK);


                    if (!this.isCurrentlyAttackingSoundPlaying) {
                        endboss_sound.currentTime = 0;
                        endboss_sound.play();
                        endboss_sound.volume = endboss_sound_volume;
                        this.isCurrentlyAttackingSoundPlaying = true;

                    }
                } else {
                    this.playAnimation(this.IMAGES_WALKING);

                    if (this.isCurrentlyAttackingSoundPlaying) {
                        endboss_sound.pause();
                        endboss_sound.currentTime = 0;
                        this.isCurrentlyAttackingSoundPlaying = false;

                    }
                }
            } else {

                this.playAnimation(this.IMAGES_ALERT);

                if (this.isCurrentlyAttackingSoundPlaying) {
                    endboss_alert.currentTime = 0;
                    endboss_alert.play()
                    setTimeout(() => {
                        endboss_sound.pause();
                        endboss_sound.currentTime = 0;
                    }, 500);

                    this.isCurrentlyAttackingSoundPlaying = false;
                }
            }
        }, 450);
    }



    endbosseMoveAnimation() {
        this.endbossMoveAniationInterval = setInterval(() => {
            if (this.isDead()) {
                return;
            }

            if (!this.endbossActivated && this.world) {
                if (this.endbossEnergy <= 75 || (this.world.character && this.world.character.x > 2200)) {
                    this.world.showEndbossStatusBar = true;
                    this.hadFirstContact = true;
                    this.endbossActivated = true;
                    this.startEndbossMusic();
                }
            }

            if (this.hadFirstContact) {
                if (this.world.character.x < this.x - 50) {
                    this.moveLeft();
                    this.otherDirection = false;
                } else if (this.world.character.x > this.x + 50) {
                    this.moveRight();
                    this.otherDirection = true;
                }
            }
        }, 1000 / 25);
    }

    hitEndbossBevorWalk() {
        if (world.endbossEnergy == 75);
    }

    startEndbossMusic() {
        if (!isMuted) {
            game_music.pause();
            game_music.currentTime = 0;
            endboss_music.volume = endboss_sound_volume;
            endboss_music.play();
        }
    }

    // stopAllIntervals() {
    //     if (this.endbossAnimationIntervalendbossMoveAniationInterval) {
    //         clearInterval(this.endbossAnimationIntervalendbossMoveAniationInterval);
    //         this.endbossAnimationIntervalendbossMoveAniationInterval = null;
    //     }
    //     if (this.endbossMoveAniationInterval) {
    //         clearInterval(this.endbossMoveAniationInterval);
    //         this.endbossMoveAniationInterval = null;
    //     }
    // }
}