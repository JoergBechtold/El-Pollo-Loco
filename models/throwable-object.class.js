class ThrowableObject extends MovableObject {
    offset = {
        top: 8,
        left: 15,
        right: 15,
        bottom: 8
    };

    IMAGES_BOTTLES = [
        ''
    ]

    constructor(x, y) {
        super().loadImage('assets/img/6_salsa_bottle/salsa_bottle.png')
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();


    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);


    }
}