import Scene1 from './scenes/Scene1.js';
import Scene2 from './scenes/Scene2.js';

var config = {
    width: 1792,
    height: 815,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2],
    pixelArt: true,
  }
  
  
  var game = new Phaser.Game(config);