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

    /**
     * 
    * Draws a speech bubble image on the canvas.
    * This method retrieves the image from the `imageCache` using the provided `imagePath`
    * and draws it at a calculated position relative to the object's current coordinates.
    *
    * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
    * @param {string} imagePath - The path to the speech bubble image. This path should correspond to a key in the `imageCache`.
    */
    drawSpeechBubbleImage(ctx, imagePath) {
        let speechBubbleImg = this.imageCache[imagePath];
        if (speechBubbleImg) {
            const bubbleWidth = 200;
            const bubbleHeight = 175;
            const bubbleX = this.x + 80;
            const bubbleY = this.y - 10;
            ctx.drawImage(speechBubbleImg, bubbleX, bubbleY, bubbleWidth, bubbleHeight);
        }
    }

    // drawRedFrame(ctx) {
    //     if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObject || this instanceof Chick || this instanceof Barrel) {
    //         ctx.beginPath();
    //         ctx.lineWidth = '4';
    //         ctx.strokeStyle = 'red';
    //         ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - (this.offset.left + this.offset.right), this.height - (this.offset.top + this.offset.bottom));
    //         ctx.stroke();
    //     }
    // }

    /**
    * Loads a single image into the `img` property of this object.
    * This is typically used to set the initial image for the object.
    *
    * @param {string} path - The file path to the image (e.g., 'assets/img/my-image.png').
    */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
    * Loads an array of images and stores them in the `imageCache` for later use.
    * This is useful for pre-loading all animation frames or different object states
    * to prevent flickering during gameplay. Each image is keyed by its file path.
    *
    * @param {string[]} array - An array of image file paths.
    */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
    * Draws the current image of the object onto the canvas.
    * The image drawn is the one currently assigned to `this.img`,
    * at the object's `x` and `y` coordinates, and with its `width` and `height`.
    *
    * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
    */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}