export default class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("background", "assets/images/background.webp");
        // this.load.image("background", "assets/images/cursed.jpg");
        this.load.image("0armbandit", "assets/images/0armbandit.png");
        this.load.image("0armbandit_yellow", "assets/images/0armbandit_yellow.png");
        this.load.image("0armbandit_red", "assets/images/0armbandit_red.png");
        this.load.image("button", "assets/images/button.png");
        this.load.image("button_on", "assets/images/button_on.PNG");
        this.load.image("buttonPlay", "assets/images/buttonPlay.png");
        this.load.image("buttonPlay_on", "assets/images/buttonPlay_on.png");
        this.load.image("buttonInfo", "assets/images/info.png");
        this.load.image("buttonClose", "assets/images/close.png");
        // this.load.image("buttonClose", "assets/images/close1.png");
        this.load.image("rules_bg", "assets/images/rules_bg.png");
        this.load.image("rules_bg1", "assets/images/rules_bg1.png");
        this.load.image("prizes", "assets/images/prizes1.png");
        this.load.image("scoreBg", "assets/images/scoreBg1.png");
        this.load.image("test", "assets/images/square.png");

        // icons
        this.load.image("lemon", "assets/images/lemon.png");
        this.load.image("diamond", "assets/images/diamond.png");
        this.load.image("cherry", "assets/images/cherry.png");
        this.load.image("bar", "assets/images/bar.png");
        this.load.image("bell", "assets/images/bell.png");
        this.load.image("melon", "assets/images/melon.png");
        this.load.image("banana", "assets/images/banana.png");
        this.load.image("seven", "assets/images/seven.png");
        this.load.image("plum", "assets/images/plum.png");

        //audio
        this.load.audio("schelchok", "assets/audio/schelchok.mp3");
        this.load.audio("press_play_button", "assets/audio/press_play_button.mp3");
        this.load.audio("press_red_button", "assets/audio/press_red_button.mp3");
        this.load.audio("smth_wrong", "assets/audio/smth_wrong.mp3");

        // this.load.spritesheet("icons", "assets/images/reel.png", {
        //     frameWidth: 500,
        //     frameHeight: 500,
        // });
        
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");
    }
}


