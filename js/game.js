let canvas;
let world;
let keyboard = new Keyboard();
let isGamePaused = false;

const PATH_COLLECT_BOTTLE_AUDIO = 'assets/audio/collect-bottle.mp3';
const PATH_COLLECT_COIN_AUDIO = 'assets/audio/collect-coin.mp3';
const PATH_BOUNCING_AUDIO = 'assets/audio/bouncing.mp3';
const PATH_CHICKEN_DEATH_JUMP_AUDIO = 'assets/audio/enemy-death-new.mp3';
const PATH_CHICKEN_DEATH_AUDIO = 'assets/audio/chicken-dead.mp3';
const PATH_ENDBOSS_HURT_AUDIO = 'assets/audio/endboss-hurt-new.mp3';

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
let enemy_bouncing_dead_audio_volume = 0.5;

/**
 * 
 * Toggles the game's pause state, affecting game intervals, audio, and UI.
 *
 * This function flips the `isGamePaused` boolean.
 * - If the game is paused, it stops all game intervals, pauses all audio,
 * and updates the pause/play icon to show 'Play'.
 * - If the game is unpaused, it restarts all game intervals, and updates
 * the pause/play icon to show 'Pause'.
 *
 * @global
 * @function
 */
function toggleGamePause() {
    const { gamePauseBoxImgPlayRef } = getIdRefs();

    isGamePaused = !isGamePaused;

    if (isGamePaused) {
        stopAllIntervals();
        pauseAllAudio();
        setIcon(gamePauseBoxImgPlayRef, 'assets/icons/play-icon.png', 'Spiel fortsetzen-Icon', 'Fortsetzen')
    } else {
        startAllIntervals();
        setIcon(gamePauseBoxImgPlayRef, 'assets/icons/pause-icon.png', 'Spiel pausieren-Icon', 'Pause')
    }
}

/**
 * 
 * Pauses all audio elements contained within the `allAudioArray`.
 *
 * This function iterates through each item in `allAudioArray` and,
 * if the item is a valid audio object with a `pause` method, it calls `pause()` on it.
 */
function pauseAllAudio() {
    allAudioArray.forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
            audio.pause();
        }
    });
}

/**
 * 
 * Sets the source, alt text, and title for an image element.
 *
 * This utility function is used to dynamically update the attributes of an `<img>` tag,
 * making it easy to change the displayed icon and its descriptive text.
 *
 * @param {HTMLImageElement} ref - A reference to the HTML `<img>` element.
 * @param {string} icon - The URL or path to the new image icon.
 * @param {string} altText - The alternative text for the image (for accessibility).
 * @param {string} title - The title text for the image (often displayed as a tooltip).
 */
function setIcon(ref, icon, altText, title) {
    ref.src = icon
    ref.alt = altText;
    ref.title = title;
}

/**
 * 
 * Activates the "You Win" game screen and plays associated audio.
 *
 * This function stops all game intervals, sets `isGameFinish` to true,
 * plays a game-win sound, and displays the `overlay_you_win` element.
 */
function handleYouWinScreen() {
    let overlayYouWinRef = document.getElementById('overlay_you_win');
    stopAllIntervals()
    isGameFinish = true;
    game_win_audio.play();
    game_win_audio.volume = game_win_audio_volume;
    overlayYouWinRef.classList.add('d-flex')
}

/**
 * 
 * Activates the "You Lose" game screen and plays associated audio.
 *
 * This function stops all game intervals, sets `isGameFinish` to true,
 * plays a game-over sound, and displays the `overlay_you_loose` element
 * after a brief audio delay.
 */
function handleYouLooseScreen() {
    let overlayYouLooseRef = document.getElementById('overlay_you_loose');
    stopAllIntervals()
    isGameFinish = true;
    game_over_voice.play();
    game_over_voice.volume = game_over_voice_volime;
    setTimeout(() => {
        game_over_voice.pause();
        game_over_voice.currentTime = 0;
    }, 2000);
    overlayYouLooseRef.classList.add('d-flex')
}








