let isMuted;
let isGameFinish = false;
let isTouchDeviceGlobal = false;
// let world;
let initialCanvasRef;

const isPortrait = window.matchMedia("(orientation: portrait)").matches;
const isLandscape = window.matchMedia("(orientation: landscape)").matches;

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
        gamePauseBoxImgPlayRef: document.getElementById('game_pause_box_img_play'),

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
    const { loadingSpinnerRef, canvasRef } = getIdRefs();

    loadingSpinnerRef.classList.remove('d-none');

    try {
        initPlay();
        await initLevel();

        if (!canvasRef) {
            throw new Error("Canvas-Element mit ID 'canvas' wurde nicht gefunden.");
        }
        initialCanvasRef = canvasRef;

        world = new World(initialCanvasRef, keyboard);

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

function resetGame() {



    if (world) {
        world.stopAllIntervals();
    }

    // 2. Audio zurücksetzen
    endOfGameAudioArray.forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    if (game_over_voice && typeof game_over_voice.pause === 'function') {
        game_over_voice.pause();
        game_over_voice.currentTime = 0;
    }
    if (game_win_audio && typeof game_win_audio.pause === 'function') {
        game_win_audio.pause();
        game_win_audio.currentTime = 0;
    }


    isGameFinish = false;
    isGamePaused = false;


    const { canvasRef, gamePauseBoxImgPlayRef } = getIdRefs();
    document.getElementById('overlay_you_loose').classList.remove('d-flex');
    document.getElementById('overlay_you_win').classList.remove('d-flex');

    if (canvasRef) {
        canvasRef.classList.remove('d-none');
    }
    if (gamePauseBoxImgPlayRef) {
        setIcon(gamePauseBoxImgPlayRef, 'assets/icons/pause-icon.png', 'Spiel pausieren-Icon', 'Pause');
    }

    initLevel();


    if (initialCanvasRef) {
        world = new World(initialCanvasRef, keyboard);
    } else {
        console.error("Canvas-Referenz ist null. Spiel kann nicht neu gestartet werden.");
    }


    if (game_music && !isMuted) {
        game_music.play();
        game_music.volume = game_music_volume_loude;
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





