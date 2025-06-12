class CollectCoins extends MovableObject {
    x = 300;
    y = 250;
    height = 130;
    width = 130;
    initialY;
    animationDirection = 1;
    animationSpeedY = 0.8;
    animationRangeY = 12;
    coinsAnimationInterval;
    coinsFloatingInterval;
    offset = {
        top: 47,
        left: 47,
        right: 48,
        bottom: 47
    };

    IMAGES_COINS = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
    ]

    constructor() {
        super().loadImage('assets/img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COINS);
        let randomX = 300 + Math.random() * 2000;
        this.x = Math.round(randomX / 40) * 40;
        let randomY = 110 + Math.random() * 210;
        this.y = Math.round(randomY / 20) * 20;
        this.initialY = this.y;
        this.animateFloating();
    }

    /**
     * 
     * Starts the continuous leftward movement animation for the clouds.
     * This function ensures only one animation interval is active at a time.
     * @memberof Cloud // Assuming this is within a Cloud class
     */
    animateClouds() {
        if (!this.animateCloudsIntervall) {
            this.animateCloudsIntervall = setInterval(() => {
                this.moveLeft(); // Moves the cloud to the left
            }, 1000 / 60); // Runs at approximately 60 frames per second
        }
    }

    /**
     * 
     * Stops all active animation intervals for the clouds.
     * Specifically clears and nullifies `this.animateCloudsIntervall`.
     * @memberof Cloud
     */
    stopAllIntervals() {
        if (this.animateCloudsIntervall) {
            clearInterval(this.animateCloudsIntervall);
            this.animateCloudsIntervall = null;
        }
    }

    /**
     * 
     * Initiates all necessary intervals for the clouds, primarily their animation.
     * This calls `animateClouds()` to start the movement.
     * @memberof Cloud
     */
    startAllIntervals() {
        this.animateClouds();
    }
}