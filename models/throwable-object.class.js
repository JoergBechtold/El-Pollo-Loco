class ThrowableObject extends MovableObject {
    offset = {
        top: 8,
        left: 15,
        right: 15,
        bottom: 8
    };
    groundLevel = 351
    isSplashing = false;
    world;

    movementInterval;
    rotationAnimationInterval; // Umbenannt, um klarer zu sein
    splashAnimationInterval;



    IMAGES_BOTTLES = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]

    IMAGES_BOTTLE_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]


    constructor(x, y, otherDirection) {
        super().loadImage('assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_BOTTLES);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 60;
        this.otherDirection = otherDirection;
        this.splashWidth = 80;
        this.splashHeight = 80;
        this.throw();
    }




    // throw() {
    //     this.speedY = 30;
    //     this.applyGravity();
    //     let throwSpeedX = this.otherDirection ? -10 : 10;
    //     let movementInterval = setInterval(() => {
    //         this.x += throwSpeedX;
    //         if (world.bottleHitSomething) {
    //             // debugger
    //             clearInterval(movementInterval);
    //             // setTimeout(() => {
    //             //     world.character.bottles.splice(0, 1);
    //             // }, 50);
    //             // world.character.bottles.splice(0, 1);




    //             clearInterval(this.animationInterval);
    //             this.playBottleSplash();




    //             console.log('etwas getroffen');

    //             // clearInterval(movementInterval);
    //             // setTimeout(() => {
    //             //     world.character.bottles.splice(0, 1);
    //             // }, 400);

    //             // if (this.y >= this.groundLevel) {
    //             //     this.playBottleSplash();
    //             //     clearInterval(this.animationInterval);
    //             // }
    //             return
    //         }



    //         if (this.y >= this.groundLevel) {
    //             clearInterval(movementInterval);
    //             setTimeout(() => {
    //                 world.character.bottles.splice(0, 1);
    //             }, 400);

    //             if (this.y >= this.groundLevel) {
    //                 // debugger
    //                 this.playBottleSplash();
    //                 clearInterval(this.animationInterval);
    //             }
    //         }
    //     }, 25);

    //     this.animationInterval = setInterval(() => {
    //         this.playAnimation(this.IMAGES_BOTTLES);
    //     }, 1000 / 25);
    // }

    // playBottleSplash() {
    //     bottle_splash.play();
    //     this.width = this.splashWidth;
    //     this.height = this.splashHeight;
    //     setInterval(() => {
    //         this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    //     }, 1000 / 10);
    // }

    throw() {
        this.speedY = 30;
        this.applyGravity(); // Gravitation wird in MovableObject verwaltet und startet dort ein Intervall

        let throwSpeedX = this.otherDirection ? -10 : 10;
        this.movementInterval = setInterval(() => { // Speichere das Intervall in einer Klassenvariable
            this.x += throwSpeedX;

            if (this.isSplashing) { // Wenn die Spritz-Animation aktiv ist, stoppe die Bewegung und Rotation
                clearInterval(this.movementInterval);
                this.movementInterval = null;
                clearInterval(this.rotationAnimationInterval);
                this.rotationAnimationInterval = null;
                return;
            }

            // Bedingung für Treffer oder Bodenkontakt
            if (world.bottleHitSomething || this.y >= this.groundLevel) {
                // Setze 'isSplashing' hier, um die Spritz-Animation auszulösen
                this.isSplashing = true;
                this.playBottleSplash(); // Startet die Spritz-Animation und ein neues Intervall
                // world.bottleHitSomething sollte danach zurückgesetzt werden, um nicht alle Flaschen zu beeinflussen
                // Hier solltest du überlegen, wie world.bottleHitSomething gesetzt und zurückgesetzt wird.
                // Ideal wäre es, wenn diese Klasse selbst entscheidet, wann sie aufhört.
                // Zum Beispiel: wenn die Flasche den Boden berührt ODER ein Objekt trifft.
                // Nach dem Aufruf von playBottleSplash() und dem Start der Spritz-Animation sollte sich die Flasche selbst entfernen.

                // Intervalle sofort stoppen, wenn ein Ereignis eintritt
                clearInterval(this.movementInterval);
                this.movementInterval = null;
                clearInterval(this.rotationAnimationInterval);
                this.rotationAnimationInterval = null;

                // Beispiel für Entfernung nach der Spritz-Animation
                setTimeout(() => {
                    // Logik zum Entfernen der Flasche aus dem `world.character.bottles`-Array
                    // Dies sollte über die `World`-Klasse oder eine zentrale Spielverwaltung geschehen.
                    // Beispiel: world.removeThrowableObject(this);
                    const index = world.character.bottles.indexOf(this);
                    if (index > -1) {
                        world.character.bottles.splice(index, 1);
                    }
                    this.stopAllIntervals(); // Wichtig: Auch die Gravitation stoppen
                }, 500); // Verzögerung, damit die Spritz-Animation sichtbar ist
            }
        }, 25);

        this.rotationAnimationInterval = setInterval(() => { // Speichere das Intervall
            if (!this.isSplashing) { // Nur rotieren, wenn sie nicht spritzt
                this.playAnimation(this.IMAGES_BOTTLES);
            }
        }, 1000 / 25);
    }

    playBottleSplash() {
        if (!this.isSplashing) return; // Stelle sicher, dass dies nur einmal aufgerufen wird

        bottle_splash.play();
        this.width = this.splashWidth;
        this.height = this.splashHeight;

        // Sicherstellen, dass das alte Rotationsintervall gestoppt ist, bevor das neue startet
        if (this.rotationAnimationInterval) {
            clearInterval(this.rotationAnimationInterval);
            this.rotationAnimationInterval = null;
        }

        // Dieses Intervall wird nur für die Spritz-Animation verwendet
        this.splashAnimationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
            // Optional: Stoppe die Animation, nachdem sie einmal komplett abgespielt wurde
            if (this.currentImage % this.IMAGES_BOTTLE_SPLASH.length === 0 && this.currentImage > 0) {
                clearInterval(this.splashAnimationInterval);
                this.splashAnimationInterval = null;
                // Hier könnte man auch das Objekt komplett aus dem Spiel entfernen, wenn die Animation beendet ist.
            }
        }, 1000 / 10);
    }

    stopAllIntervals() {
        super.stopAllIntervals(); // Stoppt applyGravityInterval
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        if (this.rotationAnimationInterval) {
            clearInterval(this.rotationAnimationInterval);
            this.rotationAnimationInterval = null;
        }
        if (this.splashAnimationInterval) {
            clearInterval(this.splashAnimationInterval);
            this.splashAnimationInterval = null;
        }
    }

    // stopAllIntervals() {
    //     super.stopAllIntervals(); // Stoppt applyGravityInterval

    //     if (this.movementInterval) {
    //         clearInterval(this.movementInterval);
    //         this.movementInterval = null;
    //     }
    //     if (this.rotationAnimationInterval) {
    //         clearInterval(this.rotationAnimationInterval);
    //         this.rotationAnimationInterval = null;
    //     }
    //     if (this.splashAnimationInterval) {
    //         clearInterval(this.splashAnimationInterval);
    //         this.splashAnimationInterval = null;
    //     }
    // }
}

