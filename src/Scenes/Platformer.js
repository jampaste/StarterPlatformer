class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
        this.perish = this.perish.bind(this);
        this.winner = this.winner.bind(this);
    }
    //WORK ON
    //COLLECT COIN
    //ENEMIES?
    init() {
        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 1800;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1200;
        this.JUMP_VELOCITY = -600;

    }
    
    perish() {  
        my.sprite.player.body.x = game.config.width/8-50;
        my.sprite.player.body.y = game.config.height/2+800;
    }

    winner(){
        this.scene.start("win");
    }

    create() {
        this.physics.world.setBounds(0,0, 18*80*2, 40*18*2);
        this.cameras.main.setBounds(0,0,18*80*2, 40*18*2);
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 80, 40);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.BackgroundLayer = this.map.createLayer("background", this.tileset, 0, 0);
        this.BackgroundLayer.setScale(2.0);
        this.decoraniLayer = this.map.createLayer("decoranim", this.tileset, 0, 0);
        this.decoraniLayer.setScale(2.0);
        this.decorLayer = this.map.createLayer("decor", this.tileset, 0, 0);
        this.decorLayer.setScale(2.0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);
        this.water2 = this.map.createLayer("water ani", this.tileset, 0, 0);
        this.water2.setScale(0);
        this.water = this.map.createLayer("water", this.tileset, 0, 0);
        this.water.setScale(2.0);
        
        this.win = this.map.createLayer("win", this.tileset, 0, 0);
        this.win.setScale(2.0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        this.water.setCollisionByProperty({
            drown: true
        });
        this.water2.setCollisionByProperty({
            drown: true
        });
        this.win.setCollisionByProperty({
            YAY: true
        });

        this.counter = 0;
        this.cheats = 0;
        this.smoothness = 0;
        this.switch = false;

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(game.config.width/8-50, game.config.height/2+800, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.water, this.perish);
        this.physics.add.collider(my.sprite.player, this.water2, this.perish);
        this.physics.add.collider(my.sprite.player, this.win, this.winner);
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        
        my.sprite.player.body.setMaxVelocityX(400);
        my.sprite.player.body.setMaxVelocityY(500);

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

    }

    update() {
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            if(my.sprite.player.body.velocity.x > 0){ //allows sharper turns
                my.sprite.player.body.setVelocityX(my.sprite.player.body.velocity.x - 20);
            }
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            if(this.smoothness < 0){
                this.smoothness += 4;
            }
            if(this.smoothness < 200){    
                this.smoothness += 1;
                this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25, this.smoothness, 0);
            }

        } else if(cursors.right.isDown) {
            // TODO: have the player accelerate to the right
            if(my.sprite.player.body.velocity.x < 0){ //allows sharper turns
                my.sprite.player.body.setVelocityX(my.sprite.player.body.velocity.x + 20);
            }
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            if(this.smoothness > 0){
                this.smoothness -= 4;
            }
            if(this.smoothness > -200){    
                this.smoothness -= 1;
                this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25, this.smoothness, 0);
            }
            
            

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG-900);
            my.sprite.player.anims.play('idle');
        }
        if(Phaser.Input.Keyboard.JustDown(cursors.down)){
            this.cheats += 1;
        }
        if(cursors.down.isDown&& this.cheats > 5){
            my.sprite.player.body.velocity.y -= 100;
        }
        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            this.inair = true;
            my.sprite.player.body.setMaxVelocityX(350);
            my.sprite.player.anims.play('jump');
        }
        else{
            if(this.inair){
                this.inair = false;
                my.sprite.player.body.setMaxVelocityX(400);
                my.sprite.player.body.setVelocityX(my.sprite.player.body.velocity.x / 2);
            }
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.sprite.player.body.setAccelerationX(this.ACCELERATION / 2);
        }

        /*if(my.sprite.player.body){
            
        }
        */
        this.counter++;        
        if(this.counter == 15) {
            if(this.switch){
                this.water.setScale(0);
                this.water2.setScale(2.0);
            }
            else{    
                this.water.setScale(2.0);
                this.water2.setScale(0);
        }
    }
        if(this.counter == 30) {
            if(this.switch){
                this.decorLayer.setScale(0);
                this.water.setScale(0);
                this.water2.setScale(2.0);
            }
            else{    
                this.decorLayer.setScale(2.0);
                this.water.setScale(2.0);
                this.water2.setScale(0);
            }
            this.counter = 0;
            this.switch = !this.switch;
        }
        
    }

}