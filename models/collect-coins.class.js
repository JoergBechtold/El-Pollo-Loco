class CollectCoins extends MovableObject {
    x = 300;
    y = 250;

    offset = {
        top: 52,
        left: 32,
        right: 32,
        bottom: 51
    };

    constructor(path) {
        super().loadImage(path)
        this.x = 300 + Math.random() * 2000;
    }


}