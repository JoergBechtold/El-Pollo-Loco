/**
 * 
* Orchestrates all collision checks within the game world.
* This method is the central point for detecting interactions between different game entities.
* It specifically checks for collisions between the **character and enemies**,
* and then delegates the comprehensive collision handling for **bottles** to a separate function.
*
* @memberof World
*/
function checkCollisions() {
    world.level.enemiesArray.forEach((enemy) => {
        if (world.character.isColliding(enemy)) {
            handleCharacterEnemyCollision(enemy);
        }
    });

    handleCharacterAndBottles();
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
function checkCollisionsBarrel() {
    resetBarrelCollisionFlags();
    let characterIsCurrentlyOnABarrel = false;

    world.level.barrelArray.forEach((barrel) => {
        handleLateralBarrelCollisions(barrel);
        characterIsCurrentlyOnABarrel = handleVerticalBarrelCollision(barrel) || characterIsCurrentlyOnABarrel;
    });

    updateCharacterGroundLevel(characterIsCurrentlyOnABarrel);
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
function handleLateralBarrelCollisions(barrel) {
    if (world.character.isColliding(barrel)) {
        checkAndSetRightCollision(barrel);
        checkAndSetLeftCollision(barrel);
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
function checkAndSetRightCollision(barrel) {
    if (world.character.x + world.character.width - world.character.offset.right > barrel.x + barrel.offset.left &&
        world.character.x + world.character.offset.left < barrel.x + barrel.offset.left) {
        world.character.canMoveRight = false;
        world.character.barrelRight = true;
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
function checkAndSetLeftCollision(barrel) {
    if (world.character.x + world.character.offset.left < barrel.x + barrel.width - barrel.offset.right &&
        world.character.x + world.character.width - world.character.offset.right > barrel.x + barrel.width - barrel.offset.right) {
        world.character.canMoveLeft = false;
        world.character.barrelLeft = true;
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
function handleVerticalBarrelCollision(barrel) {
    const charBottom = world.character.y + world.character.height - world.character.offset.bottom;
    const barrelTop = barrel.y + barrel.offset.top;
    const isVerticallyAligned = charBottom >= barrelTop - 10 && charBottom <= barrelTop + 10;
    const isHorizontallyOverlapping = world.character.x + world.character.offset.left < barrel.x + barrel.width - barrel.offset.right &&
        world.character.x + world.character.width - world.character.offset.right > barrel.x + barrel.offset.left;

    if (isVerticallyAligned && isHorizontallyOverlapping) {
        world.character.isOnBarrel = true;
        world.character.groundLevel = barrelTop - (world.character.height - world.character.offset.bottom);
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
function updateCharacterGroundLevel(characterIsCurrentlyOnABarrel) {
    if (!characterIsCurrentlyOnABarrel) {
        world.character.isOnBarrel = false;
        world.character.groundLevel = world.character.resetsCharacterToY();
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
function resetBarrelCollisionFlags() {
    world.character.canMoveLeft = true;
    world.character.canMoveRight = true;
    world.character.barrelLeft = false;
    world.character.barrelRight = false;
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
function handleCharacterAndBottles() {
    world.character.bottles.forEach((bottle, bottleIndex) => {
        world.bottleHitSomething = false;
        handleBottleEnemyCollisions(bottle, bottleIndex);
        handleBottleBarrelCollisions(bottle);

        if (world.bottleHitSomething) {
            world.removeBottle(bottleIndex);
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
function handleCharacterEnemyCollision(enemy) {
    if (world.character.isAboveGround() && world.character.speedY < 0 && !enemy.isDead()) {
        handleCharacterJumpAttack(enemy);
    }
    else if (!enemy.isDead()) {
        world.character.hit();
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
function handleCharacterJumpAttack(enemy) {
    if (enemy instanceof Chicken || enemy instanceof Chick) {
        handleChickenJumpDeath(enemy);
    }
    else if (enemy instanceof Endboss) {
        handleEndbossJumpDamage(enemy);
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
function handleChickenJumpDeath(chicken) {
    chicken.energy = 0;
    chicken.isDeadAnimationPlayed = false;
    playEnemyBounceDeadSound();
    world.character.bounce(chicken);
    world.removeEnemyAfterDelay(chicken, 500);
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
function handleEndbossJumpDamage(endboss) {
    world.endboss.takeBounceDamage();
    endboss.isDeadAnimationPlayed = false;
    playBouncingSound();
    world.character.bounce(endboss);
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
function handleBottleEnemyCollisions(bottle) {
    world.level.enemiesArray.forEach((enemy, enemyIndex) => {
        if (bottle.isColliding(enemy) && !enemy.isDead()) {
            world.bottleHitSomething = true;
            handleBottleHitEnemy(enemy, enemyIndex);
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
function handleBottleHitEnemy(enemy, enemyIndex) {
    if (enemy instanceof Chicken || enemy instanceof Chick) {
        handleBottleHitChicken(enemy, enemyIndex);
    }
    else if (enemy instanceof Endboss) {
        handleBottleHitEndboss(enemy, enemyIndex);
        world.bottleHitSomething = true;
    }
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
function handleBottleHitEndboss() {
    world.endboss.hit();
    world.endboss.playAnimation(world.endboss.IMAGES_HURT);
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
function handleBottleHitChicken(chicken, enemyIndex) {
    chicken.energy = 0;
    chicken.isDeadAnimationPlayed = false;
    playChickenDeathSound();
    world.removeEnemyAfterDelay(chicken, 500, enemyIndex);
    world.bottleHitSomething = true;
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
function handleBottleBarrelCollisions(bottle) {
    world.level.barrelArray.forEach((barrel) => {
        if (bottle.isColliding(barrel)) {
            world.bottleHitSomething = true;
        }
    });
}