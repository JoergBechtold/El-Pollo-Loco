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
     * Initiates the coin's floating and animation effects.
     * This includes setting up an interval for visual animation and another for vertical floating movement.
     * @memberof Coin // Assuming this is within a Coin class
     */
    animateFloating() {
        this.coinsAnimationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_COINS)
        }, 400);
        this.handleCoinsFloatingInterval()
    }

    /**
     * 
     * Manages the continuous up-and-down floating movement of the coin.
     * The coin moves within a defined `animationRangeY` around its `initialY` position.
     * @memberof Coin
     */
    handleCoinsFloatingInterval() {
        this.coinsFloatingInterval = setInterval(() => {
            if (this.animationDirection === 1) {
                this.y -= this.animationSpeedY;
                if (this.y <= this.initialY - this.animationRangeY) {
                    this.animationDirection = -1;
                }
            } else {
                this.y += this.animationSpeedY;
                if (this.y >= this.initialY + this.animationRangeY) {
                    this.animationDirection = 1;
                }
            }
        }, 1000 / 60);
    }

    /**
     * 
     * Stops all active animation and floating intervals for the coins.
     * Clears and nullifies `coinsAnimationInterval` and `coinsFloatingInterval`.
     * @memberof Coin // Assuming these methods are part of a Coin class
     */
    stopAllIntervals() {
        if (this.coinsAnimationInterval) {
            clearInterval(this.coinsAnimationInterval);
            this.coinsAnimationInterval = null;
        }
        if (this.coinsFloatingInterval) {
            clearInterval(this.coinsFloatingInterval);
            this.coinsFloatingInterval = null;
        }
    }

    /**
     * 
     * Starts all necessary intervals for the coin, including its floating animation.
     * Calls `animateFloating()` to initiate the animation and movement.
     * @memberof Coin // Assuming these methods are part of a Coin class
     */
    startAllIntervals() {
        this.animateFloating();
    }
}