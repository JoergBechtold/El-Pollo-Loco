// class StatusBar extends MovableObject {
//     x = 40;
//     y;
//     width = 200;
//     height = 60;
//     statusBarType;
//     percentage = 0;


//     IMAGES_HEALTH = [
//         'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
//         'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
//         'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
//         'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
//         'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
//         'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
//     ]

//     IMAGES_COINS = [
//         'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
//         'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
//         'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
//         'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
//         'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
//         'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
//     ]

//     IMAGES_BOTTLE = [
//         'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
//         'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
//         'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
//         'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
//         'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
//         'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
//     ]


//     constructor(statusBarType) {
//         super();
//         this.statusBarType = statusBarType;
//         const imageArray = this.getImageArray();
//         this.loadImages(imageArray);
//         this.setPercentage();
//         this.setInitialPercentage()
//         this.setInitialPercentageCoins()
//         this.setPositionByType();
//     }


//     setPositionByType() {
//         if (this.statusBarType === 'health') {
//             this.y = 0;
//         } else if (this.statusBarType === 'coins') {
//             this.y = 50;
//         } else if (this.statusBarType === 'bottle') {
//             this.y = 100;
//         }
//     }

//     getImageArray() {
//         if (this.statusBarType === 'health') {
//             return this.IMAGES_HEALTH;
//         } else if (this.statusBarType === 'coins') {
//             return this.IMAGES_COINS;
//         } else if (this.statusBarType === 'bottle') {
//             return this.IMAGES_BOTTLE;
//         }
//     }

//     setInitialPercentage() {
//         if (this.statusBarType === 'health') {
//             this.setPercentage(100);
//         } else {
//             this.setPercentage(0);
//         }
//     }


//     setPercentage(percentage) {
//         this.percentage = percentage;
//         const imageArray = this.getImageArray();
//         let path = imageArray[this.resolveImageIndex()];
//         this.img = this.imageCache[path];
//     }

//     resolveImageIndex() {
//         if (this.percentage == 100) {
//             return 5;
//         } else if (this.percentage > 80) {
//             return 4;
//         } else if (this.percentage > 60) {
//             return 3;
//         } else if (this.percentage > 40) {
//             return 2;
//         } else if (this.percentage > 20) {
//             return 1;
//         } else {
//             return 0;
//         }
//     }


//     setInitialPercentageCoins() {
//         if (this.statusBarType === 'coins') {
//             this.setPercentageCoins(0);
//         } else {
//             this.setPercentageCoins(5);
//         }
//     }

//     setPercentageCoins(percentage) {
//         this.percentage = percentage;
//         const imageArray = this.getImageArray();
//         let path = imageArray[this.resolveImageIndexCoins()];
//         this.img = this.imageCache[path];
//     }

//     resolveImageIndexCoins() {
//         if (this.percentage == 5) {
//             return 5;
//         } else if (this.percentage > 4) {
//             return 4;
//         } else if (this.percentage > 3) {
//             return 3;
//         } else if (this.percentage > 2) {
//             return 2;
//         } else if (this.percentage > 1) {
//             return 1;
//         } else {
//             return 0;
//         }
//     }
// };


class StatusBar extends MovableObject {
    x = 40;
    y;
    width = 200;
    height = 60;
    statusBarType;
    percentage = 0; // Standardmäßig auf 0 initialisieren

    IMAGES_HEALTH = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    IMAGES_COINS = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    IMAGES_BOTTLE = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ];

    constructor(statusBarType) {
        super();
        this.statusBarType = statusBarType;
        // Bilder laden, je nach Typ
        this.loadImages(this.getImageArray());
        // Position auf dem Canvas festlegen
        this.setPositionByType();

        // Initialen Prozentsatz setzen (Gesundheit 100%, andere 0%)
        if (this.statusBarType === 'health') {
            this.setPercentage(100);
        } else {
            this.setPercentage(0);
        }
    }

    setPositionByType() {
        if (this.statusBarType === 'health') {
            this.y = 0;
        } else if (this.statusBarType === 'coins') {
            this.y = 50;
        } else if (this.statusBarType === 'bottle') {
            this.y = 100;
        }
    }

    getImageArray() {
        if (this.statusBarType === 'health') {
            return this.IMAGES_HEALTH;
        } else if (this.statusBarType === 'coins') {
            return this.IMAGES_COINS;
        } else if (this.statusBarType === 'bottle') {
            return this.IMAGES_BOTTLE;
        }
    }

    /**
     * Setzt den Prozentsatz der Statusleiste und aktualisiert das Bild.
     * @param {number} percentage - Der neue Prozentsatz (0-100).
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage)); // Wert zwischen 0 und 100 halten
        const imageArray = this.getImageArray();
        let path = imageArray[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Gibt den Index des Bildes basierend auf dem aktuellen Prozentsatz zurück.
     * Funktioniert für alle Statusleisten-Typen.
     * @returns {number} Der Index des Bildes im Array (0-5).
     */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}