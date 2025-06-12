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
        this.applyGravity();
        this.wasThrown = true; // Markiere, dass die Flasche geworfen wurde.

        // Initialisiere die Intervalle nur, wenn sie nicht bereits laufen
        if (!this.movementInterval && !this.isSplashing) { // Prevent starting if already splashing
            let throwSpeedX = this.otherDirection ? -10 : 10;
            this.movementInterval = setInterval(() => {
                this.x += throwSpeedX;

                if (this.isSplashing || world.bottleHitSomething || this.y >= this.groundLevel) {
                    // This logic is duplicated in startAllIntervals.
                    // It's better to have a single source of truth for collision handling.
                    // For now, let's keep it here, but ideally checkCollisions should handle this.
                    if (!this.isSplashing) { // Prevent multiple calls
                        this.isSplashing = true;
                        this.playBottleSplash();
                        this.stopMovementAndRotationIntervals();
                        // This timeout should remove the bottle from the world.character.bottles array
                        setTimeout(() => {
                            const index = world.character.bottles.indexOf(this);
                            if (index > -1) {
                                world.character.bottles.splice(index, 1);
                            }
                            this.stopAllIntervals(); // Stop gravity and any other intervals
                        }, 500);
                    }
                }
            }, 25);
        }

        if (!this.rotationAnimationInterval && !this.isSplashing) { // Prevent starting if already splashing
            this.rotationAnimationInterval = setInterval(() => {
                this.playAnimation(this.IMAGES_BOTTLES);
            }, 1000 / 25);
        }
    }

    playBottleSplash() {
        if (!this.isSplashing) return; // Stellen Sie sicher, dass dies nur einmal aufgerufen wird, nachdem isSplashing gesetzt wurde.

        bottle_splash.play();
        this.width = this.splashWidth;
        this.height = this.splashHeight;

        // Sicherstellen, dass das alte Rotationsintervall gestoppt ist, bevor das neue startet
        this.stopMovementAndRotationIntervals(); // Stop any ongoing movement/rotation

        // Dieses Intervall wird nur für die Spritz-Animation verwendet
        if (!this.splashAnimationInterval) {
            this.splashAnimationInterval = setInterval(() => {
                this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
                if (this.currentImage % this.IMAGES_BOTTLE_SPLASH.length === 0 && this.currentImage > 0) {
                    clearInterval(this.splashAnimationInterval);
                    this.splashAnimationInterval = null;
                    // At this point, the splash animation is complete.
                    // The bottle removal is handled in the `throw` or `startAllIntervals`
                    // method's collision/ground check.
                }
            }, 1000 / 10);
        }
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

    startAllIntervals() {
        super.startAllIntervals(); // Startet applyGravityInterval wieder (wenn nicht aktiv)

        // Nur starten, wenn die Flasche noch nicht gespritzt ist
        if (!this.isSplashing) {
            // Die Logik aus dem throw() muss hier wiederholt werden, aber nur wenn die Flasche noch in Bewegung war
            // Eine bessere Herangehensweise ist es, den Zustand der Flasche zu speichern (z.B. ob sie geworfen wurde)
            // und basierend darauf die Intervalle neu zu setzen.

            // Problem: Die speedY und throwSpeedX sind schon gesetzt und die Flasche ist in der Luft.
            // Wir müssen die Bewegung und Rotation von dem Punkt an fortsetzen, wo sie gestoppt wurde.
            // Die einfachste Lösung ist, die `throw()`-Methode aufzurufen, aber wir müssen verhindern,
            // dass eine neue "Wurf"-Logik (wie z.B. speedY neu setzen) ausgeführt wird,
            // wenn die Flasche bereits in der Luft war.

            // Um dies zu beheben, müssen wir den "Wurf"-Zustand persistenter machen.
            // Eine einfachere Lösung für jetzt: einfach die Intervalle starten, wenn sie null sind.
            // Da `throw()` die Intervalle setzt, könnten wir `throw()` beim Starten aufrufen,
            // aber nur, wenn die Flasche noch nicht "getroffen" hat.

            // Besser: Separieren der Initialisierung der Intervalle vom Wurf selbst.
            // In diesem Fall, wenn `movementInterval` oder `rotationAnimationInterval` null sind,
            // bedeutet das, sie wurden gestoppt und müssen wieder gestartet werden.
            // Aber die Logik, wann sie stoppen (z.B. bei Kollision oder Bodenkontakt)
            // muss beim Neustart ebenfalls berücksichtigt werden.

            // Da `throw()` bereits die gesamte Logik für Bewegung und Rotation enthält,
            // ist es am besten, einen Weg zu finden, `throw()` erneut aufzurufen,
            // aber nur, um die Intervalle zu initialisieren, nicht um die Flasche neu zu werfen.

            // Ansatz 1: Speichern, ob die Flasche bereits "geworfen" wurde.
            if (this.wasThrown && !this.movementInterval) {
                // Wenn die Flasche geworfen wurde, aber die Bewegung gestoppt ist, starte sie neu
                let throwSpeedX = this.otherDirection ? -10 : 10;
                this.movementInterval = setInterval(() => {
                    this.x += throwSpeedX;
                    // Die Kollisionslogik sollte weiterhin im World-Loop passieren.
                    // Das `isSplashing` wird in `checkCollisions` gesetzt.
                    if (this.isSplashing || this.y >= this.groundLevel) {
                        this.isSplashing = true; // Sicherstellen, dass Spritz-Animation ausgelöst wird
                        this.playBottleSplash(); // Startet die Spritz-Animation
                        this.stopMovementAndRotationIntervals(); // Stopper die Bewegung/Rotation hier
                        setTimeout(() => {
                            const index = world.character.bottles.indexOf(this);
                            if (index > -1) {
                                world.character.bottles.splice(index, 1);
                            }
                            this.stopAllIntervals(); // Auch Gravitation stoppen
                        }, 500);
                    }
                }, 25);
            }

            if (this.wasThrown && !this.rotationAnimationInterval) {
                this.rotationAnimationInterval = setInterval(() => {
                    if (!this.isSplashing) {
                        this.playAnimation(this.IMAGES_BOTTLES);
                    }
                }, 1000 / 25);
            }
        }
    }

    stopMovementAndRotationIntervals() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        if (this.rotationAnimationInterval) {
            clearInterval(this.rotationAnimationInterval);
            this.rotationAnimationInterval = null;
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

