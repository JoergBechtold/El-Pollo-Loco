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
    hadFirstContact = false;
    endbossMusic = null;
    isEndbossMusicPlaying = false;


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
        this.endbosseMoveAnimation()
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                // Optional: Stoppe die Endboss-Musik, wenn der Boss stirbt
                if (this.isEndbossMusicPlaying && this.endbossMusic) {
                    this.endbossMusic.pause();
                    this.endbossMusic.currentTime = 0;
                    this.isEndbossMusicPlaying = false;
                }
                return;
            }

            // Wenn der Endboss den ersten Kontakt hatte (aktiv ist)
            if (this.hadFirstContact) {
                // Hier kannst du die Animationen für Gehen, Angreifen etc. steuern
                // Je nachdem, ob er sich bewegt oder angreift
                if (this.character && Math.abs(this.character.x - this.x) < 200) { // Beispiel: Wenn nah genug für Attack
                    this.playAnimation(this.IMAGES_ATTACK);
                } else {
                    this.playAnimation(this.IMAGES_WALKING); // Gehe-Animation, wenn er sich bewegt
                }
            } else {
                // Solange kein erster Kontakt, zeige die Alert-Animation
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 150); // Animationsgeschwindigkeit
    }

    endbosseMoveAnimation() {
        setInterval(() => {
            if (this.isDead()) {
                return; // Boss ist tot, keine Bewegung mehr
            }

            // Prüfe, ob der Charakter den Schwellenwert überschritten hat, um den Boss zu aktivieren
            if (this.world && this.world.character && this.world.character.x > 1500 && !this.hadFirstContact) {
                this.hadFirstContact = true; // Boss wurde aktiviert
                this.startEndbossMusic(); // Starte die Boss-Musik
                console.log('Endboss erreicht und aktiviert!');
                // Hier könntest du zusätzlich eine kurze 'Brüll'-Animation abspielen lassen,
                // bevor er anfängt sich zu bewegen.
            }

            // Wenn der Endboss aktiviert wurde, soll er dem Charakter folgen
            if (this.hadFirstContact) {
                if (this.world.character.x < this.x - 50) { // Charakter ist links vom Boss
                    this.moveLeft();
                    this.otherDirection = false; // Boss schaut nach links
                } else if (this.world.character.x > this.x + 50) { // Charakter ist rechts vom Boss
                    this.moveRight();
                    this.otherDirection = true; // Boss schaut nach rechts (spiegeln)
                }
                // Wenn der Charakter sich in einem "toten Bereich" (hier +/- 50px) befindet,
                // bleibt der Boss stehen oder führt eine Attacke aus (Animation in animate()).
            }
        }, 1000 / 60); // Bewegungslogik, sollte schneller laufen für flüssige Bewegung
    }

    startEndbossMusic() {
        if (!isMuted && !this.isEndbossMusicPlaying) {
            this.endbossMusic = new Audio(PATH_ENDBOSS_MUSIC);
            this.endbossMusic.loop = true; // Musik loopen lassen
            this.endbossMusic.volume = 0.5; // Optional: Lautstärke anpassen
            this.endbossMusic.play();
            this.isEndbossMusicPlaying = true;
            console.log('Endboss-Musik gestartet!');

            // Optional: Stoppe hier die normale Hintergrundmusik, wenn vorhanden
            // world.backgroundMusic.pause(); // Annahme: Du hast eine backgroundMusic in der World-Klasse
        }
    }



}