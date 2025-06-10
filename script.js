let isMuted;
let isTouchDeviceGlobal = false;

function isTouchDevice() {
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
}

document.addEventListener('DOMContentLoaded', () => {
    const { mobileNavRef } = getIdRefs();
    updateTouchDeviceStatus(mobileNavRef);
    const mediaQueryTouch = window.matchMedia('(any-pointer: coarse)');
    mediaQueryTouch.addEventListener('change', () => {
        updateTouchDeviceStatus(mobileNavRef);
    });
});


function updateTouchDeviceStatus(mobileNavElement) {
    if (mobileNavElement) {
        if (isTouchDevice()) {
            mobileNavElement.classList.add('d-flex');
            mobileNavElement.classList.remove('d-none');
        } else {
            mobileNavElement.classList.remove('d-flex');
            mobileNavElement.classList.add('d-none');
        }
    }
}

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
        fullscreenRef: document.getElementById('fullscreen'),
        mobileNavRef: document.getElementById('mobile_nav'),
        loadingSpinnerRef: document.getElementById('loading_spinner_overlay'),
        canvasRef: document.getElementById('canvas'),
        fullscreenRef: document.getElementById('fullscreen'),
        fullscreenImgRef: document.getElementById('fullscreen_img'),
        gamePauseBoxImgPlayRef: document.getElementById('game-pause_box_img_play'),

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


async function startGame() {
    const { loadingSpinnerRef } = getIdRefs();

    if (loadingSpinnerRef) {
        loadingSpinnerRef.classList.remove('d-none');
    }
    try {
        initPlay();
        await initLevel();
        const { canvasRef } = getIdRefs();
        if (!canvasRef) {
            throw new Error("Canvas-Element mit ID 'canvas' wurde nicht gefunden.");
        }

        world = new World(canvasRef, keyboard);

        if (!world) {
            throw new Error("Die Spielwelt konnte nicht initialisiert werden.");
        }

    } catch (error) {
        console.error("Fehler beim Starten des Spiels:", error);

    } finally {
        if (loadingSpinnerRef) {
            loadingSpinnerRef.classList.add('d-none');
        }
    }
}


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
    allAudioArray.forEach(sound => {
        sound.muted = isMuted;
    });

    soundBoxImgPlayRef.src = img;
    soundBoxImgPlayRef.title = audioStatus;
    soundBoxImgPlayRef.alt = alt;
}


function fullscreen() {

    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        exitFullscreen();
    } else {
        const { fullscreenRef } = getIdRefs();
        if (fullscreenRef) {
            enterFullscreen(fullscreenRef);
        } else {
            enterFullscreen(document.documentElement);
        }
    }
}


function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    const { fullscreenRef, canvasRef, fullscreenImgRef } = getIdRefs();
    if (canvasRef) {
        canvasRef.style.width = '100%';
        canvasRef.style.height = '100%';
        canvasRef.style.borderRadius = '0px';
        fullscreenRef.style.borderRadius = '0px';

        fullscreenImgRef.src = 'assets/icons/fullscreen-off.png';
        fullscreenImgRef.alt = 'Vollbild aus-Icon';
        fullscreenImgRef.title = 'Vollbild aus';

    }
}


function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }

    const { fullscreenRef, canvasRef, fullscreenImgRef } = getIdRefs();
    if (canvasRef) {
        canvasRef.style.width = '';
        canvasRef.style.height = '';
        canvasRef.style.borderRadius = '';
        fullscreenRef.style.borderRadius = '';

        fullscreenImgRef.src = 'assets/icons/fullscreen-on.png';
        fullscreenImgRef.alt = 'Volbild an-Icon';
        fullscreenImgRef.title = 'Vollbild an';

    }
}





