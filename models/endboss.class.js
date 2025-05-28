class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    speed = 2;
    offset = {
        top: 70,
        left: 0,
        right: 0,
        bottom: 0
    };
    character;


    IMAGES_WALKING = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png',

    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;
        this.animate();
    }

    animate() {
        // this.enemyFollowCharacterAnimation()

        setInterval(() => {
            this.playAnimation(this.IMAGES_ALERT);
        }, 150);
    }

    endbosseMoveAnimation() {
        setInterval(() => {
            if (this.isDead()) {
                return; // Wenn der Boss tot ist, stoppe alle weiteren Bewegungen/Logik
            }

            // Sicherstellen, dass die World- und Character-Referenzen vorhanden sind
            if (this.world && this.world.character) {
                // Logik für die AKTIVIERUNG des Bosses:
                // Diese Bedingung wird nur einmal wahr, wenn der Charakter den Bereich betritt
                // UND der Boss noch nicht aktiviert wurde (dank !this.hadFirstContact).
                if (this.world.character.x > 1500 && !this.hadFirstContact) {
                    this.hadFirstContact = true; // Setze die Flagge, damit diese Logik nur einmal läuft

                    // Spielt die Endboss-Musik nur einmal ab

                    if (!isMuted) { // <-- NEU: Hier wird geprüft, ob der Ton stummgeschaltet ist
                        let endbossMusic = new Audio(PATH_ENDBOSS_MUSIC); // <-- NEU: Hier wird ein NEUES Audio-Objekt erstellt
                        this.endbossMusicStarted = true; // <-- Diese Variable wird gesetzt, aber nicht wirklich verwendet, um die Musik abzuspielen

                        // endbossMusic.volume = endboss_music_volume; // <-- Auskommentiert
                        endbossMusic.play(); // <-- Hier wird die Musik abgespielt

                        setTimeout(() => { // <-- Problem: Nach 0.5 Sekunden wird die Musik wieder pausiert!
                            endbossMusic.pause();
                            endbossMusic.currentTime = 0;
                        }, 500);
                    }






                    this.playAnimation(this.IMAGES_ALERT);
                    console.log('Endboss erreicht und aktiviert!');
                }


                if (this.hadFirstContact) {
                    // this.speed = 5; // Beispiel: Boss wird schneller (kann hier angepasst werden)

                    if (this.world.character.x < this.x - 50) {
                        this.moveLeft();
                        this.otherDirection = false;
                    } else if (this.world.character.x > this.x + 50) {
                        this.moveRight();
                        this.otherDirection = true;
                    }

                    else {

                    }
                }
            }
        }, 1000 / 60);
    }



}