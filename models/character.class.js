class Character extends MovableObject {
    height = 280;
    width = 150;
    groundLevel = 155;
    characterEnergy = 100;
    speed = 7.5;
    world;
    isInactive = false;
    collectBottlesArray = [];
    collectCoinsArray = [];
    bottles = [];
    lastThrow = 0;
    throwInterval = 500;
    lastActivityTime = Date.now();
    lengthOfInactivity = 8000;
    showSpeechBubble = false;
    speechBubbleTimeout = null;
    barrelRight = false;
    barrelLeft = false;
    canMoveRight = true;
    canMoveLeft = true;
    isOnBarrel = false;
    characterMovementInterval;
    characterAnimationInterval;
    characterIdleAnimationInterval;
    offset = {
        top: 120,
        left: 30,
        right: 50,
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

    IMAGE_SPEECH_BUBBLE = ['assets/icons/speech-bubble.png'];

    constructor() {
        super().loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGE_SPEECH_BUBBLE);
        this.applyGravity();
        this.animate();
    }

    /**
     * 
     * Initializes and starts all primary animation and movement intervals for the character.
     * @memberof Character
     */
    animate() {
        this.setupMovementInterval();
        this.setupAnimationInterval();
        this.setupIdleAnimationInterval();
    }

    /**
     * 
     * Returns the default Y-coordinate to which the character should be reset.
     * @returns {number} The Y-coordinate for character reset.
     * @memberof Character
     */
    resetsCharacterToY() {
        return 155;
    }

    /**
     * 
     * Checks if the character has been idle for a specified duration.
     * @returns {boolean} True if `lastActivityTime` exceeds `lengthOfInactivity`.
     * @memberof Character
     */
    isIdle() {
        let timePassed = Date.now() - this.lastActivityTime;
        return timePassed > this.lengthOfInactivity;
    }

    /**
     * 
     * Sets up a continuous interval for character movement and camera tracking.
     * @memberof Character
     */
    setupMovementInterval() {
        this.characterMovementInterval = setInterval(() => {
            this.updateLastActivityTime();
            this.handleMovement();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    /**
     * 
     * Handles all directional and jump movements for the character.
     * @memberof Character
     */
    handleMovement() {
        this.handleRightMovement();
        this.handleLeftMovement();
        this.handleJump();
    }

    /**
     * 
     * Manages the character's movement to the right based on input and boundaries.
     * @memberof Character
     */
    handleRightMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && this.canMoveRight) {
            this.moveRight();
            this.manageWalkSound();
            this.otherDirection = false;
        }
    }

    /**
     * 
     * Manages the character's movement to the left based on input and boundaries.
     * @memberof Character
     */
    handleLeftMovement() {
        if (this.world.keyboard.LEFT && this.x > 0 && this.canMoveLeft) {
            this.moveLeft();
            this.manageWalkSound();
            this.otherDirection = true;
        }
    }

    /**
     * 
     * Manages the character's walking sound based on ground contact and game state.
     * @memberof Character
     */
    manageWalkSound() {
        if (!this.isAboveGround() && !isGameFinish) {
            walkin_sound.play();
        } else {
            walkin_sound.pause();
            walkin_sound.currentTime = 0;
        }
    }

    /**
     * 
     * Handles the character's jump action based on input and ground contact.
     * @memberof Character
     */
    handleJump() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            if (!isGameFinish) {
                jump_sound.play();
            }
            this.jump();
        }
    }

    /**
     * 
     * Updates the `lastActivityTime` if any character movement or action key is pressed.
     * @memberof Character
     */
    updateLastActivityTime() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE || this.world.keyboard.D) {
            this.lastActivityTime = Date.now();
        }
    }

    /**
     * 
     * Sets up the main animation interval for the character, handling various states like death, hurt, and movement.
     * @memberof Character
     */
    setupAnimationInterval() {
        this.characterAnimationInterval = setInterval(() => {
            if (checkAndHandleDeath(this)) return;
            if (checkAndHandleHurt(this)) return;
            if (checkAndHandleJumpAnimation(this)) return;
            checkAndHandleWalkAnimation(this);
            handleThrowBottle(this);
        }, 50);
    }

    /**
     * 
     * Executes the bottle throwing action, creating a new `ThrowableObject`.
     * @param {number} currentTime - The current timestamp when the throw is performed.
     * @memberof Character
     */
    performBottleThrow(currentTime) {
        let bottleX = this.x + (this.otherDirection ? -5 : 80);
        this.collectBottlesArray.splice(0, 1);
        let bottle = new ThrowableObject(bottleX, this.y + 130, this.otherDirection);
        this.bottles.push(bottle);
        this.lastThrow = currentTime;
        this.lastActivityTime = Date.now();
        this.clearSpeechBubble();
    }

    /**
     * 
     * Displays a speech bubble indicating that the character has no bottles.
     * @memberof Character
     */
    showEmptyBottleSpeechBubble() {
        if (!this.showSpeechBubble) {
            setTimeout(() => {
                this.showSpeechBubble = true;
                this.speechBubbleTimeout = setTimeout(() => {
                    this.showSpeechBubble = false;
                }, 2000);
            }, 200);
        }
    }

    /**
     * 
     * Hides the speech bubble and clears its timeout.
     * @memberof Character
     */
    clearSpeechBubble() {
        this.showSpeechBubble = false;
        if (this.speechBubbleTimeout) clearTimeout(this.speechBubbleTimeout);
    }

    /**
     * 
     * Sets up an interval for playing idle and long idle animations based on character activity.
     * @memberof Character
     */
    setupIdleAnimationInterval() {
        this.characterIdleAnimationInterval = setInterval(() => {
            const isCharacterMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE || this.world.keyboard.D;
            if (!this.isDead() && !this.isHurt() && !this.isAboveGround() && !isCharacterMoving) {
                this.handleIdleAnimations();
            }
        }, 200);
    }

    /**
     * 
     * Handles playing the appropriate idle animation (normal or long idle) and associated sounds.
     * @memberof Character
     */
    handleIdleAnimations() {
        if (this.isIdle()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            if (!isGameFinish) {
                snoring_audio.play();
                snoring_audio.volume = snoring_audio_volume;
                game_music.volume = game_music_volume_silence;
            }
        } else {
            this.playAnimation(this.IMAGES_IDLE);
            snoring_audio.pause();
            snoring_audio.currentTime = 0;
            game_music.volume = game_music_volume_loude;
        }
    }

    /**
     * 
     * Stops all intervals specific to the character and resets related audio and UI states.
     * Overrides the base `stopAllIntervals` method.
     * @override
     * @memberof Character
     */
    stopAllIntervals() {
        super.stopAllIntervals();
        this.handleAllIntervalCharacter();
        this.resetAudio();
        this.showSpeechBubble = false;
        this.clearSpeechBubbleTimeout();
    }

    /**
     * 
     * Clears and nullifies all character-specific animation and movement intervals.
     * @private
     * @memberof Character
     */
    handleAllIntervalCharacter() {
        if (this.characterMovementInterval) {
            clearInterval(this.characterMovementInterval);
            this.characterMovementInterval = null;
        }
        if (this.characterAnimationInterval) {
            clearInterval(this.characterAnimationInterval);
            this.characterAnimationInterval = null;
        }
        if (this.characterIdleAnimationInterval) {
            clearInterval(this.characterIdleAnimationInterval);
            this.characterIdleAnimationInterval = null;
        }
    }

    /**
     * 
     * Pauses and resets specific audio elements related to character actions (walking, snoring).
     * @private
     * @memberof Character
     */
    resetAudio() {
        walkin_sound.pause();
        walkin_sound.currentTime = 0;
        snoring_audio.pause();
        snoring_audio.currentTime = 0;
    }

    /**
     * 
     * Clears any active timeout for the speech bubble and nullifies its reference.
     * @private
     * @memberof Character
     */
    clearSpeechBubbleTimeout() {
        if (this.speechBubbleTimeout) {
            clearTimeout(this.speechBubbleTimeout);
            this.speechBubbleTimeout = null;
        }
    }

    /**
     * 
     * Starts all necessary intervals for the character's operation, if the character is not dead.
     * Overrides the base `startAllIntervals` method.
     * @override
     * @memberof Character
     */
    startAllIntervals() {
        if (!this.isDead()) {
            super.startAllIntervals();
            this.animate();
        }
    }

    /**
     * 
     * Draws the character on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @override
     * @memberof Character
     */
    draw(ctx) {
        super.draw(ctx);
    }
}




