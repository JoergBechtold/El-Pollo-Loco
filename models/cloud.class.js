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

    // stopAllIntervals() {

    //     if (this.animateCloudsIntervall) {
    //         clearInterval(this.animateCloudsIntervall);
    //         this.animateCloudsIntervall = null;
    //     }

    // }

    stopAllIntervals() {
        // No need to call super.stopAllIntervals() here unless MovableObject
        // has intervals that apply to clouds (like gravity), which is unlikely for clouds.
        if (this.animateCloudsIntervall) {
            clearInterval(this.animateCloudsIntervall);
            this.animateCloudsIntervall = null;
        }
    }

    /**
     * Starts all intervals specifically managed by the Cloud class.
     */
    startAllIntervals() {
        // No need to call super.startAllIntervals() here unless MovableObject
        // has intervals that apply to clouds, which is unlikely for clouds.
        this.animateClouds(); // Restart the cloud movement animation
    }

}