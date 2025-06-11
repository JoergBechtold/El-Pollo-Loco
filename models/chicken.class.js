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
        this.animate(); // Ruft animate auf, das wiederum enemyFollowCharacterAnimation aufruft
    }

    animate() {
        // Dies ist ein Problem: enemyFollowCharacterAnimation sollte nicht bei jedem Aufruf von animate() gestartet werden
        this.enemyFollowCharacterAnimation()
        this.chickenAnimationInterval = setInterval(() => {
            if (this.isDead()) {
                if (!this.isDeadAnimationPlayed) {
                    this.playAnimation(this.IMAGE_DEAD);
                    this.isDeadAnimationPlayed = true;
                }
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }

    stopAllIntervals() {
        super.stopAllIntervals(); // Wichtig, um Intervalle von MovableObject zu stoppen
        if (this.chickenAnimationInterval) {
            clearInterval(this.chickenAnimationInterval);
            this.chickenAnimationInterval = null;
        }
        // Problem: enemyFollowCharacterAnimation wird nicht explizit gestoppt,
        // aber es ist wahrscheinlich ein Intervall in MovableObject, das von super.stopAllIntervals()
        // gestoppt werden sollte.
    }

    startAllIntervals() {
        if (!this.isDead()) {
            super.startAllIntervals(); // Wichtig, um Intervalle von MovableObject neu zu starten
            this.animate(); // Ruft animate() auf, das dann die Intervalle wieder startet
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