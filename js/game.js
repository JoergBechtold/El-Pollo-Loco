let canvas;
let world;
let keyboard = new Keyboard();
let isGamePaused = false;

const PATH_COLLECT_BOTTLE_AUDIO = 'assets/audio/collect-bottle.mp3';
const PATH_COLLECT_COIN_AUDIO = 'assets/audio/collect-coin.mp3';
const PATH_BOUNCING_AUDIO = 'assets/audio/bouncing.mp3';
const PATH_CHICKEN_DEATH_AUDIO = 'assets/audio/chicken-dead.mp3';


let walkin_sound = new Audio('assets/audio/running.mp3');
let game_music = new Audio('assets/audio/game-music1.mp3');
let snoring_audio = new Audio('assets/audio/snoring.mp3');
let death_sound = new Audio('assets/audio/death.mp3');
let jump_sound = new Audio('assets/audio/jump.ogg');
let hurt_sound = new Audio('assets/audio/hurt.mp3');
let bottle_splash = new Audio('assets/audio/bottle-break.mp3');
let endboss_music = new Audio('assets/audio/endboss-music.mp3');
let endboss_sound = new Audio('assets/audio/endboss-chicken.mp3');
let endboss_hurt = new Audio('assets/audio/hurt-endboss.mp3');
let endboss_death = new Audio('assets/audio/endboss-death.mp3');
let endboss_alert = new Audio('assets/audio/endboss_alert.mp3');



const allAudioArray = [
    walkin_sound,
    game_music,
    death_sound,
    jump_sound,
    hurt_sound,
    bottle_splash,
    snoring_audio,
    endboss_music,
    endboss_sound,
    endboss_hurt,
    endboss_death,
    endboss_alert
];


//volume setting
let game_music_volume_silence = 0.03;
let game_music_volume_loude = 0.1;
let bouncing_audio_volume = 0.5;
let collect_bottle_audio_volume = 1;
let collect_coin_audio_volume = 0.7;
let chicken_death_audio_volume = 1;
let snoring_audio_volume = 1;
let endboss_sound_volume = 0.5;
let death_sound_volume = 0.3;
let endboss_death_volume = 0.5;
let bottle_splash_volume = 0.5;

function toggleGamePause() {
    if (!world) {
        console.warn('World-Instanz ist nicht verfügbar.');
        return;
    }

    isGamePaused = !isGamePaused; // Zustand umkehren (true wird false, false wird true)
    updatePauseButtonText(); // Button-Text aktualisieren

    if (isGamePaused) {
        // Spiel pausieren
        if (world.character) {
            world.character.stopAllIntervals();
        }
        // Alle Sounds pausieren
        allAudioArray.forEach(audio => {
            audio.pause();
        });
        console.log('Spiel pausiert.');
    } else {
        // Spiel fortsetzen
        if (world.character) {
            // Um die Intervalle neu zu starten, musst du die animate() Methode erneut aufrufen.
            // Stelle sicher, dass animate() die Intervalle nur einmal erstellt oder bestehende cleared.
            // Hier gehen wir davon aus, dass animate() die Intervalle korrekt startet.
            world.character.animate(); // Startet die Charakter-Intervalle neu
        }

        // Relevante Sounds fortsetzen (oder neu starten, je nach Logik)
        // Hier müsstest du überlegen, welche Sounds wieder laufen sollen.
        // Die Hintergrundmusik sollte wahrscheinlich wieder spielen.
        game_music.play();
        game_music.volume = game_music_volume_loude; // Standardlautstärke wiederherstellen

        // Falls andere Objekte eigene Intervalle haben (z.B. Gegner), müssen diese ebenfalls neu gestartet werden.
        // Das hängt von deiner Implementierung ab. Beispiel:
        // world.level.enemies.forEach(enemy => enemy.animate());

        console.log('Spiel fortgesetzt.');
    }
}

/**
 * Aktualisiert den Text des Pause-Buttons basierend auf dem isGamePaused-Zustand.
 */
function updatePauseButtonText() {
    const pauseButton = document.querySelector('.play-nav button'); // Selektiert den Button
    if (pauseButton) {
        if (isGamePaused) {
            pauseButton.textContent = 'Fortsetzen';
        } else {
            pauseButton.textContent = 'Pause';
        }
    }
}





// /**
//  *
//  * @listens keydown
//  * Listens for the 'keydown' event on the window and updates the 'keyboard' state
//  * based on the pressed key.
//  * @param {KeyboardEvent} event - The keyboard event object.
//  */
// window.addEventListener('keydown', (event) => {
//     if (event.keyCode == 32) {
//         keyboard.SPACE = true;
//     }

//     if (event.keyCode == 37) {
//         keyboard.LEFT = true;
//     }

//     if (event.keyCode == 38) {
//         keyboard.UP = true;
//     }

//     if (event.keyCode == 39) {
//         keyboard.RIGHT = true;
//     }

//     if (event.keyCode == 40) {
//         keyboard.DOWN = true;
//     }

//     if (event.keyCode == 68) {
//         keyboard.D = true;
//     }
// });



// /**
//  *
//  * @listens keyup
//  * Listens for the 'keyup' event on the window and updates the 'keyboard' state
//  * based on the released key. It also handles pausing and resetting the walking sound
//  * when left or right arrow keys are released.
//  * @param {KeyboardEvent} event - The keyboard event object.
//  */
// window.addEventListener('keyup', (event) => {

//     if (event.keyCode == 32) {
//         keyboard.SPACE = false;
//     }

//     if (event.keyCode == 37) {
//         keyboard.LEFT = false;
//         walkin_sound.pause();
//         walkin_sound.currentTime = 0;
//     }

//     if (event.keyCode == 38) {
//         keyboard.UP = false;
//     }

//     if (event.keyCode == 39) {
//         keyboard.RIGHT = false;
//         walkin_sound.pause();
//         walkin_sound.currentTime = 0;
//     }

//     if (event.keyCode == 40) {
//         keyboard.DOWN = false;
//     }

//     if (event.keyCode == 68) {
//         keyboard.D = false;
//     }
// });

