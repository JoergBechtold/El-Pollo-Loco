class Barrel extends DrawableObject {
    width = 100
    heigt = 100

    y = 320
    // groundLevel = 320

    offset = {
        top: 7,
        left: 38,
        right: 8,
        bottom: 50
    };

    constructor(path) {
        super().loadImage(path)
        let randomX = 800 + Math.random() * 2400;
        this.x = Math.round(randomX / 150) * 150;



    }


}