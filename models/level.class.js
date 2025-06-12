class Level {
    enemiesArray;
    cloudsArray;
    backgroundObjectsArray;
    bottlesArray;
    coinsArray;
    barrelArray;
    level_end_x = 2800;

    constructor(enemiesArray, cloudsArray, backgroundObjectsArray, bottlesArray, coinsArray, barrelArray) {
        this.enemiesArray = enemiesArray;
        this.cloudsArray = cloudsArray;
        this.backgroundObjectsArray = backgroundObjectsArray;
        this.bottlesArray = bottlesArray;
        this.coinsArray = coinsArray;
        this.barrelArray = barrelArray;
    }
}