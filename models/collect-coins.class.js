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



    constructor(path) {
        super().loadImage(path);

        let randomX = 300 + Math.random() * 2000;
        this.x = Math.round(randomX / 20) * 20;

        let randomY = 110 + Math.random() * 210;
        this.y = Math.round(randomY / 20) * 20;

        this.initialY = this.y;
        this.animateFloating();

    }


    animateFloating() {
        setInterval(() => {
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

}