const level1 = new Level(
    [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Endboss()
    ],

    [
      new Cloud()
    ],

    [
      new BackgroundObject('assets/img/5_background/layers/air.png', -719), // x=0
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', -719 ),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', -719 ),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', -719 ),

      new BackgroundObject('assets/img/5_background/layers/air.png', 0), // x=0
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0 ),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0 ),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0 ),

      new BackgroundObject('assets/img/5_background/layers/air.png', 719), // x=0
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719 ),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719 ),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719 ),

      new BackgroundObject('assets/img/5_background/layers/air.png', 719*2), // x=0
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 719*2 ),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 719*2 ),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 719*2 ),

      new BackgroundObject('assets/img/5_background/layers/air.png', 719*3), // x=0
      new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719*3 ),
      new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719*3 ),
      new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719*3 )  
    ]
);


// let level1;

// function initLevel(){

// level1 = new Level(
//     [
//       new Chicken(),
//       new Chicken(),
//       new Chicken(),
//       new Endboss()
//     ],

//     [
//       new Cloud()
//     ],

//     [
//       new BackgroundObject('assets/img/5_background/layers/air.png', -719), // x=0
//       new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', -719 ),
//       new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', -719 ),
//       new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', -719 ),

//       new BackgroundObject('assets/img/5_background/layers/air.png', 0), // x=0
//       new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0 ),
//       new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0 ),
//       new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0 ),

//       new BackgroundObject('assets/img/5_background/layers/air.png', 719), // x=0
//       new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719 ),
//       new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719 ),
//       new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719 ),

//       new BackgroundObject('assets/img/5_background/layers/air.png', 719*2), // x=0
//       new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 719*2 ),
//       new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 719*2 ),
//       new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 719*2 ),

//       new BackgroundObject('assets/img/5_background/layers/air.png', 719*3), // x=0
//       new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719*3 ),
//       new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719*3 ),
//       new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719*3 )  
//     ]
// );
// }