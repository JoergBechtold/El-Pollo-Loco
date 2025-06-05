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

    bindKeyPressEvents() {

        /**
         * 
         * @listens keydown
         * Listens for the 'keydown' event on the window and updates the 'keyboard' state
         * based on the pressed key.
         * @param {KeyboardEvent} event - The keyboard event object.
         */
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



        /**
         * 
         * @listens keyup
         * Listens for the 'keyup' event on the window and updates the 'keyboard' state
         * based on the released key. It also handles pausing and resetting the walking sound
         * when left or right arrow keys are released.
         * @param {KeyboardEvent} event - The keyboard event object.
         */
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