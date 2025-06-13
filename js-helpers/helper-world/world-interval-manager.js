/**
 * 
* Orchestrates the starting of all game-related intervals and music.
* This function is typically called when the game starts or resumes.
* It ensures the main world loop, character, enemies, collectibles, and background elements
* all begin their active processes.
* @memberof World
*/
function startAllIntervals() {
    startMainWorldLoop();
    startCharacterIntervals();
    startIntervalsForCollection(world.level.enemiesArray);
    startIntervalsForCollection(world.character.bottles);
    startIntervalsForCollection(world.level.coinsArray);
    startIntervalsForCollection(world.level.cloudsArray);
    startBackgroundMusicTracks();
}

/**
 * 
 * Stops all active intervals and pauses all relevant audio within the game world.
 * This function orchestrates the stopping of intervals for the main world loop,
 * the character, enemies, bottles, coins, and clouds, and pauses game-specific music.
 * This is typically called when the game ends or is reset.
 * @memberof World
 */
function stopAllIntervals() {
    stopWorldMainInterval();
    stopCharacterIntervals();
    stopIntervalsForCollection(world.level.enemiesArray);
    stopIntervalsForCollection(world.character.bottles);
    stopIntervalsForCollection(world.level.coinsArray);
    stopIntervalsForCollection(world.level.cloudsArray);
    pauseSpecificGameMusic();
    pauseAllGameAudio();
}

/**
   * 
   * Starts all intervals associated with the main character if the character object and its
   * `startAllIntervals` method exist.
   * @memberof World
   */
function startCharacterIntervals() {
    if (world.character && typeof world.character.startAllIntervals === 'function') {
        world.character.startAllIntervals();
    }
}

/**
 * 
 * Iterates through a collection of game objects (e.g., enemies, bottles, coins, clouds)
 * and starts their individual intervals if they are not dead and have a `startAllIntervals` method.
 * @param {Array<Object>} objectsArray - The array of game objects to process.
 * @memberof World
 */
function startIntervalsForCollection(objectsArray) {
    if (objectsArray) {
        objectsArray.forEach(obj => {
            const canStart = (obj instanceof Character || obj instanceof MovableObject) ? !obj.isDead() : true;
            if (obj && canStart && typeof obj.startAllIntervals === 'function') {
                obj.startAllIntervals();
            }
        });
    }
}

/**
 * 
 * Iterates through an array of game objects (like enemies, bottles, coins, clouds)
 * and stops all intervals for each if they have a `stopAllIntervals` method.
 * @param {Array<Object>} objectsArray - The array of game objects to process.
 * @memberof World
 */
function stopIntervalsForCollection(objectsArray) {
    if (objectsArray) {
        objectsArray.forEach(obj => {
            if (obj && typeof obj.stopAllIntervals === 'function') {
                obj.stopAllIntervals();
            }
        });
    }
}

/**
   * Stops the main world interval.
   * @memberof World
   */
function stopWorldMainInterval() {
    if (world.worldInterval) {
        clearInterval(this.worldInterval);
        world.worldInterval = null;
    }
}

/**
 * 
 * Stops all intervals associated with the main character.
 * @memberof World
 */
function stopCharacterIntervals() {
    if (world.character && typeof world.character.stopAllIntervals === 'function') {
        world.character.stopAllIntervals();
    }
}

/**
  * 
  * Starts the main continuous game loop, which includes checking for collisions and updating game elements.
  * This is the primary interval for the game world.
  * @memberof World
  */
function startMainWorldLoop() {
    world.allwaysExecuted();
}