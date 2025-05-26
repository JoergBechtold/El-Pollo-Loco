class DrawableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    constructor() {

    }





    drawSpeechBubbleImage(ctx, imagePath) {
        let speechBubbleImg = this.imageCache[imagePath];
        if (speechBubbleImg) {
            const bubbleWidth = 200;
            const bubbleHeight = 175;
            const bubbleX = this.x + 80;
            const bubbleY = this.y - 10;
            ctx.drawImage(speechBubbleImg, bubbleX, bubbleY, bubbleWidth, bubbleHeight);
            console.log('bla');

        }
    }

    drawRedFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObject || this instanceof CollectBottle || this instanceof CollectCoins || this instanceof Chick) {
            ctx.beginPath();
            ctx.lineWidth = '4';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - (this.offset.left + this.offset.right), this.height - (this.offset.top + this.offset.bottom));
            ctx.stroke();
        }
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }







}