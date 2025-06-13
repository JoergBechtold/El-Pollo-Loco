let isMuted = true;
let isGameFinish = false;
let isTouchDeviceGlobal = false;
let initialCanvasRef;
const isPortrait = window.matchMedia("(orientation: portrait)").matches;
const isLandscape = window.matchMedia("(orientation: landscape)").matches;

/**
 * 
 * Checks if the current device is a touch device.
 *
 * @returns {boolean} - True if the device is a touch device, false otherwise.
 */
function isTouchDevice() {
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
}


/**
 * 
 * Attaches an event listener to the 'DOMContentLoaded' event to handle the initial setup
 * and responsiveness of the mobile navigation based on touch device detection.
 *
 * It performs the following actions:
 * 1. Retrieves the `mobileNavRef` element using `getIdRefs()`.
 * 2. Calls `updateTouchDeviceStatus()` initially to set the correct display status of the mobile navigation.
 * 3. Sets up a `MediaQueryList` to listen for changes in the `(any-pointer: coarse)` media query.
 * This media query detects if the primary input mechanism is a "coarse" pointer, typically indicating a touch screen.
 * 4. Adds an event listener to the `mediaQueryTouch` that calls `updateTouchDeviceStatus()`
 * whenever the touch device status changes (e.g., when a user switches between a touch screen and a mouse on a hybrid device).
 */
document.addEventListener('DOMContentLoaded', () => {
    const { mobileNavRef } = getIdRefs();
    updateTouchDeviceStatus(mobileNavRef);
    const mediaQueryTouch = window.matchMedia('(any-pointer: coarse)');
    mediaQueryTouch.addEventListener('change', () => {
        updateTouchDeviceStatus(mobileNavRef);
    });
});


/**
 * 
 * Updates the display status of a mobile navigation element based on whether the device is a touch device.
 * If it's a touch device, the element will be visible (`d-flex`).
 * If it's not a touch device, the element will be hidden (`d-none`).
 *
 * @param {HTMLElement} mobileNavElement - The HTML element representing the mobile navigation.
 */
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
        overlayYouLooseRef: document.getElementById('overlay_you_loose'),
        overlayYouWinRef: document.getElementById('overlay_you_win'),
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

/**
 * 
 * Initializes the audio playback settings.
 *
 * This function retrieves the 'isMuted' status from `localStorage` and updates the
 * display of the sound toggle accordingly. The 'isMuted' status is stored as a string
 * in `localStorage`, so it's compared to the string 'true' to set the boolean `isMuted` variable.
 */
function initPlay() {
    // isMuted = localStorage.getItem('isMuted') === 'true';
    updateSoundToggleDisplay();
}

/**
 * 
 * Asynchronously starts the game, managing the loading display and error handling.
 *
 * This function orchestrates the overall game startup process. It immediately
 * displays a loading spinner to provide visual feedback to the user.
 * The core game initialization logic is delegated to the `handleTry` function.
 *
 * @param {HTMLElement} canvasRef - The reference to the main canvas HTML element where the game will be rendered.
 * This is passed to the `handleTry` function for game environment setup.
 * @returns {Promise<void>} A promise that resolves when the game's startup sequence
 * (including loading and initialization) is complete, or rejects if an error occurs.
 */
async function startGame() {
    const { loadingSpinnerRef, canvasRef } = getIdRefs();
    loadingSpinnerRef.classList.remove('d-none');

    try {
        handleTry(canvasRef);
    } catch (error) {
        console.error("Fehler beim Starten des Spiels:", error);

    } finally {
        if (loadingSpinnerRef) {
            loadingSpinnerRef.classList.add('d-none');
        }
    }
}

/**
 * 
 * Asynchronously handles the core game initialization logic.
 * This function is an integral part of the `startGame` process, containing
 * the steps necessary to set up the game environment before play can begin.
 *
 * @param {HTMLElement} canvasRef - The HTML canvas element reference where the game will be rendered.
 * This element is crucial for initializing the game world.
 * @returns {Promise<void>} A promise that resolves when the game's core environment
 * (audio, level, canvas, and world) has been successfully initialized.
 * @throws {Error} If the provided `canvasRef` is null or undefined, indicating
 * that the canvas element was not found, or if the `World` instance fails to initialize.
 */
async function handleTry(canvasRef) {
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
}

/**
 * Resets the entire game to its initial state, preparing it for a new play session.
 * This involves stopping current game processes, resetting audio and UI,
 * re-initializing the game world, and restarting background music.
 *
 * @returns {Promise<void>} A Promise that resolves when the game reset process is complete.
 */
async function resetGame() {
    const { overlayYouWinRef, overlayYouLooseRef, canvasRef, gamePauseBoxImgPlayRef } = getIdRefs();

    stopAllIntervals();
    resetAudioPlayback();
    resetGameUIAndState(overlayYouWinRef, overlayYouLooseRef, canvasRef, gamePauseBoxImgPlayRef);
    await initializeNewGameWorld();
    startBackgroundMusic();
}

/**
 * Pauses and resets the playback time for all relevant game audio elements.
 * This function handles end-of-game sounds, game over voices, and win audio.
 */
function resetAudioPlayback() {
    const audioElements = [...endOfGameAudioArray, game_over_voice, game_win_audio];

    audioElements.forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}

/**
 * Resets the game's internal state flags and updates the visibility
 * and state of various UI elements to prepare for a new game session.
 *
 * @param {HTMLElement} overlayYouWinRef - The HTML element for the "You Win" overlay.
 * @param {HTMLElement} overlayYouLooseRef - The HTML element for the "You Lose" overlay.
 * @param {HTMLElement} canvasRef - The main game canvas HTML element.
 * @param {HTMLElement} gamePauseBoxImgPlayRef - The image element for the game pause/play toggle.
 */
function resetGameUIAndState(overlayYouWinRef, overlayYouLooseRef, canvasRef, gamePauseBoxImgPlayRef) {
    isGameFinish = false;
    isGamePaused = false;

    overlayYouLooseRef.classList.remove('d-flex');
    overlayYouWinRef.classList.remove('d-flex');
    canvasRef.classList.remove('d-none');

    setIcon(gamePauseBoxImgPlayRef, 'assets/icons/pause-icon.png', 'Spiel pausieren-Icon', 'Pause');
}

/**
 * Re-initializes the game level and creates a new instance of the game world.
 * This function sets up the core game environment for a fresh start.
 *
 * @returns {Promise<void>} A Promise that resolves once the level is initialized and the world is created.
 * @throws {Error} If `initialCanvasRef` is not available, preventing world creation.
 */
async function initializeNewGameWorld() {
    await initLevel();

    if (!initialCanvasRef) {
        throw new Error("Canvas reference is missing. Cannot initialize new game world.");
    }
    world = new World(initialCanvasRef, keyboard);
}

/**
 * Starts the main game background music if it's not currently muted.
 * The volume is set to the predefined loud level.
 */
function startBackgroundMusic() {
    if (game_music && !isMuted) {
        game_music.play();
        game_music.volume = game_music_volume_loude;
    }
}

/**
 * 
 * Toggles the mute status of the application's sound.
 *
 * This function performs the following actions:
 * 1. **Inverts the `isMuted` state**: If the sound is currently muted, it will be unmuted, and vice-versa.
 * 2. **Saves the new state to `localStorage`**: The updated `isMuted` boolean value is stored in the browser's local storage,
 * ensuring the preference persists across sessions.
 * 3. **Updates the sound toggle's display**: Calls `updateSoundToggleDisplay()` to reflect the new mute status in the user interface.
 */
function soundToggle() {
    isMuted = !isMuted;
    // localStorage.setItem('isMuted', isMuted);
    updateSoundToggleDisplay();
}

/**
 * 
 * Updates the visual display of the sound toggle and controls the mute status of all audio elements.
 *
 * This function performs the following steps:
 * 1. **Retrieves the sound toggle image element**: It gets the reference to the `soundBoxImgPlayRef` DOM element using `getIdRefs()`.
 * 2. **Determines visual assets**: Based on the global `isMuted` variable, it sets the appropriate `src` for the image (either 'audio-off-1.png' or 'audio-on-1.png'),
 * the `title` text (e.g., 'Spiel Audio aus' for muted), and the `alt` text for accessibility.
 * 3. **Applies mute status to all audio**: It iterates through `allAudioArray` (an assumed array of HTML audio elements) and sets the `muted` property of each audio element
 * to match the current `isMuted` status. This ensures all sounds are muted or unmuted simultaneously.
 * 4. **Updates the sound toggle display**: Finally, it updates the `src`, `title`, and `alt` attributes of the `soundBoxImgPlayRef` element
 * to visually reflect the current sound status to the user.
 */
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

/**
 * 
 * Toggles the fullscreen mode of the application.
 *
 * This function checks if the document is currently in fullscreen mode (across various browser prefixes).
 * - If it **is** in fullscreen mode, it calls `exitFullscreen()` to exit it.
 * - If it **is not** in fullscreen mode, it attempts to enter fullscreen.
 * - It first tries to find a specific element named `fullscreenRef` using `getIdRefs()` to make fullscreen.
 * - If `fullscreenRef` is not found, it defaults to making the entire `document.documentElement` (the `<html>` element) fullscreen.
 *
 * @returns {void}
 */
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

/**
 * 
 * Attempts to enter fullscreen mode for a given HTML element.
 * It uses the standard `requestFullscreen` method, along with vendor-prefixed versions
 * for broader browser compatibility (`msRequestFullscreen` for Microsoft, `webkitRequestFullscreen` for WebKit).
 *
 * After attempting to enter fullscreen, it retrieves references to `fullscreenRef`, `canvasRef`,
 * and `fullscreenImgRef` via `getIdRefs()`. If `canvasRef` is available, it then calls
 * `setAllPropertiesForEnterFullscreen` to adjust styles and potentially update a fullscreen icon,
 * ensuring the UI adapts correctly to the fullscreen state.
 *
 * @param {HTMLElement} element - The HTML element to make fullscreen. This is typically
 * the game container or the document's root element.
 */
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
        setAllPropertiesForEnterFullscreen(fullscreenRef, canvasRef, fullscreenImgRef);
    }
}

/**
 * 
 * Sets the necessary CSS properties and updates the fullscreen icon when entering fullscreen mode.
 * This function is called by `enterFullscreen` to adjust the visual appearance of the canvas
 * and the fullscreen toggle button.
 *
 * @param {HTMLElement} fullscreenRef - The HTML element that represents the fullscreen container or trigger.
 * @param {HTMLCanvasElement} canvasRef - The HTML canvas element whose dimensions need to be adjusted for fullscreen.
 * @param {HTMLImageElement} fullscreenImgRef - The image element used for the fullscreen toggle icon.
 */
function setAllPropertiesForEnterFullscreen(fullscreenRef, canvasRef, fullscreenImgRef) {
    canvasRef.style.width = '100%';
    canvasRef.style.height = '100%';
    canvasRef.style.borderRadius = '0px';
    fullscreenRef.style.borderRadius = '0px';
    fullscreenImgRef.src = 'assets/icons/fullscreen-off.png';
    fullscreenImgRef.alt = 'Vollbild aus-Icon';
    fullscreenImgRef.title = 'Vollbild aus';
}

/**
 * Exits fullscreen mode for the document.
 * It attempts to use the standard `exitFullscreen` method, along with the `webkitExitFullscreen`
 * vendor-prefixed version for broader browser compatibility.
 *
 * After initiating the exit from fullscreen, it retrieves references to `fullscreenRef`, `canvasRef`,
 * and `fullscreenImgRef` via `getIdRefs()`. If `canvasRef` is found, it then calls
 * `removeAllPropertiesForExitFullscreen` to revert the UI adjustments made when entering fullscreen,
 * such as restoring original canvas dimensions and updating the fullscreen icon.
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }

    const { fullscreenRef, canvasRef, fullscreenImgRef } = getIdRefs();

    if (canvasRef) {
        removeAllPropertiesForExitFullscreen(fullscreenRef, canvasRef, fullscreenImgRef);
    }
}

/**
 * Resets the CSS properties and updates the fullscreen icon to their default states
 * when exiting fullscreen mode. This function is called by `exitFullscreen` to
 * restore the visual appearance of the canvas and the fullscreen toggle button.
 *
 * @param {HTMLElement} fullscreenRef - The HTML element that represents the fullscreen container or trigger.
 * @param {HTMLCanvasElement} canvasRef - The HTML canvas element whose dimensions were adjusted for fullscreen.
 * @param {HTMLImageElement} fullscreenImgRef - The image element used for the fullscreen toggle icon.
 */
function removeAllPropertiesForExitFullscreen(fullscreenRef, canvasRef, fullscreenImgRef) {
    canvasRef.style.width = '';
    canvasRef.style.height = '';
    canvasRef.style.borderRadius = '';
    fullscreenRef.style.borderRadius = '';
    fullscreenImgRef.src = 'assets/icons/fullscreen-on.png';
    fullscreenImgRef.alt = 'Volbild an-Icon';
    fullscreenImgRef.title = 'Vollbild an';
}





