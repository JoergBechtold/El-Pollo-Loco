let level1;

function initLevel() {
  level1 = new Level(

    [
      new Chicken(),
      // new Chicken(),
      // new Chicken(),
      // new Chicken(),
      // new Chicken(),
      // new Chicken(),
      // new Chick(),
      // new Chick(),
      // new Chick(),
      new Endboss()
    ],

    [
      new Cloud('assets/img/5_background/layers/4_clouds/2.png', -500),
      new Cloud('assets/img/5_background/layers/4_clouds/2.png', 5),
      new Cloud('assets/img/5_background/layers/4_clouds/1.png', 510),
      new Cloud('assets/img/5_background/layers/4_clouds/1.png', 1005),
      new Cloud('assets/img/5_background/layers/4_clouds/2.png', 1510),
      new Cloud('assets/img/5_background/layers/4_clouds/1.png', 2015),
      new Cloud('assets/img/5_background/layers/4_clouds/2.png', 2520),
      new Cloud('assets/img/5_background/layers/4_clouds/1.png', 3025),
      new Cloud('assets/img/5_background/layers/4_clouds/2.png', 3530),
      new Cloud('assets/img/5_background/layers/4_clouds/2.png', 4035)
    ],

    [
      new BackgroundObject('assets/img/5_background/layers/air.png', -719),
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', -719),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', -719),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', -719),

      new BackgroundObject('assets/img/5_background/layers/air.png', 0),
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0),

      new BackgroundObject('assets/img/5_background/layers/air.png', 719),
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719),

      new BackgroundObject('assets/img/5_background/layers/air.png', 719 * 2),
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 719 * 2),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 719 * 2),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 719 * 2),

      new BackgroundObject('assets/img/5_background/layers/air.png', 719 * 3),
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719 * 3),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719 * 3),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719 * 3),

      new BackgroundObject('assets/img/5_background/layers/air.png', 719 * 4),
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 719 * 4),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 719 * 4),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 719 * 4),


    ],

    [
      new CollectBottle('assets/img/6_salsa_bottle/salsa-bottle-left.png'),
      new CollectBottle('assets/img/6_salsa_bottle/salsa-bottle-right.png'),
      new CollectBottle('assets/img/6_salsa_bottle/salsa-bottle-left.png'),
      new CollectBottle('assets/img/6_salsa_bottle/salsa-bottle-right.png'),
      new CollectBottle('assets/img/6_salsa_bottle/salsa-bottle-right.png'),
    ],

    [
      new CollectCoins(),
      new CollectCoins(),
      new CollectCoins(),
      new CollectCoins(),
      new CollectCoins(),
    ],

    [
      new Barrel('assets/img/wooden_barrel_final_cleaned-1.png'),
      new Barrel('assets/img/wooden_barrel_final_cleaned-1.png'),
      new Barrel('assets/img/wooden_barrel_final_cleaned-1.png'),
      new Barrel('assets/img/wooden_barrel_final_cleaned-1.png'),
    ]
  );

}
