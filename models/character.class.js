class Character extends MovableObject {
    height = 280;
    width = 150;
    y = 155;
    speed = 10;
    world;
    idleTimeout;
    longIdleInterval;
    longIdleIndex = 0;
    
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
     ];

     IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
     ];

     IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
     ];

     
      
    constructor(){
        // super().loadImage('img/2_character_pepe/2_walk/W-21.png')
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.animate();
        this.resetIdleTimer();
    }

    resetIdleTimer = () => {
        clearTimeout(this.idleTimeout);
        clearInterval(this.longIdleInterval);
        this.longIdleIndex = 0;
        this.idleTimeout = setTimeout(this.playLongIdle.bind(this), 4000);
    };

    playLongIdle = () => {
        this.longIdleInterval = setInterval(() => {
            this.playAnimationOnce(this.IMAGES_LONG_IDLE, this.longIdleIndex);
            this.longIdleIndex = (this.longIdleIndex + 1) % this.IMAGES_LONG_IDLE.length;
        }, 500);
    };

    animate(){

        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){
                this.x += this.speed;
                this.otherDirection = false;
                this.resetIdleTimer();
            }

            if(this.world.keyboard.LEFT && this.x > 0){
                this.x -= this.speed;
                this.otherDirection = true;
                this.resetIdleTimer();
            } else {
                this.resetIdleTimer(); 
            } 

            this.world.camera_x = -this.x + 100;
        },1000 / 60);
       

        setInterval( () => {
           if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
             this.playAnimation(this.IMAGES_WALKING);
           } else {
            this.loadImage(this.IMAGES_IDLE[0])
           }
        },50);
    }

    jump(){

    }
} 