class Cloud extends MovableObject {
    // y = 15;
    // x = 10;
    speed = 0.07;
    width = 500;
    height = 400;

    constructor(path, x) {
        super().loadImage(path)
        this.x = x;
        this.y = 10 + Math.random() * 45;
        this.animateClouds();

    }

    animateClouds() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

    }

}