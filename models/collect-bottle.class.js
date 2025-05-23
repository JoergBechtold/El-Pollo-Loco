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
        let randomX = 300 + Math.random() * 2000;
        this.x = Math.round(randomX / 150) * 150;
    }


}