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

// function soundToggle() {
//     if (isMuted) {
//         isMuted = false;
//         setPropertiesSoundToggle(1, 'assets/icons/Audio-on.png', 'Musik aus', 'Icon audio an', 'Menü Musik an')
//     } else {
//         isMuted = true;
//         setPropertiesSoundToggle(0, 'assets/icons/Audio-mute.png', 'Musik an', 'Icon audio aus', 'Menü Musik aus')
//     }
// }

// function setPropertiesSoundToggle(volume, img, audioStatus, alt, text) {
//     const soundBoxImgRef = document.getElementById('sound_box_img');
//     const soundBoxSpanRef = document.getElementById('sound_box_span');

//     start_screen_sound.volume = volume;
//     soundBoxImgRef.src = img;
//     soundBoxImgRef.title = audioStatus;
//     soundBoxImgRef.alt = alt;
//     soundBoxSpanRef.textContent = text;
// }

function soundToggle() {
    isMuted = !isMuted;
    updateSoundToggleDisplay();
}

function updateSoundToggleDisplay() {
    const soundBoxImgStartRef = document.getElementById('sound_box_img');
    const soundBoxSpanStartRef = document.getElementById('sound_box_span');
    const soundBoxImgMenuRef = document.getElementById('sound_box_img_menu');
    const soundBoxSpanMenuRef = document.getElementById('sound_box_span_menu');
    const volume = isMuted ? 0 : 1;
    const img = isMuted ? 'assets/icons/Audio-mute.png' : 'assets/icons/Audio-on.png';
    const audioStatus = isMuted ? 'Musik an' : 'Musik aus';
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
