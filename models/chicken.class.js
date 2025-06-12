class Chicken extends MovableObject {
    y = 355;
    character;
    chickenEnergy = 10;
    height = 60;
    width = 80;
    offset = {
        top: -5,
        left: 0,
        right: 0,
        bottom: 0
    };

    chickenAnimationAndMovementInterval;

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.speed = 0.5 + Math.random() * 1;
        let randomX = 500 + Math.random() * 2000;
        this.x = Math.round(randomX / 150) * 150;
        this.animate();
        // this.startAllIntervals();
    }
    animate() {
        // Stellt sicher, dass kein altes Intervall weiterläuft, bevor ein neues gestartet wird
        if (this.chickenAnimationAndMovementInterval) {
            clearInterval(this.chickenAnimationAndMovementInterval);
        }

        this.chickenAnimationAndMovementInterval = setInterval(() => {
            if (this.isDead()) {
                // Wenn das Chicken tot ist, spiele die Todesanimation nur einmal ab
                if (!this.isDeadAnimationPlayed) {
                    this.playAnimation(this.IMAGE_DEAD);
                    this.isDeadAnimationPlayed = true;
                    // Optional: Du könntest hier auch das Intervall komplett stoppen,
                    // wenn das tote Chicken sich nicht mehr bewegen soll:
                    // clearInterval(this.chickenAnimationAndMovementInterval);
                    // this.chickenAnimationAndMovementInterval = null;
                }
            } else {
                // Animationslogik: Wechselt die Bilder für die Lauf-Animation

                this.playAnimation(this.IMAGES_WALKING);


                // this.playAnimation(this.IMAGES_WALKING);

                // Bewegungslogik: Chicken verfolgt den Charakter
                // Wir prüfen, ob ein 'character' zugewiesen wurde, um Fehler zu vermeiden
                if (this.character) {
                    if (this.character.x > this.x + 10) { // Charakter ist rechts vom Chicken
                        this.moveRight();
                        this.otherDirection = true; // Setze die Richtung für gespiegelte Grafiken
                    } else if (this.character.x < this.x - 10) { // Charakter ist links vom Chicken
                        this.moveLeft();
                        this.otherDirection = false; // Setze die Richtung für gespiegelte Grafiken
                    }
                } else {
                    // Standardbewegung, wenn kein Charakter zugewiesen ist (z.B. einfach weiter nach links laufen)
                    this.moveLeft();
                    this.otherDirection = false;
                }
            }
        }, 1000 / 40); // Dieses Intervall läuft ca. 60 Mal pro Sekunde für flüssige Bewegung
    }


    stopAllIntervals() {
        // Zuerst die Intervalle der Elternklasse stoppen (z.B. Gravitation)
        super.stopAllIntervals();

        // Dann das spezifische kombinierte Animations- und Bewegungsintervall des Chickens stoppen
        if (this.chickenAnimationAndMovementInterval) {
            clearInterval(this.chickenAnimationAndMovementInterval);
            this.chickenAnimationAndMovementInterval = null;
        }
    }

    /**
     * Startet alle Intervalle, die von dieser Klasse und der Elternklasse verwaltet werden.
     */
    startAllIntervals() {
        // Nur neu starten, wenn das Chicken nicht tot ist
        if (!this.isDead()) {
            // Startet die Intervalle der Elternklasse (z.B. Gravitation)
            // super.startAllIntervals();

            // Startet das kombinierte Animations- und Bewegungsintervall neu
            // Dies ist ein direkter Aufruf, da 'animate' nun das einzige Intervall ist
            this.animate();
        }
    }
}


// class Chicken extends MovableObject {
//     y = 355;
//     character;
//     chickenEnergy = 10;
//     height = 60;
//     width = 80;
//     offset = {
//         top: -5,
//         left: 0,
//         right: 0,
//         bottom: 0
//     };

//     chickenAnimationInterval;



//     IMAGES_WALKING = [
//         'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
//         'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
//         'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
//     ];

//     IMAGE_DEAD = [
//         'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
//     ];

//     constructor() {
//         super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
//         this.loadImages(this.IMAGES_WALKING);
//         this.loadImages(this.IMAGE_DEAD);
//         this.speed = 0.5 + Math.random() * 1;
//         let randomX = 500 + Math.random() * 2000;
//         this.x = Math.round(randomX / 150) * 150;
//         this.animate();
//     }

//     animate() {
//         this.enemyFollowCharacterAnimation()
//         this.chickenAnimationInterval = setInterval(() => {
//             if (this.isDead()) {
//                 if (!this.isDeadAnimationPlayed) {
//                     this.playAnimation(this.IMAGE_DEAD);
//                     this.isDeadAnimationPlayed = true;
//                 }
//             } else {
//                 this.playAnimation(this.IMAGES_WALKING);
//             }
//         }, 150);
//     }

//     // stopAllIntervals() {
//     //     if (this.chickenAnimationInterval) {
//     //         clearInterval(this.chickenAnimationInterval);
//     //         this.chickAnimationInterval = null;
//     //     }
//     // }

//     stopAllIntervals() {
//         super.stopAllIntervals(); // Call the parent's stopAllIntervals (for gravity, enemyFollowCharacterAnimation)
//         if (this.chickenAnimationInterval) {
//             clearInterval(this.chickenAnimationInterval);
//             this.chickenAnimationInterval = null; // Correctly set to null after clearing
//         }
//     }

//     /**
//      * Starts all intervals managed by the Chicken class and its parent MovableObject.
//      */
//     startAllIntervals() {
//         if (!this.isDead()) { // Only restart if the chicken is not dead
//             super.startAllIntervals(); // Call the parent's startAllIntervals (for gravity, enemyFollowCharacterAnimation)
//             this.animate(); // Restart the chicken's animation loop
//         }
//     }
// }