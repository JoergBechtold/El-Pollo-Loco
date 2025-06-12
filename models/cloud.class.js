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