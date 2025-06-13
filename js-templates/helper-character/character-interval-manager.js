/**
* 
* Starts all necessary intervals for the character's operation, if the character is not dead.
* Overrides the base `startAllIntervals` method.
* @override
* @memberof Character
*/
function startAllIntervals() {
    if (!world.character.isDead()) {
        world.character.startAllIntervals();
        world.character.animate();
    }
}

/**
    * 
    * Stops all intervals specific to the character and resets related audio and UI states.
    * Overrides the base `stopAllIntervals` method.
    * @override
    * @memberof Character
    */
function stopAllIntervals() {
    world.character.stopAllIntervals();
    handleAllIntervalCharacter();
    world.character.resetAudio();
    world.showSpeechBubble = false;
    world.character.clearSpeechBubbleTimeout();
}

/**
 * 
 * Clears and nullifies all character-specific animation and movement intervals.
 * @private
 * @memberof Character
 */
function handleAllIntervalCharacter() {
    if (characterMovementInterval) {
        clearInterval(characterMovementInterval);
        characterMovementInterval = null;
    }
    if (characterAnimationInterval) {
        clearInterval(characterAnimationInterval);
        characterAnimationInterval = null;
    }
    if (characterIdleAnimationInterval) {
        clearInterval(characterIdleAnimationInterval);
        characterIdleAnimationInterval = null;
    }
}

/**
 * 
 * Sets up a continuous interval for character movement and camera tracking.
 * @memberof Character
 */
function setupMovementInterval() {
    characterMovementInterval = setInterval(() => {
        world.character.updateLastActivityTime();
        world.character.handleMovement();
        world.camera_x = -world.character.x + 100;
    }, 1000 / 60);
}

/**
 * 
 * Sets up the main animation interval for the character, handling various states like death, hurt, and movement.
 * @memberof Character
 */
function setupAnimationInterval() {
    characterAnimationInterval = setInterval(() => {
        if (world.character.checkAndHandleDeath()) return;
        if (world.character.checkAndHandleHurt()) return;
        if (world.character.checkAndHandleJumpAnimation()) return;
        world.character.checkAndHandleWalkAnimation();
        world.character.handleThrowBottle();
    }, 50);
}

/**
* 
* Sets up an interval for playing idle and long idle animations based on character activity.
* @memberof Character
*/
function setupIdleAnimationInterval() {
    characterIdleAnimationInterval = setInterval(() => {
        const isCharacterMoving = world.keyboard.RIGHT || world.keyboard.LEFT || world.keyboard.SPACE || world.keyboard.D;
        if (!world.character.isDead() && !world.character.isHurt() && !world.character.isAboveGround() && !isCharacterMoving) {
            world.character.handleIdleAnimations();
        }
    }, 200);
}

