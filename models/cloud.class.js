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
        // Füge diese Bedingung hinzu: Starte das Intervall nur, wenn es noch nicht läuft
        if (!this.animateCloudsIntervall) {
            this.animateCloudsIntervall = setInterval(() => {
                this.moveLeft();
            }, 1000 / 60);
        }
    }

    stopAllIntervals() {
        if (this.animateCloudsIntervall) {
            clearInterval(this.animateCloudsIntervall);
            this.animateCloudsIntervall = null; // Setze es auf null, damit animateClouds() es neu starten kann
        }
        // Wenn MovableObject auch Intervalle hat, solltest du super.stopAllIntervals() aufrufen
        // super.stopAllIntervals();
    }

    startAllIntervals() {
        // Rufe animateClouds auf, das jetzt prüft, ob ein Intervall schon läuft
        this.animateClouds();
        // Wenn MovableObject auch Intervalle hat, solltest du super.startAllIntervals() aufrufen
        // super.startAllIntervals();
    }

    // animateClouds() {
    //     this.animateCloudsIntervall = setInterval(() => {
    //         this.moveLeft();
    //     }, 1000 / 60);

    // }

    // stopAllIntervals() {
    //     if (this.animateCloudsIntervall) {
    //         clearInterval(this.animateCloudsIntervall);
    //         this.animateCloudsIntervall = null;
    //     }
    // }


    // startAllIntervals() {
    //     this.animateClouds();
    // }

}