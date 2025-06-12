class Endboss extends MovableObject {
    height = 400;
    width = 250;
    speed = 3;
    y = 46;
    endbossEnergy = 100;
    endbossActivated = false;
    character;
    endbossMusic = null;
    endbossAnimationInterval;
    endbossMovementInterval;
    offset = {
        top: 70,
        left: 0,
        right: 0,
        bottom: 0
    };

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
    }

    /**
     * 
     * Initializes or restarts all animation and movement intervals for the Endboss.
     * Clears any existing intervals to prevent duplication.
     * @memberof Endboss
     */
    animate() {
        if (this.endbossAnimationInterval) {
            clearInterval(this.endbossAnimationInterval);
        }
        this.handleEndbossAnimationInterval()
        if (this.endbossMovementInterval) {
            clearInterval(this.endbossMovementInterval);
        }
        this.handleEndbossMovementInterval()
    }

    /**
     * 
     * Manages the Endboss's animation interval, executing every 250ms.
     * Prioritizes death animation, then hurt, attack/walking, or alert animations.
     * @memberof Endboss
     */
    handleEndbossAnimationInterval() {
        this.endbossAnimationInterval = setInterval(() => {
            if (this.isDead()) {
                this.handleDeadState();
                return;
            }

            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.ifMutedHurt()
            } else if (this.hadFirstContact) {
                this.IfAttackOrWalking()
            } else {
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 250);
    }

    /**
     * 
     * 
     * Handles the Endboss's death state. Plays the death animation and triggers
     * subsequent actions (e.g., win screen) if the animation hasn't been played yet.
     * @memberof Endboss
     */
    handleDeadState() {
        if (!this.isDeadAnimationPlayed) {
            this.playAnimation(this.IMAGES_DEAD);
            setTimeout(() => {
                this.isDeadAnimationPlayed = true;
                this.handleEndbossDeath();
            }, 100);
        }
    }

    /**
     * 
     * Plays the Endboss's hurt sound if audio is not muted.
     * The sound is paused and reset after a short duration.
     * @memberof Endboss
     */
    ifMutedHurt() {
        if (!isMuted) {
            let endboss_hurt_new = new Audio(PATH_ENDBOSS_HURT_AUDIO);
            endboss_hurt_new.volume = bouncing_audio_volume;
            endboss_hurt_new.play();
            setTimeout(() => {
                endboss_hurt_new.pause();
                endboss_hurt_new.currentTime = 0;
            }, 1000);
        }
    }

    /**
     * 
     * Controls whether the Endboss attacks or walks based on proximity to the character.
     * Plays corresponding animations and manages the attack sound.
     * @memberof Endboss
     */
    IfAttackOrWalking() {
        if (this.character && Math.abs(this.character.x - this.x) < 200) {
            this.playAnimation(this.IMAGES_ATTACK);
            if (!this.isCurrentlyAttackingSoundPlaying) {
                this.IfMutedEndbossSound()
            }
        } else {
            this.playAnimation(this.IMAGES_WALKING);
            if (this.isCurrentlyAttackingSoundPlaying) {
                endboss_sound.pause();
                endboss_sound.currentTime = 0;
                this.isCurrentlyAttackingSoundPlaying = false;
            }
        }
    }

    /**
     * 
     * Manages the Endboss's movement interval, running 60 times per second.
     * The boss moves only if not dead, and checks for activation and contact.
     * @memberof Endboss
     */
    handleEndbossMovementInterval() {
        this.endbossMovementInterval = setInterval(() => {
            if (this.isDead()) return;
            this.IfEndbossActivation()
            this.IfHadFirstContact()
        }, 1000 / 60);
    }

    /**
     * 
     * Executes all actions necessary when the Endboss dies (stopping intervals, playing sound, showing win screen).
     * @memberof Endboss
     */
    handleEndbossDeath() {
        this.stopAllIntervals();

        if (!isMuted) {
            endboss_death.currentTime = 0;
            endboss_death.play();
            endboss_death.volume = endboss_death_volume;
        }
        setTimeout(() => {
            handleYouWinScreen();
        }, 2300);
    }

    /**
     * 
     * Checks conditions for Endboss activation (energy or character position).
     * Activates the Endboss and starts related elements like status bar and music.
     * @memberof Endboss
     */
    IfEndbossActivation() {
        if (!this.endbossActivated && this.world && this.world.character) {
            if (this.endbossEnergy <= 75 || this.world.character.x > 2200) {
                this.world.showEndbossStatusBar = true;
                this.hadFirstContact = true;
                this.endbossActivated = true;
                this.startEndbossMusic();
                this.ifNotMutedAlert()
            }
        }
    }

    /**
     * 
     * Plays the Endboss alert sound if audio is not muted.
     * The sound is paused and reset after a short duration.
     * @memberof Endboss
     */
    ifNotMutedAlert() {
        if (!isMuted) {
            endboss_alert.currentTime = 0;
            endboss_alert.play();
            setTimeout(() => {
                endboss_alert.pause();
                endboss_alert.currentTime = 0;
            }, 1200);
        }
    }

    /**
     * 
     * Manages the Endboss's movement behavior after first contact with the character.
     * Moves the Endboss left or right to track the character.
     * @memberof Endboss
     */
    IfHadFirstContact() {
        if (this.hadFirstContact) {
            if (this.world.character.x < this.x - 50) {
                this.moveLeft();
                this.otherDirection = false;
            } else if (this.world.character.x > this.x + 50) {
                this.moveRight();
                this.otherDirection = true;
            }
        }
    }

    /**
     * 
     * Starts the Endboss background music, pausing the main game music first, if not muted.
     * @memberof Endboss
     */
    startEndbossMusic() {
        if (!isMuted) {
            game_music.pause();
            game_music.currentTime = 0;
            endboss_music.volume = endboss_sound_volume;
            endboss_music.play();
        }
    }

    /**
     * 
     * Plays the Endboss's attack sound if audio is not muted.
     * Sets a flag to indicate the sound is currently playing.
     * @memberof Endboss
     */
    IfMutedEndbossSound() {
        if (!isMuted) {
            endboss_sound.currentTime = 0;
            endboss_sound.play();
            endboss_sound.volume = endboss_sound_volume;
        }
        this.isCurrentlyAttackingSoundPlaying = true;
    }

    /**
     * 
     * Stops all active intervals related to the Endboss (animation, movement) and resets its audio.
     * @memberof Endboss
     */
    stopAllIntervals() {
        if (this.endbossAnimationInterval) {
            clearInterval(this.endbossAnimationInterval);
            this.endbossAnimationInterval = null;
        }
        if (this.endbossMovementInterval) {
            clearInterval(this.endbossMovementInterval);
            this.endbossMovementInterval = null;
        }
        this.resetAudio()
    }

    /**
     * 
     * Pauses and resets the current playback time for all Endboss-specific audio elements.
     * @memberof Endboss
     */
    resetAudio() {
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
     * 
     * Starts all necessary intervals for the Endboss's operation, if it's not dead.
     * @memberof Endboss
     */
    startAllIntervals() {
        if (!this.isDead()) {
            this.animate();
        }
    }
}