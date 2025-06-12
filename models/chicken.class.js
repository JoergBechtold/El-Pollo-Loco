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

    chickenAnimationInterval;
    chickenMovementInterval;

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

    }
    animate() {
        // --- Animationsintervall (Bildwechsel) ---
        // Stellt sicher, dass kein altes Animationsintervall weiterläuft
        if (this.chickenAnimationInterval) {
            clearInterval(this.chickenAnimationInterval);
        }
        this.chickenAnimationInterval = setInterval(() => {
            if (this.isDead()) {
                if (!this.isDeadAnimationPlayed) {
                    this.playAnimation(this.IMAGE_DEAD);
                    this.isDeadAnimationPlayed = true;
                    // Optional: Stoppe die Animation, wenn die Todesanimation einmal durch ist
                    // clearInterval(this.chickenAnimationInterval);
                    // this.chickenAnimationInterval = null;
                }
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150); // Animationsgeschwindigkeit: 150ms pro Bild, wie bei Chick

        // --- Bewegungsintervall (Verfolgung des Charakters) ---
        // Stellt sicher, dass kein altes Bewegungsintervall weiterläuft
        if (this.chickenMovementInterval) {
            clearInterval(this.chickenMovementInterval);
        }
        this.chickenMovementInterval = setInterval(() => {
            if (!this.isDead()) { // Bewege dich nur, wenn das Chicken nicht tot ist
                // Hier kommt die Logik zum Verfolgen des Charakters
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
        }, 1000 / 60); // Bewegungsgeschwindigkeit: ca. 60 FPS für flüssige Bewegung
    }


    stopAllIntervals() {
        super.stopAllIntervals(); // Ruft stopAllIntervals von MovableObject auf (stoppt z.B. Gravitation)

        // Stoppt die Chicken-spezifischen Intervalle
        if (this.chickenAnimationInterval) {
            clearInterval(this.chickenAnimationInterval);
            this.chickenAnimationInterval = null;
        }
        if (this.chickenMovementInterval) {
            clearInterval(this.chickenMovementInterval);
            this.chickenMovementInterval = null;
        }
    }

    /**
     * Startet alle Intervalle, die von dieser Klasse und der Elternklasse verwaltet werden.
     */
    startAllIntervals() {
        if (!this.isDead()) { // Nur neu starten, wenn das Chicken nicht tot ist
            // Startet Intervalle der Elternklasse (z.B. Gravitation)

            // Startet die Chicken-spezifischen Animations- und Bewegungsintervalle neu
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