class BackgroundObject extends MovableObject{
width = 720;
height = 480;

    constructor(imagePath, x){
     super().loadeImage(imagePath);
     this.x = x;
     this.y = 480 - this.height;
    }
}