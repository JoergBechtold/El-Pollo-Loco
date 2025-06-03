class Endboss extends MovableObject {
    height = 400;
    width = 250;
    speed = 5;
    y = 55;
    endbossEnergy = 100;
    offset = {
        top: 70,
        left: 0,
        right: 0,
        bottom: 0
    };
    character;
    endbossMusic = null;

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
        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                endboss_death.currentTime = 0;
                endboss_death.play();
                endboss_death.volume = endboss_death_volume;
                endboss_music.pause();
                clearInterval(this.animationInterval);
                setTimeout(() => {
                    goToUrl('you-won.html');
                }, 1500);
                return;
            }

            if (this.world && this.world.character && this.world.character.x > 2200 && !this.hadFirstContact) {
                this.world.showEndbossStatusBar = true;
                this.hadFirstContact = true;
                this.startEndbossMusic();
            }

            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                endboss_hurt.currentTime = 0;
                endboss_hurt.play();
                // Wenn Endboss verletzt ist, stoppe möglicherweise den Angriffssound
                if (this.isCurrentlyAttackingSoundPlaying) {
                    endboss_sound.pause();
                    endboss_sound.currentTime = 0;
                    this.isCurrentlyAttackingSoundPlaying = false;
                }
            } else if (this.hadFirstContact) {
                // Endboss-Bewegung
                if (this.world.character.x < this.x - 50) {
                    this.moveLeft();
                    this.otherDirection = false;
                } else if (this.world.character.x > this.x + 50) {
                    this.moveRight();
                    this.otherDirection = true;
                }

                // Endboss-Animation und Sound basierend auf Nähe zum Charakter
                if (this.character && Math.abs(this.character.x - this.x) < 200) {
                    this.playAnimation(this.IMAGES_ATTACK);

                    // Nur spielen, wenn der Sound nicht schon läuft
                    if (!this.isCurrentlyAttackingSoundPlaying) {
                        endboss_sound.currentTime = 0; // Wichtig: Sound zuerst zurücksetzen
                        endboss_sound.play();
                        endboss_sound.volume = endboss_sound_volume; // Sicherstellen, dass die Lautstärke passt
                        this.isCurrentlyAttackingSoundPlaying = true;
                        console.log('Endboss Sound startet!'); // Zum Debuggen
                    }
                } else {
                    this.playAnimation(this.IMAGES_WALKING);
                    // Nur pausieren/zurücksetzen, wenn der Sound tatsächlich lief
                    if (this.isCurrentlyAttackingSoundPlaying) {
                        endboss_sound.pause();
                        endboss_sound.currentTime = 0;
                        this.isCurrentlyAttackingSoundPlaying = false;
                        console.log('Endboss Sound gestoppt!'); // Zum Debuggen
                    }
                }
            } else {
                // Wenn noch kein erster Kontakt, zeige die Alert-Animation
                this.playAnimation(this.IMAGES_ALERT);
                // Sicherstellen, dass der Angriffssound pausiert ist, falls er doch lief
                if (this.isCurrentlyAttackingSoundPlaying) {
                    endboss_alert.currentTime = 0;
                    endboss_alert.play()
                    endboss_sound.pause();
                    endboss_sound.currentTime = 0;
                    this.isCurrentlyAttackingSoundPlaying = false;
                }
            }
        }, 150);
    }

    // animate() {

    //     setInterval(() => {
    //         if (this.isDead()) {
    //             this.playAnimation(this.IMAGES_DEAD);
    //             endboss_death.play()
    //             endboss_music.pause();
    //             setTimeout(() => {
    //                 goToUrl('you-won.html');
    //             }, 1500);
    //             return;
    //         }

    //         if (this.isHurt()) {
    //             this.playAnimation(this.IMAGES_HURT);
    //             endboss_hurt.play();

    //         }


    //         if (this.hadFirstContact) {

    //             if (this.character && Math.abs(this.character.x - this.x) < 200) {
    //                 this.playAnimation(this.IMAGES_ATTACK);
    //                 endboss_sound.play();
    //             } else {

    //                 this.playAnimation(this.IMAGES_WALKING);
    //                 endboss_sound.pause();
    //                 endboss_sound.currentTime = 0;
    //             }
    //         } else {

    //             this.playAnimation(this.IMAGES_ALERT);
    //             endboss_sound.pause();
    //             endboss_sound.currentTime = 0;
    //         }
    //     }, 1000 / 25);




    // }


    endbosseMoveAnimation() {
        setInterval(() => {
            if (this.isDead()) {
                return;
            }


            if (this.world && this.world.character && this.world.character.x > 2200 && !this.hadFirstContact) {
                this.world.showEndbossStatusBar = true;
                this.hadFirstContact = true;
                this.startEndbossMusic();
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

    startEndbossMusic() {
        if (!isMuted) {
            game_music.pause();
            game_music.currentTime = 0;
            endboss_music.volume = endboss_sound_volume;
            endboss_music.play();
            // this.endbossMusic = new Audio(PATH_ENDBOSS_MUSIC);

            // this.endbossMusic.volume = 0.5;
            // this.endbossMusic.play();
            console.log('endboss musik');







        }
    }



}