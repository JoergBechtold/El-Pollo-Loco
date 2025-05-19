function getIdRefs() {
    return {
        startScreenRef: document.getElementById('start_screen'),
        menuScreenRef: document.getElementById('menu_screen'),
        playScreenRef: document.getElementById('play_screen'),
        soundBoxImgStartRef: document.getElementById('sound_box_img'),
        soundBoxSpanStartRef: document.getElementById('sound_box_span'),
        soundBoxImgMenuRef: document.getElementById('sound_box_img_menu'),
        soundBoxSpanMenuRef: document.getElementById('sound_box_span_menu')
    };
}


let start_screen_sound = new Audio('assets/audio/beginning-2.mp3');
start_screen_sound.volume = 0.6;
let isMuted = false;


/**
 * 
 * @function back
 * @description Navigates the browser to the previous page in the history.
 */
function back() {
    window.history.back();
}

/**
 * 
 * @function goToUrl
 * @description Navigates the browser to the specified URL by setting the `window.location.href` property.
 * @param {string} url - The URL to navigate to.
 */
function goToUrl(url) {
    window.location.href = url;
}

function menuScreen() {
    const { startScreenRef, menuScreenRef } = getIdRefs();
    startScreenRef.classList.add('d-none');
    menuScreenRef.classList.add('d-flex');
    // setTimeout(() => {
    //     start_screen_sound.play();

    // }, 500);
}


function startGame() {
    const { playScreenRef, menuScreenRef } = getIdRefs();
    menuScreenRef.classList.remove('d-flex');
    playScreenRef.classList.add('d-flex');


    // start_screen_sound.pause();
    // start_screen_sound.currentTime = 0;
    initLevel()
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function soundToggle() {
    isMuted = !isMuted;
    updateSoundToggleDisplay();
}

function updateSoundToggleDisplay() {
    const { soundBoxImgStartRef, soundBoxSpanStartRef, soundBoxImgMenuRef, soundBoxSpanMenuRef } = getIdRefs();
    const volume = isMuted ? 0 : 1;
    const img = isMuted ? 'assets/icons/Audio-mute.png' : 'assets/icons/Audio-on.png';
    const audioStatus = isMuted ? 'Musik aus' : 'Musik an';
    const alt = isMuted ? 'Icon audio aus' : 'Icon audio an';
    const text = isMuted ? 'Menü Musik aus' : 'Menü Musik an';

    start_screen_sound.volume = volume;
    if (soundBoxImgStartRef && soundBoxSpanStartRef) {
        soundBoxImgStartRef.src = img;
        soundBoxImgStartRef.title = audioStatus;
        soundBoxImgStartRef.alt = alt;
        soundBoxSpanStartRef.textContent = text;
    }

    if (soundBoxImgMenuRef && soundBoxSpanMenuRef) {
        soundBoxImgMenuRef.src = img;
        soundBoxImgMenuRef.title = audioStatus;
        soundBoxImgMenuRef.alt = alt;
        soundBoxSpanMenuRef.textContent = text;
    }
}
