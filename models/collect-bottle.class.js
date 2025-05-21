class CollectBottle extends MovableObject {
    x = 300;
    y = 310;


    offset = {
        top: 30,
        left: 30,
        right: 28,
        bottom: 38
    };

    constructor(path) {
        super().loadImage(path)
        this.x = 300 + Math.random() * 2000;
    }


}