class World {
  character = new Character();
  endboss;
  movableObject = new MovableObject();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBarHealth = new StatusBar('health');
  statusBarCoins = new StatusBar('coins');
  statusBarBottles = new StatusBar('bottle');
  statusBarEndboss = new StatusBar('endboss');
  totalCoinsInLevel;
  totalBottlesInLevel;
  showEndbossStatusBar = false;
  bottleHitSomething = false;
  worldInterval;


  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    playGameMusic();
    this.draw();
    this.setWorld();
    this.allwaysExecuted();
    this.totalCoinsInLevel = this.level.coinsArray.length;
    this.totalBottlesInLevel = this.level.bottlesArray.length;
  }

  /**
   * 
   * Initializes the game world by establishing critical references and relationships between objects.
   *
   * This function performs essential setup tasks:
   * - Assigns the `World` instance to the `character.world` property, allowing the character to access world properties.
   * - Identifies and stores a reference to the `Endboss` instance from the `level.enemiesArray`.
   * - Iterates through all enemies in the level, assigning the `World` instance to each enemy's `world` property.
   * - For specific enemy types (Chicken, Chick, Endboss), it also assigns a reference to the `character`,
   * enabling these enemies to interact directly with the character (e.g., for collision detection).
   *
   * @memberof World
   */
  setWorld() {
    this.character.world = this;
    this.endboss = this.level.enemiesArray.find(enemy => enemy instanceof Endboss);
    this.level.enemiesArray.forEach(enemy => {
      enemy.world = this;
      if (enemy instanceof Chicken || enemy instanceof Chick || enemy instanceof Endboss) {
        enemy.character = this.character;
      }
    });
  }

  /**
   * 
 * Initiates the main game loop, which runs continuously to handle essential game logic.
 *
 * This function sets up an `setInterval` that executes a series of critical game operations
 * every 20 milliseconds. These operations include:
 * - **Collision detection**: Checking for interactions between various game entities.
 * - **Barrel collisions**: Specifically handling interactions with barrels, including movement restrictions and standing on them.
 * - **Object collection**: Detecting and processing the collection of bottles and coins by the character,
 * including playing associated sounds and removing collected items from the level.
 * - **Status bar updates**: Ensuring that all game status bars (health, coins, bottles, endboss)
 * are visually updated to reflect the current game state.
 *
 * @memberof World
 */
  allwaysExecuted() {
    this.worldInterval = setInterval(() => {
      checkCollisions();
      checkCollisionsBarrel();
      this.collectObjects(this.level.bottlesArray, this.character.collectBottlesArray, PATH_COLLECT_BOTTLE_AUDIO, collect_bottle_audio_volume, 800);
      this.collectObjects(this.level.coinsArray, this.character.collectCoinsArray, PATH_COLLECT_COIN_AUDIO, collect_coin_audio_volume, 500);
      this.updateStatusBars();
    }, 20);
  }

  /**
   * 
   * Updates the display of all relevant status bars in the game.
   *
   * This function ensures that the health bar, endboss health bar (if active),
   * coin status bar, and bottle status bar accurately reflect the current game state.
   * It uses helper functions to calculate percentages for collected items and
   * directly updates the health and endboss energy.
   *
   * @memberof World
   */
  updateStatusBars() {
    this.statusBarHealth.setPercentage(this.character.characterEnergy);

    if (this.endboss) {
      this.statusBarEndboss.setPercentage(this.endboss.endbossEnergy);
    }

    this.helpFunctionUpdateStatusBar(
      this.totalCoinsInLevel,
      this.character.collectCoinsArray,
      this.statusBarCoins
    );

    this.helpFunctionUpdateStatusBar(
      this.totalBottlesInLevel,
      this.character.collectBottlesArray,
      this.statusBarBottles
    );
  }

  /**
   * 
   * Calculates and updates the percentage displayed on a status bar based on collected items.
   *
   * This helper function takes the total number of items available in a level, the array
   * of items the character has collected, and a specific status bar. If there are
   * `totalItems` to begin with (i.e., `totalItems` is greater than 0), it calculates
   * the collection progress as a percentage and updates the provided `statusBar` accordingly.
   *
   * @param {number} totalItems - The total number of a specific item type present in the level.
   * @param {Array<Object>} collectedItemsArray - The array holding the items the character has collected.
   * @param {StatusBar} statusBar - The `StatusBar` instance to be updated.
   * @memberof World
   */
  helpFunctionUpdateStatusBar(totalItems, collectedItemsArray, statusBar) {
    if (totalItems > 0) {
      let percentage = (collectedItemsArray.length / totalItems) * 100;
      statusBar.setPercentage(percentage);
    }
  }

  /**
   * 
   * Handles the collection of objects by the character when a collision occurs.
   *
   * This function iterates through a given `levelArray` (e.g., bottles or coins in the world).
   * If the character is colliding with a `singleObject` in this array:
   * 1. The `singleObject` is added to the character's `characterItemArrays` (e.g., `collectBottlesArray`).
   * 2. The collected `singleObject` is removed from the `levelArray` so it's no longer in the world.
   * 3. A corresponding collectible sound effect is played using the provided `audioPath`, `volume`, and `timeoutMs`.
   *
   * @param {Array<Object>} levelArray - The array of objects currently present in the level (e.g., `level.bottlesArray`).
   * @param {Array<Object>} characterItemArrays - The character's array to store collected items (e.g., `character.collectBottlesArray`).
   * @param {string} audioPath - The file path to the sound effect for collecting this type of object.
   * @param {number} volume - The volume level for the collectible sound (0.0 to 1.0).
   * @param {number} timeoutMs - The time in milliseconds to pause/reset the collectible sound.
   * @memberof World
   */
  collectObjects(levelArray, characterItemArrays, audioPath, volume, timeoutMs) {
    levelArray.forEach((singleObject, index) => {
      if (this.character.isColliding(singleObject)) {
        characterItemArrays.push(singleObject);
        levelArray.splice(index, 1);
        playCollectibleSound(audioPath, volume, timeoutMs);
      }
    });
  }

  /**
   * 
  * Removes an enemy from the `level.enemiesArray` after a specified delay.
  * This is typically used for enemies that have a "death" animation or sound
  * that should play before they disappear from the game.
  *
  * It calculates the enemy's index in the array, either by using a provided `indexToRemove`
  * or by finding the current index of `enemyToRemove`. If the enemy is found, it's removed.
  *
  * @param {MovableObject} enemyToRemove - The enemy object to be removed from the level.
  * @param {number} delay - The time in milliseconds to wait before removing the enemy.
  * @param {number} [indexToRemove=-1] - Optional. The known index of the enemy in the `enemiesArray`.
  * If provided, it avoids searching the array. Defaults to -1.
  * @memberof World
  */
  removeEnemyAfterDelay(enemyToRemove, delay, indexToRemove = -1) {
    setTimeout(() => {
      const currentEnemyIndex = indexToRemove !== -1 ? indexToRemove : this.level.enemiesArray.indexOf(enemyToRemove);

      if (currentEnemyIndex > -1) {
        this.level.enemiesArray.splice(currentEnemyIndex, 1);
      }
    }, delay);
  }

  /**
   * 
   * Removes a bottle from the character's collection of thrown bottles.
   * This function is typically called after a bottle has collided with something
   * (like an enemy or a barrel) and should no longer be active in the game world.
   *
   * @param {number} bottleIndex - The index of the bottle to remove from the `character.bottles` array.
   * @memberof World
   */
  removeBottle(bottleIndex) {
    this.character.bottles.splice(bottleIndex, 1);
  }

  /**
   * 
   * Main drawing loop that continuously renders game objects on the canvas.
   * It calls various methods to draw different layers of objects and then requests the next animation frame
   * to maintain a continuous drawing cycle.
   * @returns {void}
   */
  draw() {
    this.setFirstInstanceDrawObjects()
    // ------------Space for fixed objects-----------
    this.setSecondInstanceDrawObjects()
    this.setThirdInstanceDrawObjects()
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * 
   * Draws the first instance of game objects, primarily background elements.
   * This includes clearing the canvas, applying camera translation for background parallax,
   * and adding background and cloud objects to the map.
   * @returns {void}
   */
  setFirstInstanceDrawObjects() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjectsArray);
    this.addObjectsToMap(this.level.cloudsArray);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * 
   * Draws the second instance of game objects, specifically the status bars.
   * This includes the health, coin, and bottle status bars, and conditionally, the endboss status bar.
   * These are typically drawn at a fixed position on the screen, not affected by camera movement.
   * @returns {void}
   */
  setSecondInstanceDrawObjects() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    if (this.showEndbossStatusBar) {
      this.addToMap(this.statusBarEndboss);
    }
  }

  /**
   * 
   * Draws the third instance of game objects, which includes interactive elements and the character.
   * This applies camera translation to simulate movement, then adds coins, barrels, the main character,
   * enemies, and bottles to the map.
   * @returns {void}
   */
  setThirdInstanceDrawObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.coinsArray);
    this.addObjectsToMap(this.level.barrelArray);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemiesArray);
    this.addObjectsToMap(this.level.bottlesArray);
    this.addObjectsToMap(this.character.bottles);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
  * Iterates through an array of game objects and adds each one to the canvas map.
  * This is a helper function used to draw collections of similar objects, like
  * background elements, enemies, or collectibles.
  *
  * @param {Array<MovableObject>} objects - An array of `MovableObject` instances to be drawn.
  * @memberof World
  */
  addObjectsToMap(objects) {
    objects.forEach(object => {
      this.addToMap(object);
    });
  }

  /**
   * 
   * Adds a single `MovableObject` to the canvas map, handling its rendering direction.
   * This function is responsible for drawing individual game entities, including
   * applying image flipping when necessary and drawing specific UI elements like speech bubbles.
   *
   * @param {MovableObject} movableObject - The `MovableObject` instance to be drawn on the canvas.
   * @memberof World
   */
  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.draw(this.ctx);

    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }

    if (movableObject instanceof Character && movableObject.showSpeechBubble) {
      movableObject.drawSpeechBubbleImage(this.ctx, movableObject.IMAGE_SPEECH_BUBBLE);
    }
  }

  /**
   * 
  * Flips an image horizontally on the canvas context.
  * This is typically used to change the rendering direction of a `MovableObject`
  * without altering its internal `x` coordinate for game logic.
  *
  * It performs the following steps:
  * 1. Saves the current state of the canvas context.
  * 2. Translates the context by the object's width to prepare for scaling from the right edge.
  * 3. Scales the context horizontally by -1, effectively flipping subsequent drawings.
  * 4. Adjusts the object's `x` coordinate to compensate for the flipped context,
  * ensuring it draws at the correct visual position.
  *
  * @param {MovableObject} movableObject - The object whose image needs to be flipped.
  * @memberof World
  */
  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1)
    movableObject.x = movableObject.x * -1;
  }

  /**
   * 
   * Restores the canvas context after an image has been flipped.
   * This reverts the transformations applied by `flipImage` and restores the original `x` coordinate
   * of the `MovableObject` to ensure consistent game logic.
   *
   * It performs the following steps:
   * 1. Reverts the object's `x` coordinate back to its original value.
   * 2. Restores the previously saved canvas context, undoing the `translate` and `scale` transformations.
   *
   * @param {MovableObject} movableObject - The object whose image was flipped.
   * @memberof World
   */
  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }

}

