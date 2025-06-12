class Keyboard {
    LEFT = false;
    RIGHT = false;
    SPACE = false;
    UP = false;
    DOWN = false;
    D = false;

    constructor() {
        this.bindKeyPressEvents();
        this.bindBtsPressEvents();

    }

    /**
    * 
    * Binds touch events to UI buttons for mobile controls.
    *
    * This function sets up `touchstart` and `touchend` listeners for directional (left, right),
    * jump, and throw buttons. It prevents default touch behavior and updates
    * corresponding internal boolean flags (`this.LEFT`, `this.RIGHT`, `this.SPACE`, `this.D`)
    * to reflect button press states.
    *
    * @memberof World // Or the class responsible for game input/UI
    */
    bindBtsPressEvents() {
        document.getElementById('btn_left').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.LEFT = true;

        });
        document.getElementById('btn_left').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.LEFT = false;
        });

        document.getElementById('btn_right').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.RIGHT = true;

        })
        document.getElementById('btn_right').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.RIGHT = false;
        })

        document.getElementById('btn_jump').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.SPACE = true;

        })
        document.getElementById('btn_jump').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.SPACE = false;
        })

        document.getElementById('btn_throw').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.D = true;

        })
        document.getElementById('btn_throw').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.D = false;
        })
    }

    /**
    * 
    * Binds keyboard press and release events for game controls.
    *
    * This function sets up `keydown` and `keyup` event listeners on the window.
    * It updates boolean flags in the global `keyboard` object (e.g., `keyboard.SPACE`,
    * `keyboard.LEFT`, `keyboard.RIGHT`, `keyboard.UP`, `keyboard.DOWN`, `keyboard.D`)
    * to reflect the pressed state of corresponding keys (Space, Arrow keys, 'D').
    * It also handles pausing and resetting the `walkin_sound` when left or right keys are released.
    *
    * @memberof World // Or the class managing overall game input
    */
    bindKeyPressEvents() {
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
    }
}