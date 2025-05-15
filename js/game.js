let canvas;
let world;
let isMuted = false;
let keyboard = new Keyboard();
let walkin_sound = new Audio('assets/audio/running.mp3');
let start_screen_sound = new Audio('assets/audio/beginning-2.mp3');
start_screen_sound.volume = 0.6;

function menuScreen() {
    let startScreenRef = document.getElementById('start_screen');
    let menuScreenRef = document.getElementById('menu_screen');
    startScreenRef.classList.add('d-none');
    menuScreenRef.classList.add('d-flex');
    setTimeout(() => {
        start_screen_sound.play();

    }, 500);

}


function startGame() {
    let menuScreenRef = document.getElementById('menu_screen');
    let playScreenRef = document.getElementById('play_screen');
    menuScreenRef.classList.remove('d-flex');
    playScreenRef.classList.add('d-flex');


    start_screen_sound.pause();
    start_screen_sound.currentTime = 0;
    initLevel()
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function soundToggle() {
    if (isMuted) {
        isMuted = false;
        setPropertiesSoundToggle(1, 'assets/icons/Audio-on.png', 'Audio On', 'Icon audio on', 'Mute Menu Music')
    } else {
        isMuted = true;
        setPropertiesSoundToggle(0, 'assets/icons/Audio-mute.png', 'Audio Off', 'Icon audio off', 'Unmute Menu Music')
    }
}

function setPropertiesSoundToggle(volume, img, audioStatus, alt, text) {
    const soundBoxImgRef = document.getElementById('sound_box_img');
    const soundBoxSpanRef = document.getElementById('sound_box_span');

    start_screen_sound.volume = volume;
    soundBoxImgRef.src = img;
    soundBoxImgRef.title = audioStatus;
    soundBoxImgRef.alt = alt;
    soundBoxSpanRef.textContent = text;
}




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

