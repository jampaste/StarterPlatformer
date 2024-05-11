class Win extends Phaser.Scene {
    constructor(){
        super("win");
    }

    preload(){
    }

    create(){
        this.add.text(620/2, 170, 'you win.', {
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        this.add.text(620, 170, "press space to restart");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.scene.start("platformerScene");
        }
    }
}