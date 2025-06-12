class Cloud extends MovableObject {
    speed = 0.07;
    width = 500;
    height = 400;
    animateCloudsIntervall;
    world;

    constructor(path, x) {
        super().loadImage(path)
        this.x = x;
        this.y = 10 + Math.random() * 35;
        this.animateClouds();

    }

    animateClouds() {
        this.animateCloudsIntervall = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

    }

    stopAllIntervals() {
        if (this.animateCloudsIntervall) {
            clearInterval(this.animateCloudsIntervall);
            this.animateCloudsIntervall = null;
        }
    }


    startAllIntervals() {
        this.animateClouds();
    }

}