
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    lastHit = 0;
    groundLevel;
    isDeadAnimationPlayed = false;
    isImmune = false;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    gravityInterval;

    constructor() {
        super();
    }

    /**
    * 
    * Continuously updates the character's ground level based on its environment.
    *
    * This method sets up an interval to dynamically adjust `this.groundLevel`.
    * If the object is the `Character` and `this.isOnBarrel` is true, it sets
    * a specific ground level for barrels; otherwise, it sets the standard ground level.
    * This function manages the *target ground level* but doesn't directly
    * apply downward gravitational force.
    *
    * @memberof YourClassName // E.g., MovableObject, Character
    */
    applyGravity() {
        if (this.gravityInterval) clearInterval(this.gravityInterval);

        this.gravityInterval = setInterval(() => {
            if (this instanceof Character && this.isOnBarrel) {
                this.setGroundLevelCharacterIsOnBarrel()
            } else {
                this.setGroundLevelCharacterOnGroundLevel()
            }
        }, 1000 / 35);
    }

    /**
     * 
     * Adjusts the character's vertical position and speed when it's on a barrel.
     *
     * This method simulates landing by snapping the character to `this.groundLevel`
     * and stopping vertical movement if it reaches or passes the ground while moving down.
     * Otherwise, it applies gravitational effects by updating `this.y` and `this.speedY`.
     *
     * @memberof Character
     */
    setGroundLevelCharacterIsOnBarrel() {
        if (this.y >= this.groundLevel && this.speedY <= 0) {
            this.y = this.groundLevel;
            this.speedY = 0;
        } else {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }

    /**
    * 
    * Manages the character's vertical movement when it's on the standard ground.
    *
    * If the character is in the air or moving upwards, this applies gravity.
    * Otherwise, it snaps the character to `this.groundLevel` and stops vertical movement.
    *
    * @memberof Character
    */
    setGroundLevelCharacterOnGroundLevel() {
        if (this.y < this.groundLevel || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.y = this.groundLevel;
            this.speedY = 0;
        }
    }

    /**
    * 
    * Checks if the object is currently positioned above its designated ground level.
    *
    * @returns {boolean} True if the object's vertical position (`y`) is less than `this.groundLevel`, indicating it's in the air.
    * @memberof MovableObject // Or the specific class this method belongs to
    */
    isAboveGround() {
        return this.y < this.groundLevel;
    }

    /**
    * 
    * Processes a hit on the object, applying damage if not immune.
    *
    * If the object is immune, the function exits. Otherwise, it delegates
    * damage handling to `handleHitForCharacter()` or `handleHitForEndboss()`
    * based on the instance type, then updates the `lastHit` timestamp.
    *
    * @memberof MovableObject
    */
    hit() {
        if (this.isImmune) return;
        if (this instanceof Character) {
            this.handleHitForCharacter()
        } else if (this instanceof Endboss) {
            this.handleHitForEndboss()
        }
        this.lastHit = new Date().getTime();
    }

    /**
    * 
    * Reduces the character's energy by 5 upon being hit.
    * Ensures character energy does not fall below zero.
    * @memberof Character
    */
    handleHitForCharacter() {
        this.characterEnergy -= 5;
        if (this.characterEnergy < 0) {
            this.characterEnergy = 0;
        }
    }

    /**
    * 
    * Reduces the end boss's energy by 25 upon being hit.
    * Ensures the end boss's energy does not fall below zero.
    * @memberof Endboss
    */
    handleHitForEndboss() {
        this.endbossEnergy -= 25;
        if (this.endbossEnergy < 0) {
            this.endbossEnergy = 0;
        }
    }

    /**
    * 
    * Applies 15 points of "bounce" damage to the end boss if not immune.
    *
    * This method is likely called when the end boss takes damage from a specific interaction
    * (e.g., being jumped on). It checks for immunity, reduces `endbossEnergy` by 15,
    * ensures energy doesn't fall below zero, and updates the `lastHit` timestamp.
    *
    * @memberof Endboss
    */
    takeBounceDamage() {
        if (this.isImmune) {
            return;
        }
        this.endbossEnergy -= 15;
        if (this.endbossEnergy < 0) {
            this.endbossEnergy = 0;
        }
        this.lastHit = new Date().getTime();
    }

    /**
     * 
     * Checks if the object has been hit recently (within 0.4 seconds).
     * @returns {boolean} True if less than 0.4 seconds have passed since `lastHit`.
     * @memberof MovableObject
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.4;
    }

    /**
     * 
     * Checks if the object is dead (its energy is zero).
     * Returns false if the object is immune. Handles different energy properties for specific types.
     * @returns {boolean} True if the object's relevant energy property is 0.
     * @memberof MovableObject
     */
    isDead() {
        if (this.isImmune) return false; // Immune objects cannot be "dead" this way
        if (this instanceof Endboss) return this.endbossEnergy == 0;
        if (this instanceof Character) return this.characterEnergy == 0;
        return this.energy == 0; // Default energy check
    }

    /**
     * 
     * Checks for a collision between this object and another movable object.
     * This method uses detailed offset properties for more precise collision detection.
     * @param {MovableObject} movableObject - The other object to check for collision against.
     * @returns {boolean} True if the two objects are currently overlapping based on their adjusted bounding boxes.
     * @memberof MovableObject
     */
    isColliding(movableObject) {
        return this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
            this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
            this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
            this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom;
    }

    /**
     * 
     * Moves the object to the right by its `speed` value.
     * @memberof MovableObject
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * 
     * Moves the object to the left by its `speed` value.
     * @memberof MovableObject
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * 
     * Advances the object's animation by displaying the next image in the provided array.
     * The animation loops through the `images` array.
     * @param {string[]} images - An array of image paths for the animation frames.
     * @memberof MovableObject
     */
    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * 
     * Sets the object's vertical speed for a jump.
     * @memberof MovableObject
     */
    jump() {
        this.speedY = 26;
    }

    /**
     * 
     * Sets a random vertical speed for a "chick" jump (e.g., enemy jump).
     * @memberof Enemy // Or the specific class this applies to, e.g., Chick
     */
    chickJump() {
        this.speedY = 10 + Math.random() * 20;
    }

    /**
     * 
     * Handles the "bounce" interaction, typically when one object jumps on another.
     * Makes the object temporarily immune and causes it to bounce upwards.
     * @param {MovableObject} enemy - The enemy object that was bounced on.
     * @memberof MovableObject
     */
    bounce(enemy) {
        this.isImmune = true; // Grant temporary immunity
        this.speedY = 17; // Apply upward bounce speed

        // Adjust vertical position to be on top of the enemy
        this.y = enemy.y - this.height + enemy.offset.top;

        // Remove immunity after a short duration
        setTimeout(() => {
            this.isImmune = false;
        }, 200);
    }

    /**
     * 
     * Stops all active intervals managed by this object.
     * Specifically clears and nullifies `this.gravityInterval`.
     * @memberof MovableObject
     */
    stopAllIntervals() {
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }
    }

    /**
     * 
     * Starts all necessary intervals for the object, such as gravity application.
     * Ensures the gravity interval is only started if not already running.
     * @memberof MovableObject
     */
    startAllIntervals() {
        if (!this.gravityInterval) {
            this.applyGravity(); // Assumes applyGravity() sets up its own interval
        }
    }
}