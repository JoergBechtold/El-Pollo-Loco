let canvas;
let world;
let keyboard = new Keyboard();
let isGamePaused = false;


const PATH_COLLECT_BOTTLE_AUDIO = 'assets/audio/collect-bottle.mp3';
const PATH_COLLECT_COIN_AUDIO = 'assets/audio/collect-coin.mp3';
const PATH_BOUNCING_AUDIO = 'assets/audio/bouncing.mp3';
const PATH_CHICKEN_DEATH_JUMP_AUDIO = 'assets/audio/enemy-death-new.mp3';
const PATH_CHICKEN_DEATH_AUDIO = 'assets/audio/chicken-dead.mp3';


let walkin_sound = new Audio('assets/audio/running.mp3');
let game_music = new Audio('assets/audio/game-music1.mp3');
let game_over_voice = new Audio('assets/audio/game-over.mp3');
let game_win_audio = new Audio('assets/audio/you-win.mp3');
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
    endboss_alert,
    game_over_voice,
    game_win_audio
];

const endOfGameAudioArray = [
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
    endboss_alert,

];

//volume setting
let game_music_volume_silence = 0.03;
let game_music_volume_loude = 0.1;
let bouncing_audio_volume = 0.5;
let collect_bottle_audio_volume = 1;
let collect_coin_audio_volume = 0.7;
let chicken_death_audio_volume = 1;
let snoring_audio_volume = 1;
let endboss_sound_volume = 0.3;
let death_sound_volume = 0.3;
let endboss_death_volume = 0.5;
let bottle_splash_volume = 0.5;
let game_win_audio_volume = 0.5;
let game_over_voice_volime = 0.5;

// function toggleGamePause() {
//     const { gamePauseBoxImgPlayRef } = getIdRefs();

//     if (!world) {
//         console.warn('World-Instanz ist nicht verfügbar.');
//         return;
//     }

//     isGamePaused = !isGamePaused;

//     if (isGamePaused) {
//         // Spiel pausieren
//         if (world.character) {
//             world.character.stopAllIntervals();
//         }

//         if (world.endboss) {
//             world.endboss.stopAllIntervals();
//         }

//         //enemies
//         if (world.level && world.level.enemiesArray) {
//             world.level.enemiesArray.forEach(enemy => {
//                 // Hier ist die entscheidende Prüfung:
//                 if (enemy.stopAllIntervals && typeof enemy.stopAllIntervals === 'function') {
//                     enemy.stopAllIntervals();
//                 }
//             });
//         }

//         //coins
//         if (world.level && world.level.coinsArray) {
//             world.level.coinsArray.forEach(coin => {
//                 if (coin.stopAllIntervals && typeof coin.stopAllIntervals === 'function') {
//                     coin.stopAllIntervals();
//                 }
//             });
//         }

//         //clouds
//         if (world.level && world.level.cloudsArray) {
//             world.level.cloudsArray.forEach(cloud => {
//                 if (cloud.stopAllIntervals && typeof cloud.stopAllIntervals === 'function') { // Korrektur hier
//                     cloud.stopAllIntervals();
//                 }
//             });
//         }

//         //movable-objects
//         if (world.movableObject) {
//             world.movableObject.stopAllIntervals();
//         }



//         // Alle Sounds pausieren
//         allAudioArray.forEach(audio => {
//             audio.pause();
//         });

//         gamePauseBoxImgPlayRef.src = 'assets/icons/play-icon.png';
//         gamePauseBoxImgPlayRef.alt = 'Spiel fortsetzen-Icon'
//         gamePauseBoxImgPlayRef.title = 'Fortsetzen'

//         console.log('Spiel pausiert.');
//     } else {
//         // Spiel fortsetzen
//         if (world.character) {
//             world.character.animate();
//         }

//         if (world.endboss) {
//             world.endboss.animate();
//             world.endboss.endbosseMoveAnimation();

//         }


//         // if(world.)


//         //enemies
//         if (world.level && world.level.enemiesArray) {
//             world.level.enemiesArray.forEach(enemy => {
//                 if (enemy.animate && typeof enemy.animate === 'function') {
//                     enemy.animate();
//                 }
//             });
//         }

//         //coins
//         if (world.level && world.level.coinsArray) {
//             world.level.coinsArray.forEach(coin => {
//                 // Hier ist die entscheidende Prüfung:
//                 if (coin.stopAllIntervals && typeof coin.stopAllIntervals === 'function') {
//                     coin.animateFloating();
//                 }
//             });
//         }


//         // clouds
//         if (world.level && world.level.cloudsArray) {
//             world.level.cloudsArray.forEach(cloud => {
//                 if (cloud.stopAllIntervals && typeof cloud.stopAllIntervals === 'function') { // Korrektur hier
//                     cloud.animateClouds();
//                 }
//             });
//         }

//         //movable-objects
//         if (world.movableObject) {
//             world.movableObject.applyGravity();
//             world.movableObject.enemyFollowCharacterAnimation();

//         }

//         // Relevante Sounds fortsetzen
//         game_music.play();
//         game_music.volume = game_music_volume_loude;

//         gamePauseBoxImgPlayRef.src = 'assets/icons/pause-icon.png';
//         gamePauseBoxImgPlayRef.alt = 'Spiel pausieren-Icon'
//         gamePauseBoxImgPlayRef.title = 'Pause'

//         console.log('Spiel fortgesetzt.');
//     }
// }

function handleYouWinScreen() {
    let overlayYouWinRef = document.getElementById('overlay_you_win');
    isGameFinish = true;
    game_win_audio.play();
    game_win_audio.volume = game_win_audio_volume;
    overlayYouWinRef.classList.add('d-flex')
}

function handleYouLooseScreen() {
    let overlayYouLooseRef = document.getElementById('overlay_you_loose');
    isGameFinish = true;

    endOfGameAudioArray.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    game_over_voice.play();
    game_over_voice.volume = game_over_voice_volime;

    setTimeout(() => {
        game_over_voice.pause();
        game_over_voice.currentTime = 0;
    }, 2000);
    overlayYouLooseRef.classList.add('d-flex')
}








