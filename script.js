let isMuted;

/**
 * 
 * Retrieves references to various HTML elements by their respective IDs.
 *
 * @returns {Object<string, HTMLElement>} An object where keys are descriptive names
 * and values are the corresponding HTMLElement objects.
 */
function getIdRefs() {
    return {
        soundBoxImgStartRef: document.getElementById('sound_box_img'),
        soundBoxSpanStartRef: document.getElementById('sound_box_span'),
        soundBoxImgMenuRef: document.getElementById('sound_box_img_menu'),
        soundBoxSpanMenuRef: document.getElementById('sound_box_span_menu')
    };
}

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

// function initMenu() {
//     isMuted = localStorage.getItem('isMuted') === 'true';
//     updateSoundToggleDisplay();
// }

function initPlay() {
    isMuted = localStorage.getItem('isMuted') === 'true';
    updateSoundToggleDisplay();
}

function startGame() {
    initPlay();

    setTimeout(() => {
        setInterval(() => {
            game_music.play();
        }, 1400);
    }, 500);

    initLevel()
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}


function soundToggle() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    updateSoundToggleDisplay();
}

function updateSoundToggleDisplay() {
    const { soundBoxImgStartRef, soundBoxSpanStartRef, soundBoxImgMenuRef, soundBoxSpanMenuRef } = getIdRefs();

    const img = isMuted ? 'assets/icons/Audio-mute.png' : 'assets/icons/Audio-on.png';
    const audioStatus = isMuted ? 'Spiel Audio aus' : 'Spiel Audio an';
    const alt = isMuted ? 'Icon audio aus' : 'Icon audio an';
    const text = isMuted ? 'Spiel Audio aus' : 'Spiel Audio an';

    allAudioArray.forEach(sound => {
        sound.muted = isMuted;
    });


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


