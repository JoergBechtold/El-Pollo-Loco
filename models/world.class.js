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
    this.playGameMusic();
    this.draw();
    this.setWorld();
    this.allwaysExecuted();
    this.totalCoinsInLevel = this.level.coinsArray.length;
    this.totalBottlesInLevel = this.level.bottlesArray.length;
  }

  /**
   * 
   * Starts playing the main background music for the game.
   *
   * This function initiates playback of the `game_music` audio element
   * and sets its volume to a predefined loud level (`game_music_volume_loude`).
   * It's typically called once when the game starts.
   *
   * @memberof World
   */
  playGameMusic() {
    game_music.play();
    game_music.volume = game_music_volume_loude;
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
      this.checkCollisions();
      this.checkCollisionsBarrel();
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
        this.playCollectibleSound(audioPath, volume, timeoutMs);
      }
    });
  }

  /**
   * 
   * Plays a sound effect for collecting an item, ensuring it doesn't loop indefinitely.
   *
   * This function creates and plays an audio file from the given `audioPath` with a specified `volume`.
   * The sound will only play if the game is not muted and not finished. After a `timeoutMs` duration,
   * the audio is paused and its playback position reset to the beginning. This prevents multiple
   * instances of the same sound from playing over each other and frees up audio resources.
   *
   * @param {string} audioPath - The file path to the audio sound to be played.
   * @param {number} volume - The volume level for the audio (0.0 to 1.0).
   * @param {number} timeoutMs - The time in milliseconds after which the audio should be paused and reset.
   * @memberof World
   */
  playCollectibleSound(audioPath, volume, timeoutMs) {
    if (!isMuted && !isGameFinish) {
      let audio = new Audio(audioPath);
      audio.play();
      audio.volume = volume;
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, timeoutMs);
    }
  }

  /**
   * 
   * Manages all collision checks and related logic between the character and barrels in the level.
   *
   * This function performs a comprehensive check for character-barrel interactions in each game loop.
   * It first resets all character flags related to barrel collisions. Then, it iterates through
   * every barrel in the level, handling both **lateral (side-to-side)** and **vertical (standing on top)**
   * collisions. Finally, it updates the character's ground level based on whether they are currently
   * standing on any barrel, ensuring proper gravity and movement.
   *
   * @memberof World
   */
  checkCollisionsBarrel() {
    this.resetBarrelCollisionFlags();
    let characterIsCurrentlyOnABarrel = false;

    this.level.barrelArray.forEach((barrel) => {
      this.handleLateralBarrelCollisions(barrel);
      characterIsCurrentlyOnABarrel = this.handleVerticalBarrelCollision(barrel) || characterIsCurrentlyOnABarrel;
    });

    this.updateCharacterGroundLevel(characterIsCurrentlyOnABarrel);
  }

  /**
   * 
 * Handles horizontal collisions between the character and a barrel.
 *
 * This function is called when the character is generally colliding with a barrel.
 * It then dispatches to more specific functions (`checkAndSetRightCollision` and
 * `checkAndSetLeftCollision`) to determine and apply movement restrictions based
 * on which side of the barrel the character is hitting.
 *
 * @param {MovableObject} barrel - The barrel object the character is colliding with.
 * @memberof World
 */
  handleLateralBarrelCollisions(barrel) {
    if (this.character.isColliding(barrel)) {
      this.checkAndSetRightCollision(barrel);
      this.checkAndSetLeftCollision(barrel);
    }
  }

  /**
   * 
   * Checks for a collision on the right side of the character with a barrel and updates character movement flags.
   *
   * This function determines if the character is currently colliding with the left edge of a barrel
   * (meaning the character is trying to move right into the barrel). If a collision is detected,
   * it sets `character.canMoveRight` to `false` to prevent further right movement and
   * sets `character.barrelRight` to `true` to indicate a right barrel collision.
   *
   * @param {MovableObject} barrel - The barrel object being checked for collision.
   * @memberof World
   */
  checkAndSetRightCollision(barrel) {
    if (this.character.x + this.character.width - this.character.offset.right > barrel.x + barrel.offset.left &&
      this.character.x + this.character.offset.left < barrel.x + barrel.offset.left) {
      this.character.canMoveRight = false;
      this.character.barrelRight = true;
    }
  }

  /**
   * 
  * Checks for a collision on the left side of the character with a barrel and updates character movement flags.
  *
  * This function determines if the character is currently colliding with the right edge of a barrel
  * (meaning the character is trying to move left into the barrel). If a collision is detected,
  * it sets `character.canMoveLeft` to `false` to prevent further left movement and
  * sets `character.barrelLeft` to `true` to indicate a left barrel collision.
  *
  * @param {MovableObject} barrel - The barrel object being checked for collision.
  * @memberof World
  */
  checkAndSetLeftCollision(barrel) {
    if (this.character.x + this.character.offset.left < barrel.x + barrel.width - barrel.offset.right &&
      this.character.x + this.character.width - this.character.offset.right > barrel.x + barrel.width - barrel.offset.right) {
      this.character.canMoveLeft = false;
      this.character.barrelLeft = true;
    }
  }

  /**
   * 
   * Handles vertical collision detection between the character and a barrel, determining if the character is standing on it.
   *
   * This function checks for both vertical alignment (character's bottom roughly at barrel's top)
   * and horizontal overlap. If both conditions are met, it means the character is standing on the barrel.
   * In this case, `character.isOnBarrel` is set to `true`, and `character.groundLevel` is adjusted
   * to the top of the barrel, preventing the character from falling through it.
   *
   * @param {MovableObject} barrel - The barrel object being checked for vertical collision.
   * @returns {boolean} `true` if the character is standing on the barrel, `false` otherwise.
   * @memberof World
   */
  handleVerticalBarrelCollision(barrel) {
    const charBottom = this.character.y + this.character.height - this.character.offset.bottom;
    const barrelTop = barrel.y + barrel.offset.top;
    const isVerticallyAligned = charBottom >= barrelTop - 10 && charBottom <= barrelTop + 10;
    const isHorizontallyOverlapping = this.character.x + this.character.offset.left < barrel.x + barrel.width - barrel.offset.right &&
      this.character.x + this.character.width - this.character.offset.right > barrel.x + barrel.offset.left;

    if (isVerticallyAligned && isHorizontallyOverlapping) {
      this.character.isOnBarrel = true;
      this.character.groundLevel = barrelTop - (this.character.height - this.character.offset.bottom);
      return true;
    }
    return false;
  }

  /**
   * 
  * Updates the character's ground level based on whether they are currently standing on a barrel.
  *
  * If the character is **not** currently detected as being on a barrel, this function
  * resets their `isOnBarrel` flag to `false` and restores their `groundLevel`
  * to the default ground level (obtained via `resetsCharacterToY()`). This ensures
  * the character correctly falls if they move off a barrel.
  *
  * @param {boolean} characterIsCurrentlyOnABarrel - A boolean indicating if the character is currently on any barrel.
  * @memberof World
  */
  updateCharacterGroundLevel(characterIsCurrentlyOnABarrel) {
    if (!characterIsCurrentlyOnABarrel) {
      this.character.isOnBarrel = false;
      this.character.groundLevel = this.character.resetsCharacterToY();
    }
  }

  /**
   * 
   * Resets all character flags related to barrel collisions.
   *
   * This function is called at the beginning of each barrel collision check cycle
   * to ensure that movement restrictions (`canMoveLeft`, `canMoveRight`) and
   * barrel-specific collision flags (`barrelLeft`, `barrelRight`) are cleared.
   * This prevents lingering collision states from affecting character movement
   * in subsequent frames.
   *
   * @memberof World
   */
  resetBarrelCollisionFlags() {
    this.character.canMoveLeft = true;
    this.character.canMoveRight = true;
    this.character.barrelLeft = false;
    this.character.barrelRight = false;
  }

  /**
   * 
  * Orchestrates all collision checks within the game world.
  * This method is the central point for detecting interactions between different game entities.
  * It specifically checks for collisions between the **character and enemies**,
  * and then delegates the comprehensive collision handling for **bottles** to a separate function.
  *
  * @memberof World
  */
  checkCollisions() {
    this.level.enemiesArray.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.handleCharacterEnemyCollision(enemy);
      }
    });

    this.handleCharacterAndBottles();
  }

  /**
   * 
   * Manages all collision detection and resolution for bottles thrown by the character.
   *
   * For each active bottle, this function performs checks against both **enemies** and **barrels**.
   * If a bottle collides with any of these elements, a `bottleHitSomething` flag is set,
   * and the bottle is then removed from the game world.
   *
   * @memberof World
   */
  handleCharacterAndBottles() {
    this.character.bottles.forEach((bottle, bottleIndex) => {
      this.bottleHitSomething = false;
      this.handleBottleEnemyCollisions(bottle, bottleIndex);
      this.handleBottleBarrelCollisions(bottle);

      if (this.bottleHitSomething) {
        this.removeBottle(bottleIndex);
      }
    });
  }


  /**
   * 
 * Handles the immediate consequences when the character collides with an enemy.
 *
 * This function determines if the collision is a jump attack (character is falling onto the enemy)
 * or a direct hit. If the character is above ground and moving downwards while colliding with
 * a live enemy, it dispatches to `handleCharacterJumpAttack`. Otherwise, if the enemy is alive,
 * it triggers the character's `hit` method, indicating the character took damage.
 *
 * @param {MovableObject} enemy - The enemy instance with which the character has collided.
 * @memberof World
 */
  handleCharacterEnemyCollision(enemy) {
    if (this.character.isAboveGround() && this.character.speedY < 0 && !enemy.isDead()) {
      this.handleCharacterJumpAttack(enemy);
    }
    else if (!enemy.isDead()) {
      this.character.hit();
    }
  }

  /**
   * 
   * Dispatches to the appropriate jump attack handler based on the type of enemy.
   *
   * This function serves as a router for jump attacks, ensuring that specific logic
   * is applied depending on whether the character jumped on a `Chicken`/`Chick` or an `Endboss`.
   *
   * @param {MovableObject} enemy - The enemy instance that the character jumped on.
   * @memberof World
   */
  handleCharacterJumpAttack(enemy) {
    if (enemy instanceof Chicken || enemy instanceof Chick) {
      this.handleChickenJumpDeath(enemy);
    }
    else if (enemy instanceof Endboss) {
      this.handleEndbossJumpDamage(enemy);
    }
  }

  /**
   * 
  * Handles the specific logic when the character performs a jump attack (bounces) on a chicken or chick.
  *
  * This function sets the chicken's energy to zero, ensuring it's marked as defeated. It then
  * flags that the death animation hasn't started yet, plays the appropriate sound effect,
  * triggers the character's bounce animation, and schedules the chicken's removal from the level after a delay.
  *
  * @param {Chicken|Chick} chicken - The chicken or chick instance that was jumped on.
  * @memberof World
  */
  handleChickenJumpDeath(chicken) {
    chicken.energy = 0;
    chicken.isDeadAnimationPlayed = false;
    this.playEnemyBounceDeadSound();
    this.character.bounce(chicken);
    this.removeEnemyAfterDelay(chicken, 500);
  }

  /**
   * 
   * Handles the logic when the character performs a jump attack (bounces) on the Endboss.
   *
   * This function causes the Endboss to take damage from the bounce. It also ensures
   * the Endboss's death animation flag is reset (allowing hurt animation to play if applicable),
   * plays a generic bouncing sound, and makes the character bounce off the Endboss.
   *
   * @param {Endboss} endboss - The Endboss instance that was jumped on.
   * @memberof World
   */
  handleEndbossJumpDamage(endboss) {
    this.endboss.takeBounceDamage();
    endboss.isDeadAnimationPlayed = false;
    this.playBouncingSound();
    this.character.bounce(endboss);
  }

  /**
   * 
  * Plays the generic bouncing sound effect.
  *
  * This function creates a new `Audio` object for the bouncing sound and plays it,
  * provided the game is not muted and not finished. The volume is set to a predefined
  * level. A `setTimeout` is used to pause and reset the audio after 500 milliseconds,
  * ensuring the sound is brief and doesn't overlap excessively.
  *
  * @memberof World
  */
  playBouncingSound() {
    if (!isMuted && !isGameFinish) {
      let bouncing_audio = new Audio(PATH_BOUNCING_AUDIO);
      bouncing_audio.volume = bouncing_audio_volume;
      bouncing_audio.play();
      setTimeout(() => {
        bouncing_audio.pause();
        bouncing_audio.currentTime = 0;
      }, 500);
    }
  }

  /**
   * 
   * Plays the specific sound effect for an enemy dying from a bounce attack (e.g., jumping on a chicken).
   *
   * This function creates a new `Audio` object for the enemy bounce death sound and plays it,
   * provided the game is not muted and not finished. The volume is set to a predefined
   * level. A `setTimeout` is used to pause and reset the audio after 800 milliseconds,
   * ensuring the sound plays fully but doesn't linger.
   *
   * @memberof World
   */
  playEnemyBounceDeadSound() {
    if (!isMuted && !isGameFinish) {
      let enemy_bouncing_dead_audio = new Audio(PATH_CHICKEN_DEATH_JUMP_AUDIO);
      enemy_bouncing_dead_audio.volume = enemy_bouncing_dead_audio_volume;
      enemy_bouncing_dead_audio.play();
      setTimeout(() => {
        enemy_bouncing_dead_audio.pause();
        enemy_bouncing_dead_audio.currentTime = 0;
      }, 800);
    }
  }

  /**
   * 
  * Handles collisions between a thrown bottle and the enemies in the level.
  * This function iterates through all enemies. If a bottle collides with an active (not dead) enemy,
  * it sets the `bottleHitSomething` flag and calls `handleBottleHitEnemy` to process the specific interaction
  * based on the type of enemy.
  *
  * @param {MovableObject} bottle - The bottle instance that is currently active and potentially colliding.
  * @memberof World
  */
  handleBottleEnemyCollisions(bottle) {
    this.level.enemiesArray.forEach((enemy, enemyIndex) => {
      if (bottle.isColliding(enemy) && !enemy.isDead()) {
        this.bottleHitSomething = true;
        this.handleBottleHitEnemy(enemy, enemyIndex);
      }
    });
  }

  /**
   * 
   * Dispatches the bottle hit event to the appropriate handler based on the enemy type.
   * This function acts as a central point for determining how different types of enemies
   * react when hit by a bottle.
   *
   * @param {MovableObject} enemy - The enemy instance that was hit by the bottle.
   * @param {number} enemyIndex - The index of the enemy in the enemies array.
   * @memberof World
   */
  handleBottleHitEnemy(enemy, enemyIndex) {
    if (enemy instanceof Chicken || enemy instanceof Chick) {
      this.handleBottleHitChicken(enemy, enemyIndex);
    }
    else if (enemy instanceof Endboss) {
      this.handleBottleHitEndboss(enemy, enemyIndex);
      this.bottleHitSomething = true;
    }
  }

  /**
   * 
 * Handles the specific logic when a bottle hits a chicken or chick enemy.
 * This function is called when a thrown bottle collides with a chicken-type enemy.
 * It sets the chicken's energy to zero, flags that its death animation hasn't started yet,
 * plays the chicken death sound, schedules the chicken's removal after a delay,
 * and sets `bottleHitSomething` to true to indicate the bottle successfully hit a target.
 *
 * @param {Chicken|Chick} chicken - The chicken or chick instance that was hit by the bottle.
 * @param {number} enemyIndex - The index of the chicken/chick in the enemies array.
 * @memberof World
 */
  handleBottleHitChicken(chicken, enemyIndex) {
    chicken.energy = 0;
    chicken.isDeadAnimationPlayed = false;
    this.playChickenDeathSound();
    this.removeEnemyAfterDelay(chicken, 500, enemyIndex);
    this.bottleHitSomething = true;
  }

  /**
   * 
   * Handles collisions between a thrown bottle and barrels in the level.
   * This function iterates through all barrels. If a bottle collides with any barrel,
   * it sets the `bottleHitSomething` flag to `true`, indicating that the bottle
   * should likely be removed or its state changed (e.g., breaking).
   *
   * @param {Bottle} bottle - The bottle instance that might be colliding with barrels.
   * @memberof World
   */
  handleBottleBarrelCollisions(bottle) {
    this.level.barrelArray.forEach((barrel) => {
      if (bottle.isColliding(barrel)) {
        this.bottleHitSomething = true;
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
  * Handles the logic when a thrown bottle hits the Endboss.
  *
  * This function triggers the Endboss's `hit` method to register damage
  * and then plays the Endboss's "hurt" animation.
  *
  * @param {Endboss} endboss - The Endboss instance that was hit by the bottle.
  * @param {number} enemyIndex - The index of the Endboss in the enemies array (though not used in this specific function, it's common in collision handlers).
  * @memberof World
  */
  handleBottleHitEndboss(endboss, enemyIndex) {
    this.endboss.hit();
    this.endboss.playAnimation(this.endboss.IMAGES_HURT);
  }

  /**
   * 
   * Plays the bottle breaking sound effect.
   *
   * This function initiates the playback of the `bottle_splash` audio,
   * provided the game is not muted and not finished. It sets the volume
   * to a predefined level (`bottle_splash_volume`) and includes a short
   * timeout to pause and reset the audio, ensuring the sound doesn't
   * linger indefinitely.
   *
   * @memberof World
   */
  playBottleBreakSound() {
    if (!isMuted && !isGameFinish) {
      bottle_splash.play();
      bottle_splash.volume = bottle_splash_volume;
      setTimeout(() => {
        bottle_splash.pause();
        bottle_splash.currentTime = 0;
      }, 300);
    }
  }

  /**
   * 
 * Plays the chicken death sound effect.
 *
 * This function creates a new `Audio` object for the chicken death sound and plays it,
 * provided the game is not muted and not finished. The volume is set to a predefined
 * level. A `setTimeout` is used to pause and reset the audio after 1 second,
 * preventing long-running audio instances and ensuring the sound is short and sharp.
 *
 * @memberof World
 */
  playChickenDeathSound() {
    if (!isMuted && !isGameFinish) {
      let chicken_death_audio = new Audio(PATH_CHICKEN_DEATH_AUDIO);
      chicken_death_audio.volume = chicken_death_audio_volume;
      chicken_death_audio.play();
      setTimeout(() => {
        chicken_death_audio.pause();
        chicken_death_audio.currentTime = 0;
      }, 1000);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjectsArray);
    this.addObjectsToMap(this.level.cloudsArray);
    this.ctx.translate(-this.camera_x, 0);
    // ------------Space for fixed objects-----------
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    if (this.showEndbossStatusBar) {
      this.addToMap(this.statusBarEndboss);
    }

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.coinsArray);
    this.addObjectsToMap(this.level.barrelArray);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemiesArray);
    this.addObjectsToMap(this.level.bottlesArray);
    this.addObjectsToMap(this.character.bottles);
    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
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

  /**
   * 
   * Stops all active intervals and pauses all relevant audio within the game world.
   * This function orchestrates the stopping of intervals for the main world loop,
   * the character, enemies, bottles, coins, and clouds, and pauses game-specific music.
   * This is typically called when the game ends or is reset.
   * @memberof World
   */
  stopAllIntervals() {
    this.stopWorldMainInterval();
    this.stopCharacterIntervals();
    this.stopIntervalsForCollection(this.level.enemiesArray);
    this.stopIntervalsForCollection(this.character.bottles);
    this.stopIntervalsForCollection(this.level.coinsArray);
    this.stopIntervalsForCollection(this.level.cloudsArray);
    this.pauseSpecificGameMusic();
    this.pauseAllGameAudio();
  }

  /**
   * Stops the main world interval.
   * @memberof World
   */
  stopWorldMainInterval() {
    if (this.worldInterval) {
      clearInterval(this.worldInterval);
      this.worldInterval = null;
    }
  }

  /**
   * 
   * Stops all intervals associated with the main character.
   * @memberof World
   */
  stopCharacterIntervals() {
    if (this.character && typeof this.character.stopAllIntervals === 'function') {
      this.character.stopAllIntervals();
    }
  }

  /**
   * 
   * Iterates through an array of game objects (like enemies, bottles, coins, clouds)
   * and stops all intervals for each if they have a `stopAllIntervals` method.
   * @param {Array<Object>} objectsArray - The array of game objects to process.
   * @memberof World
   */
  stopIntervalsForCollection(objectsArray) {
    if (objectsArray) {
      objectsArray.forEach(obj => {
        if (obj && typeof obj.stopAllIntervals === 'function') {
          obj.stopAllIntervals();
        }
      });
    }
  }

  /**
   * 
   * Pauses and resets specific background music tracks for the game.
   * @memberof World
   */
  pauseSpecificGameMusic() {
    if (typeof game_music !== 'undefined' && typeof game_music.pause === 'function') {
      game_music.pause();
      game_music.currentTime = 0;
    }
    if (typeof endboss_music !== 'undefined' && typeof endboss_music.pause === 'function') {
      endboss_music.pause();
      endboss_music.currentTime = 0;
    }
  }

  /**
   * 
   * Pauses all audio elements in the `allAudioArray`.
   * @memberof World
   */
  pauseAllGameAudio() {
    allAudioArray.forEach(audio => {
      if (audio && typeof audio.pause === 'function') {
        audio.pause();
      }
    });
  }

  /**
   * 
 * Orchestrates the starting of all game-related intervals and music.
 * This function is typically called when the game starts or resumes.
 * It ensures the main world loop, character, enemies, collectibles, and background elements
 * all begin their active processes.
 * @memberof World
 */
  startAllIntervals() {
    this.startMainWorldLoop();
    this.startCharacterIntervals();
    this.startIntervalsForCollection(this.level.enemiesArray);
    this.startIntervalsForCollection(this.character.bottles);
    this.startIntervalsForCollection(this.level.coinsArray);
    this.startIntervalsForCollection(this.level.cloudsArray);
    this.startBackgroundMusicTracks();
  }

  /**
   * 
   * Starts the main continuous game loop, which includes checking for collisions and updating game elements.
   * This is the primary interval for the game world.
   * @memberof World
   */
  startMainWorldLoop() {
    this.allwaysExecuted();
  }

  /**
   * 
   * Starts all intervals associated with the main character if the character object and its
   * `startAllIntervals` method exist.
   * @memberof World
   */
  startCharacterIntervals() {
    if (this.character && typeof this.character.startAllIntervals === 'function') {
      this.character.startAllIntervals();
    }
  }

  /**
   * 
   * Iterates through a collection of game objects (e.g., enemies, bottles, coins, clouds)
   * and starts their individual intervals if they are not dead and have a `startAllIntervals` method.
   * @param {Array<Object>} objectsArray - The array of game objects to process.
   * @memberof World
   */
  startIntervalsForCollection(objectsArray) {
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
   * Starts playing the main background game music if it's defined and its `play` method exists.
   * @memberof World
   */
  startBackgroundMusicTracks() {
    if (typeof game_music !== 'undefined' && typeof game_music.play === 'function') {
      game_music.play();
    }
    if (this.endboss && this.endboss.endbossActivated && typeof endboss_music !== 'undefined' && typeof endboss_music.play === 'function') {
      endboss_music.play();
    }
  }
}

