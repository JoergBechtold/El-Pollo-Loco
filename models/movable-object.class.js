class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 150;
    width = 100;    
    loadeImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log('Moving Right');
        
    }

    moveLeft(){

        
    }
}