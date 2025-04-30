class Cloud extends MovableObject{
    y = 20;
    width = 500;
    height = 400;
    
    constructor(){
        super().loadeImage('img/5_background/layers/4_clouds/1.png')
        this.x = Math.random() * 500;
    }
}