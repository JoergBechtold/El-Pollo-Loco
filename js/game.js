let canvas;
let world;
let keyboard = new Keyboard();
let walkin_sound = new Audio('assets/audio/running.mp3');


function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

window.addEventListener('keydown', (event) => {

    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (event.keyCode == 37) {
        keyboard.LEFT = true;
        // walkin_sound.play();
    }

    if (event.keyCode == 38) {
        keyboard.UP = true;
    }

    if (event.keyCode == 39) {
        keyboard.RIGHT = true;
        // walkin_sound.play();
    }

    if (event.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (event.keyCode == 68) {
        keyboard.D = true;
    }

});




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

