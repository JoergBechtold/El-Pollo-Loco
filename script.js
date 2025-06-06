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
        soundBoxImgPlayRef: document.getElementById('sound_box_img_play'),

        // soundBoxImgMenuRef: document.getElementById('sound_box_img_menu'),
        // soundBoxSpanMenuRef: document.getElementById('sound_box_span_menu')
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


function initPlay() {
    isMuted = localStorage.getItem('isMuted') === 'true';
    updateSoundToggleDisplay();
}

function startGame() {
    const loadingSpinnerRef = document.getElementById('loading_spinner_overlay');

    if (loadingSpinnerRef) {
        loadingSpinnerRef.classList.remove('d-none');
    }
    try {
        initPlay();
        initLevel();
        canvas = document.getElementById('canvas');
        world = new World(canvas, keyboard);
    } catch (error) {
        console.error("Fehler beim Starten des Spiels", error);
    } finally {

        if (loadingSpinnerRef) {
            loadingSpinnerRef.classList.add('d-none');
        }
    }
}

// function startGame() {
//     initPlay();
//     initLevel()
//     canvas = document.getElementById('canvas');
//     world = new World(canvas, keyboard);
// }


function soundToggle() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    updateSoundToggleDisplay();
}

function updateSoundToggleDisplay() {
    const { soundBoxImgPlayRef } = getIdRefs();

    const img = isMuted ? 'assets/icons/audio-off-1.png' : 'assets/icons/audio-on-1.png';
    const audioStatus = isMuted ? 'Spiel Audio aus' : 'Spiel Audio an';
    const alt = isMuted ? 'Icon audio aus' : 'Icon audio an';
    // const text = isMuted ? 'Spiel Audio aus' : 'Spiel Audio an';

    allAudioArray.forEach(sound => {
        sound.muted = isMuted;
    });

    soundBoxImgPlayRef.src = img;
    soundBoxImgPlayRef.title = audioStatus;
    soundBoxImgPlayRef.alt = alt;


    // if (soundBoxImgStartRef && soundBoxSpanStartRef) {
    //     soundBoxImgStartRef.src = img;
    //     soundBoxImgStartRef.title = audioStatus;
    //     soundBoxImgStartRef.alt = alt;
    //     // soundBoxSpanStartRef.textContent = text;
    // }

    // if (soundBoxImgMenuRef && soundBoxSpanMenuRef) {
    //     soundBoxImgMenuRef.src = img;
    //     soundBoxImgMenuRef.title = audioStatus;
    //     soundBoxImgMenuRef.alt = alt;
    //     // soundBoxSpanMenuRef.textContent = text;
    // }
}


