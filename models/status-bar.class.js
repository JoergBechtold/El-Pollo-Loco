class StatusBar extends MovableObject {
    x = 40;
    y;
    width = 200;
    height = 60;
    statusBarType;
    percentage = 0;

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

    IMAGES_ENDBOSS = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ]

    constructor(statusBarType) {
        super();
        this.statusBarType = statusBarType;
        this.loadImages(this.getImageArray());
        this.setPositionByType();
        this.setHealthBarPercentage();
    }

    setHealthBarPercentage() {
        if (this.statusBarType === 'health') {
            this.setPercentage(100);
        } else if (this.statusBarType === 'endboss') {
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
        } else if (this.statusBarType === 'endboss') {
            this.y = 8;
            this.x = 480;
        }
    }

    getImageArray() {
        if (this.statusBarType === 'health') {
            return this.IMAGES_HEALTH;
        } else if (this.statusBarType === 'coins') {
            return this.IMAGES_COINS;
        } else if (this.statusBarType === 'bottle') {
            return this.IMAGES_BOTTLE;
        } else if (this.statusBarType === 'endboss') {
            return this.IMAGES_ENDBOSS;
        }
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        const imageArray = this.getImageArray();
        let path = imageArray[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

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