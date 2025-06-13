/**
     * 
     * Checks if the character is dead, plays death animation/sound, stops intervals, and triggers game over.
     * @returns {boolean} True if the character is dead and handled.
     * @memberof Character
     */
function checkAndHandleDeath(character) {
    if (character.isDead()) {
        character.playAnimation(character.IMAGES_DEAD);
        if (!isGameFinish) {
            death_sound.volume = death_sound_volume;
            death_sound.play();
        }
        character.stopAllIntervals();
        setTimeout(() => {
            handleYouLooseScreen();
        }, 1600);
        return true;
    }
    return false;
}

/**
   * 
   * Checks if the character is hurt, plays hurt animation/sound, and updates activity time.
   * @returns {boolean} True if the character is hurt and handled.
   * @memberof Character
   */
function checkAndHandleHurt(character) {
    if (character.isHurt()) {
        character.playAnimation(character.IMAGES_HURT);
        if (!isGameFinish) {
            hurt_sound.play();
        }
        character.lastActivityTime = Date.now();
        return true;
    }
    return false;
}

/**
     * 
     * Checks if the character is above ground and plays the jumping animation.
     * @returns {boolean} True if the character is above ground and jump animation is played.
     * @memberof Character
     */
function checkAndHandleJumpAnimation(character) {
    if (character.isAboveGround()) {
        character.playAnimation(character.IMAGES_JUMPING);
        character.lastActivityTime = Date.now();
        return true;
    }
    return false;
}

/**
    * 
    * Plays the walking animation if the character is moving left or right.
    * @memberof Character
    */
function checkAndHandleWalkAnimation(character) {
    if (world.keyboard.RIGHT || world.keyboard.LEFT) {
        character.playAnimation(character.IMAGES_WALKING);
    }
}

/**
     * 
     * Handles the logic for throwing a bottle based on keyboard input and throw cooldown.
     * @memberof Character
     */
function handleThrowBottle(character) {
    if (world.keyboard.D) {
        let currentTime = new Date().getTime();
        let timeSinceLastThrow = currentTime - character.lastThrow;

        if (timeSinceLastThrow >= character.throwInterval && character.collectBottlesArray.length > 0) {
            character.performBottleThrow(currentTime);
        } else if (character.collectBottlesArray.length === 0) {
            character.showEmptyBottleSpeechBubble();
        }
    }
}