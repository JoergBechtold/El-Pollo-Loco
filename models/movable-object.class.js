class MovableObject {
    x = 120;
    y = 250;
    height = 150;
    width = 100;    
    img;
    
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