class CollectCoins extends MovableObject {
    x = 300;
    y = 250;
    height = 130;
    width = 130;
    initialY;
    animationDirection = 1;
    animationSpeedY = 0.8;
    animationRangeY = 12;

    offset = {
        top: 47,
        left: 47,
        right: 48,
        bottom: 47
    };

    coinsAnimationInterval;
    coinsFloatingInterval;

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


    animateFloating() {
        this.coinsAnimationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_COINS)
        }, 400);

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


    startAllIntervals() {
        this.animateFloating();
    }



}