class StatusBar extends MovableObject {
    x = 40;
    y;
    width = 200;
    height = 60;
    statusBarType;
    percentage = 0;

    IMAGES_HEALTH = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    IMAGES_COINS = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    IMAGES_BOTTLE = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ];

    IMAGES_ENDBOSS = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ]

    constructor(statusBarType) {
        super();
        this.statusBarType = statusBarType;
        this.loadImages(this.getImageArray());
        this.setPositionByType();
        this.setHealthBarPercentage();
    }

    /**
    * 
    * Initializes the percentage for 'health' and 'endboss' status bars to 100%,
    * and other types to 0%.
    *
    * This method acts as a default setup for the initial display of status bars.
    * It calls `setPercentage()` to update the bar's visual state based on its `statusBarType`:
    * - If `statusBarType` is 'health' or 'endboss', the percentage is set to 100% (full).
    * - For any other `statusBarType`, the percentage is set to 0%.
    *
    * @memberof StatusBar // Or whatever your class name is
    */
    setHealthBarPercentage() {
        if (this.statusBarType === 'health') {
            this.setPercentage(100);
        } else if (this.statusBarType === 'endboss') {
            this.setPercentage(100);
        } else {
            this.setPercentage(0);
        }
    }

    /**
    * 
    * Sets the status bar's vertical (and sometimes horizontal) position based on its type.
    *
    * This method assigns `this.y` (and potentially `this.x`) coordinates to position the
    * status bar correctly on the screen, depending on the value of `this.statusBarType`.
    * It's crucial for arranging different status elements (e.g., health, coins) without overlap.
    *
    * - 'health': y = 0
    * - 'coins': y = 50
    * - 'bottle': y = 100
    * - 'endboss': y = 8, x = 480 (positioned specifically for an end boss health bar)
    *
    * @memberof StatusBar // Or whatever your class name is (e.g., GameUI, DisplayElement)
    */
    setPositionByType() {
        if (this.statusBarType === 'health') {
            this.y = 0;
        } else if (this.statusBarType === 'coins') {
            this.y = 50;
        } else if (this.statusBarType === 'bottle') {
            this.y = 100;
        } else if (this.statusBarType === 'endboss') {
            this.y = 8;
            this.x = 480;
        }
    }

    /**
    * 
    * Returns the appropriate image array for the status bar's current type.
    *
    * This helper method dynamically provides the correct set of image paths
    * (e.g., for different health levels, coin counts, or bottle amounts)
    * based on `this.statusBarType`. This allows the `setPercentage` (or similar)
    * method to correctly display the visual state.
    *
    * - 'health': Returns `this.IMAGES_HEALTH`
    * - 'coins': Returns `this.IMAGES_COINS`
    * - 'bottle': Returns `this.IMAGES_BOTTLE`
    * - 'endboss': Returns `this.IMAGES_ENDBOSS`
    *
    * @returns {string[]} An array of image paths relevant to the status bar's type.
    * @memberof StatusBar // Or whatever your class name is
    */
    getImageArray() {
        if (this.statusBarType === 'health') {
            return this.IMAGES_HEALTH;
        } else if (this.statusBarType === 'coins') {
            return this.IMAGES_COINS;
        } else if (this.statusBarType === 'bottle') {
            return this.IMAGES_BOTTLE;
        } else if (this.statusBarType === 'endboss') {
            return this.IMAGES_ENDBOSS;
        }
    }

    /**
    * 
    * Updates the object's visual representation based on a given percentage.
    *
    * This method sets the internal `percentage` property, then determines
    * the correct image to display by calling `resolveImageIndex()`. It retrieves
    * the corresponding image path from `getImageArray()` and updates the
    * object's current image (`this.img`) using the `imageCache`.
    *
    * @param {number} percentage - The percentage value (0-100) that determines the image to display.
    * @memberof YourClassName // Replace 'YourClassName' with the actual class name (e.g., StatusBar, HealthBar)
    */
    setPercentage(percentage) {
        this.percentage = percentage;
        const imageArray = this.getImageArray();
        let path = imageArray[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
    * 
    * Resolves the appropriate image array index based on the current percentage value.
    *
    * This private helper method maps a percentage range to a specific index in an image array.
    * It's typically used to control visual states like health levels, bottle fullness, etc.
    *
    * - 100% maps to index 5
    * - 80% or higher maps to index 4
    * - 60% or higher maps to index 3
    * - 40% or higher maps to index 2
    * - 20% or higher maps to index 1
    * - Less than 20% maps to index 0
    *
    * @returns {number} The image array index corresponding to the current `this.percentage`.
    * @private
    * @memberof YourClassName // Replace 'YourClassName' with the actual class name
    */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}