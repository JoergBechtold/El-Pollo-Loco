class Endboss extends MovableObject {
    height = 400;
    width = 250;
    speed = 3;
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
    endbossMovementInterval;


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
        // this.endbosseMoveAnimation()
    }

    animate() {
        // --- Animationsintervall (Bildwechsel) ---
        if (this.endbossAnimationInterval) {
            clearInterval(this.endbossAnimationInterval);
        }
        this.endbossAnimationInterval = setInterval(() => {
            if (this.isDead()) {
                if (!this.isDeadAnimationPlayed) {
                    this.playAnimation(this.IMAGES_DEAD);
                    this.isDeadAnimationPlayed = true;
                    this.handleEndbossDeath();
                }
                return;
            }

            // Normales Animationsverhalten, nur wenn Endboss nicht tot ist
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                if (!isMuted) {
                    let endboss_hurt_new = new Audio(PATH_ENDBOSS_HURT_AUDIO);
                    endboss_hurt_new.volume = bouncing_audio_volume;
                    endboss_hurt_new.play();
                    setTimeout(() => {
                        endboss_hurt_new.pause();
                        endboss_hurt_new.currentTime = 0;
                    }, 1000);
                }
            } else if (this.hadFirstContact) { // Hier wird unterschieden!
                // Wenn im Angriffsradius
                if (this.character && Math.abs(this.character.x - this.x) < 200) {
                    this.playAnimation(this.IMAGES_ATTACK);
                    if (!this.isCurrentlyAttackingSoundPlaying) {
                        if (!isMuted) {
                            endboss_sound.currentTime = 0;
                            endboss_sound.play();
                            endboss_sound.volume = endboss_sound_volume;
                        }
                        this.isCurrentlyAttackingSoundPlaying = true;
                    }
                } else { // Wenn außerhalb des Angriffsradius, aber Kontakt gehabt (WALK oder ALERT)
                    this.playAnimation(this.IMAGES_WALKING); // Standard Walking Animation
                    // Setze den Attack-Sound zurück, wenn außerhalb des Angriffsradius
                    if (this.isCurrentlyAttackingSoundPlaying) {
                        endboss_sound.pause();
                        endboss_sound.currentTime = 0;
                        this.isCurrentlyAttackingSoundPlaying = false;
                    }
                }
            } else {

                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 250);

        // --- Bewegungsintervall (Verfolgung des Charakters und Aktivierung) ---
        if (this.endbossMovementInterval) {
            clearInterval(this.endbossMovementInterval);
        }
        this.endbossMovementInterval = setInterval(() => {
            if (this.isDead()) {
                return;
            }

            // Endboss-Aktivierungslogik
            // Diese Logik steuert, wann der Endboss "aktiv" wird und reagiert
            if (!this.endbossActivated && this.world && this.world.character) {
                if (this.endbossEnergy <= 75 || this.world.character.x > 2200) {
                    this.world.showEndbossStatusBar = true;
                    this.hadFirstContact = true;
                    this.endbossActivated = true;
                    this.startEndbossMusic(); // Startet die Musik, sobald aktiviert

                    // Spielen des Alert-Sounds einmalig bei Aktivierung
                    if (!isMuted) {
                        endboss_alert.currentTime = 0;
                        endboss_alert.play();

                        setTimeout(() => {
                            endboss_alert.pause();
                            endboss_alert.currentTime = 0;
                        }, 1200);
                        // Keine isCurrentlyAttackingSoundPlaying, da dies für Attack-Sound ist
                    }
                }
            }

            // Bewegungslogik, nachdem Kontakt hergestellt wurde
            if (this.hadFirstContact) {
                if (this.world.character.x < this.x - 50) {
                    this.moveLeft();
                    this.otherDirection = false;
                } else if (this.world.character.x > this.x + 50) {
                    this.moveRight();
                    this.otherDirection = true;
                }
            }
        }, 1000 / 60); // Bewegungsgeschwindigkeit: ca. 60 FPS
    }

    /**
     * Handhabt die Logik, wenn der Endboss stirbt.
     */
    handleEndbossDeath() {
        this.stopAllIntervals(); // Stoppt alle Intervalle sofort

        if (!isMuted) {
            endboss_death.currentTime = 0;
            endboss_death.play();
            endboss_death.volume = endboss_death_volume;
        }

        setTimeout(() => {
            if (!isMuted) {
                endboss_death.pause();
                endboss_death.currentTime = 0;
            }
        }, 1400);

        setTimeout(() => {
            if (!isMuted) {
                endboss_music.pause();
                endboss_music.currentTime = 0;
            }
        }, 1800);

        setTimeout(() => {
            handleYouWinScreen();
        }, 2300);
    }



    startEndbossMusic() {
        if (!isMuted) {
            game_music.pause();
            game_music.currentTime = 0;
            endboss_music.volume = endboss_sound_volume;
            endboss_music.play();
        }
    }

    stopAllIntervals() {


        // Stoppt die Endboss-spezifischen Intervalle
        if (this.endbossAnimationInterval) {
            clearInterval(this.endbossAnimationInterval);
            this.endbossAnimationInterval = null;
        }
        if (this.endbossMovementInterval) {
            clearInterval(this.endbossMovementInterval);
            this.endbossMovementInterval = null;
        }

        // Zusätzliche Logik zum Stoppen von Sounds
        // Diese Annahme erfordert, dass die globalen Audio-Variablen immer vorhanden sind.
        endboss_death.pause();
        endboss_death.currentTime = 0;
        endboss_music.pause();
        endboss_music.currentTime = 0;
        endboss_sound.pause();
        endboss_sound.currentTime = 0;
        endboss_alert.pause();
        endboss_alert.currentTime = 0;
    }


    /**
     * Startet alle Intervalle neu, die direkt in dieser Klasse oder der Basisklasse gestartet werden.
     */
    startAllIntervals() {
        if (!this.isDead()) {
            // Startet Intervalle der Elternklasse (z.B. Gravity)
            this.animate(); // Startet die Endboss-spezifischen Animations- und Bewegungsintervalle neu
        }
    }
}