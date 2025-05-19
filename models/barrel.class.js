class Barrel extends DrawableObject {
    // width = 80
    // heigt = 30
    x = 20
    y = 275

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    constructor(path) {
        super().loadImage(path)
        this.x = 20 + Math.random() * 2000;



    }


}