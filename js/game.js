let canvas;
let world;
let keyboard = new Keyboard();
let walkin_sound = new Audio('assets/audio/running.mp3');
let game_music = new Audio('assets/audio/game-musik.mp3');
let collect_bottle_audio = new Audio('assets/audio/collect-bottle.mp3');
let death_sound = new Audio('assets/audio/death.mp3');
let jump_sound = new Audio('assets/audio/jump.ogg');
let landing_sound = new Audio('assets/audio/landing.mp3');
let hurt_sound = new Audio('assets/audio/short-oww-46070.mp3');
let bottle_splash = new Audio('assets/audio/bottle-break.mp3');
let collect_coin_audio = new Audio('assets/audio/collect-coin.mp3');




const allAudioArray = [
    walkin_sound,
    game_music,
    collect_bottle_audio,
    death_sound,
    jump_sound,
    landing_sound,
    hurt_sound,
    bottle_splash,
    collect_coin_audio
];

game_music.volume = 0.1;
collect_coin_audio.volume = 0.5;

// let isMuted = localStorage.getItem('isMuted') === 'true';



/**
 * 
 * @listens keydown
 * Listens for the 'keydown' event on the window and updates the 'keyboard' state
 * based on the pressed key.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
window.addEventListener('keydown', (event) => {
    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (event.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (event.keyCode == 38) {
        keyboard.UP = true;
    }

    if (event.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (event.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (event.keyCode == 68) {
        keyboard.D = true;
    }
});



/**
 * 
 * @listens keyup
 * Listens for the 'keyup' event on the window and updates the 'keyboard' state
 * based on the released key. It also handles pausing and resetting the walking sound
 * when left or right arrow keys are released.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
window.addEventListener('keyup', (event) => {

    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (event.keyCode == 37) {
        keyboard.LEFT = false;
        walkin_sound.pause();
        walkin_sound.currentTime = 0;
    }

    if (event.keyCode == 38) {
        keyboard.UP = false;
    }

    if (event.keyCode == 39) {
        keyboard.RIGHT = false;
        walkin_sound.pause();
        walkin_sound.currentTime = 0;
    }

    if (event.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (event.keyCode == 68) {
        keyboard.D = false;
    }
});

