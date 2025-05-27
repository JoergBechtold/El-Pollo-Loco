class Barrel extends DrawableObject {
    width = 100
    heigt = 100

    y = 320

    offset = {
        top: 0,
        left: 15,
        right: -15,
        bottom: 50
    };

    constructor(path) {
        super().loadImage(path)
        // this.x = 200 + Math.random() * 2400;
        let randomX = 800 + Math.random() * 2400;
        this.x = Math.round(randomX / 150) * 150;



    }


}