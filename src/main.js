import Phaser from 'phaser';

// Game Config
const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 720,
    parent: 'gameCanvas',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: false,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            tileBias: 40
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#1a1412'
};

// Global Variables
let game;
let player;
let cursors;
let keys;
let map;
let tileset;
let groundLayer;
let buildingLayer;
let npcLayer;
let lightingEnabled = true;
let timeOfDay = 'dusk';
let lightingColor = 0x4a2c1a;
let ambienceSound;
let footstepsSound;

// Preload Assets
function preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.image('building1', 'assets/building1.png');
    this.load.image('building2', 'assets/building2.png');
    this.load.image('building3', 'assets/building3.png');
    this.load.image('tree', 'assets/tree.png');
    this.load.image('sign', 'assets/sign.png');
    this.load.image('well', 'assets/well.png');
    this.load.image('bench', 'assets/bench.png');
    this.load.image('streetlamp', 'assets/streetlamp.png');
    this.load.spritesheet('hero', 'assets/hero-spritesheet.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.spritesheet('villager', 'assets/villager-spritesheet.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.spritesheet('merchant', 'assets/merchant-spritesheet.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.spritesheet('blacksmith', 'assets/blacksmith-spritesheet.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.spritesheet('door', 'assets/door-spritesheet.png', {
        frameWidth: 64,
        frameHeight: 64
    });
    this.load.audio('ambience', 'assets/ambience.mp3');
    this.load.audio('footsteps', 'assets/footsteps.wav');
    this.load.audio('door', 'assets/door.wav');
    this.load.audio('chime', 'assets/chime.wav');
}

// Create Game World
function create() {
    // Create Town Map
    map = this.make.tilemap({ key: null, tileWidth: 32, tileHeight: 32, width: 60, height: 40 });
    tileset = map.addTilesetImage('tiles');
    
    groundLayer = map.createBlankLayer('ground', tileset, 0, 0, 60, 40);
    buildingLayer = map.createBlankLayer('buildings', tileset, 0, 0, 60, 40);
    npcLayer = map.createBlankLayer('npcs', tileset, 0, 0, 60, 40);
    
    // Generate Ground
    for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
            let isGrass = true;
            if (x > 15 && x < 45 && y > 10 && y < 30) {
                isGrass = false;
                if (y > 18 && y < 22) {
                    groundLayer.putTileAt(2, x, y); // Cobblestone path
                } else {
                    groundLayer.putTileAt(1, x, y); // Dirt
                }
            } else if (x === 0 || x === map.width - 1 || y === 0 || y === map.height - 1) {
                groundLayer.putTileAt(4, x, y); // Water
            } else {
                if (Math.random() < 0.1) {
                    groundLayer.putTileAt(5, x, y); // Tall grass
                } else {
                    groundLayer.putTileAt(0, x, y); // Grass
                }
            }
        }
    }
    
    // Add Buildings
    const buildings = [
        { x: 20, y: 12, width: 8, height: 6, type: 'house', name: 'Mayor\'s Residence' },
        { x: 32, y: 12, width: 8, height: 6, type: 'shop', name: 'General Store' },
        { x: 20, y: 22, width: 8, height: 6, type: 'blacksmith', name: 'Smithy' },
        { x: 32, y: 22, width: 8, height: 6, type: 'tavern', name: 'The Rusty Tankard' },
        { x: 10, y: 16, width: 6, height: 5, type: 'house', name: 'Hobbit House' },
        { x: 44, y: 16, width: 6, height: 5, type: 'house', name: 'Weaver\'s Cottage' }
    ];
    
    buildings.forEach(building => {
        const buildingImage = this.add.image(
            (building.x + building.width / 2) * 32, 
            (building.y + building.height / 2) * 32, 
            `building${Phaser.Math.Between(1, 3)}`
        );
        buildingImage.setScale(building.width / 6, building.height / 5);
        buildingImage.setOrigin(0.5);
    });
    
    // Add Streetlamps
    for (let i = 0; i < 8; i++) {
        const x = 20 + i * 4;
        const streetlamp = this.add.image(x * 32, 20 * 32, 'streetlamp');
        streetlamp.setDepth(10);
        streetlamp.setScale(0.8);
    }
    
    // Add Trees
    for (let i = 0; i < 15; i++) {
        const treeX = Phaser.Math.Between(2, 58) * 32;
        const treeY = Phaser.Math.Between(2, 38) * 32;
        if ((treeX < 15 * 32 || treeX > 45 * 32) || (treeY < 10 * 32 || treeY > 30 * 32)) {
            const tree = this.add.image(treeX, treeY, 'tree');
            tree.setScale(Phaser.Math.FloatBetween(0.8, 1.2));
        }
    }
    
    // Add Well
    const well = this.add.image(28 * 32, 20 * 32, 'well');
    well.setDepth(5);
    well.setInteractive();
    well.on('pointerdown', () => {
        showInteractionText('The well has pure spring water');
    });
    
    // Add Bench
    const bench = this.add.image(32 * 32, 20 * 32, 'bench');
    bench.setDepth(5);
    
    // Add Sign
    const sign = this.add.image(22 * 32, 22 * 32, 'sign');
    sign.setDepth(5);
    sign.setInteractive();
    sign.on('pointerdown', () => {
        showInteractionText('Welcome to Oakhaven Village');
    });
    
    // Create Player
    player = this.physics.add.sprite(30 * 32, 25 * 32, 'hero');
    player.setSize(16, 24);
    player.setOffset(8, 24);
    player.setDepth(100);
    player.speed = 150;
    
    // Create Animation Frames
    this.anims.create({
        key: 'hero-walk-down',
        frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });
    
    this.anims.create({
        key: 'hero-walk-left',
        frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
    });
    
    this.anims.create({
        key: 'hero-walk-right',
        frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1
    });
    
    this.anims.create({
        key: 'hero-walk-up',
        frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
        frameRate: 8,
        repeat: -1
    });
    
    // Create NPCs
    const npcs = [
        { x: 24, y: 18, type: 'villager', name: 'Elder Thomas', dialog: 'Ah, young adventurer! Welcome to Oakhaven. The town has seen better days...' },
        { x: 36, y: 18, type: 'merchant', name: 'Seren', dialog: 'Fresh fruits and vegetables! Straight from the farms!' },
        { x: 24, y: 26, type: 'blacksmith', name: 'Goran', dialog: 'Need a sword sharpened? Armor repaired? I\'m your man!' },
        { x: 36, y: 26, type: 'villager', name: 'Lila', dialog: 'Have you seen my cat? She wandered off this morning...' },
        { x: 15, y: 20, type: 'villager', name: 'Hobbes', dialog: 'Welcome to my humble home! Would you like some tea?' },
        { x: 45, y: 20, type: 'villager', name: 'Mara', dialog: 'The textiles I weave are the finest in the kingdom!' }
    ];
    
    npcs.forEach(npcData => {
        const npc = this.physics.add.sprite(npcData.x * 32, npcData.y * 32, npcData.type);
        npc.setSize(16, 24);
        npc.setOffset(8, 24);
        npc.setDepth(50);
        npc.name = npcData.name;
        npc.dialog = npcData.dialog;
        npc.setInteractive();
        npc.on('pointerdown', () => {
            showInteractionText(npc.dialog, npc.name);
        });
    });
    
    // Create Doors
    const doors = [
        { x: 24, y: 17, building: 'Mayor\'s Residence' },
        { x: 36, y: 17, building: 'General Store' },
        { x: 24, y: 26, building: 'Smithy' },
        { x: 36, y: 26, building: 'The Rusty Tankard' },
        { x: 13, y: 20, building: 'Hobbit House' },
        { x: 47, y: 20, building: 'Weaver\'s Cottage' }
    ];
    
    doors.forEach(doorData => {
        const door = this.add.image(doorData.x * 32, doorData.y * 32, 'door');
        door.setDepth(10);
        door.setInteractive();
        door.on('pointerdown', () => {
            showInteractionText(`Enter ${doorData.building}?`, 'Door');
        });
    });
    
    // Input
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        l: Phaser.Input.Keyboard.KeyCodes.L,
        esc: Phaser.Input.Keyboard.KeyCodes.ESC
    });
    
    // Camera
    this.cameras.main.setBounds(0, 0, map.width * 32, map.height * 32);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.2);
    
    // Lighting System
    const lightingLayer = this.add.graphics();
    lightingLayer.setDepth(1000);
    lightingLayer.fillStyle(lightingColor, 0.6);
    lightingLayer.fillRect(0, 0, map.width * 32, map.height * 32);
    
    // Create Streetlamp Lights
    for (let i = 0; i < 8; i++) {
        const x = 20 + i * 4;
        const light = this.add.circle(x * 32, 20 * 32, 150, 0xffd700);
        light.setAlpha(0.3);
        light.setDepth(999);
        light.setBlendMode(Phaser.BlendModes.ADD);
    }
    
    // Create House Lights
    buildings.forEach(building => {
        const light = this.add.circle(
            (building.x + building.width / 2) * 32, 
            (building.y + building.height / 2) * 32,
            100, 
            0xffd700
        );
        light.setAlpha(0.2);
        light.setDepth(999);
        light.setBlendMode(Phaser.BlendModes.ADD);
    });
    
    // Create Torches
    const torchPositions = [
        { x: 22, y: 17 },
        { x: 38, y: 17 },
        { x: 22, y: 26 },
        { x: 38, y: 26 }
    ];
    
    torchPositions.forEach(pos => {
        const torch = this.add.circle(pos.x * 32, pos.y * 32, 80, 0xff6600);
        torch.setAlpha(0.4);
        torch.setDepth(999);
        torch.setBlendMode(Phaser.BlendModes.ADD);
    });
    
    // Sound Effects
    ambienceSound = this.sound.add('ambience', { loop: true, volume: 0.3 });
    footstepsSound = this.sound.add('footsteps', { loop: true, volume: 0.2 });
    if (this.sound.get('ambience')) {
        ambienceSound.play().catch(() => {});
    }
    
    // UI Elements
    createUI(this);
}

// Create UI
function createUI(scene) {
    // Interaction Text
    scene.interactionText = scene.add.text(600, 650, '', {
        fontFamily: 'Crimson Text',
        fontSize: '18px',
        color: '#e8dcc8',
        align: 'center',
        wordWrap: { width: 400, useAdvancedWrap: true }
    });
    scene.interactionText.setOrigin(0.5);
    scene.interactionText.setDepth(2000);
    scene.interactionText.visible = false;
    
    // Name Tag
    scene.nameTag = scene.add.text(600, 620, '', {
        fontFamily: 'Cinzel',
        fontSize: '14px',
        color: '#d4af37',
        fontWeight: 'bold',
        align: 'center'
    });
    scene.nameTag.setOrigin(0.5);
    scene.nameTag.setDepth(2000);
    scene.nameTag.visible = false;
    
    // Lighting Toggle Button
    scene.lightingButton = scene.add.text(1050, 20, '⚫ Lighting', {
        fontFamily: 'Cinzel',
        fontSize: '16px',
        color: '#d4af37',
        align: 'right'
    });
    scene.lightingButton.setOrigin(1, 0);
    scene.lightingButton.setDepth(2000);
    scene.lightingButton.setInteractive();
    scene.lightingButton.on('pointerdown', () => {
        toggleLighting(scene);
    });
}

// Update
function update() {
    // Player Movement
    let velocityX = 0;
    let velocityY = 0;
    
    if (cursors.up.isDown || keys.w.isDown) velocityY = -player.speed;
    if (cursors.down.isDown || keys.s.isDown) velocityY = player.speed;
    if (cursors.left.isDown || keys.a.isDown) velocityX = -player.speed;
    if (cursors.right.isDown || keys.d.isDown) velocityX = player.speed;
    
    player.setVelocity(velocityX, velocityY);
    
    // Animation
    if (velocityX !== 0 || velocityY !== 0) {
        if (footstepsSound && !footstepsSound.isPlaying) {
            footstepsSound.play().catch(() => {});
        }
        
        if (velocityX > 0) player.anims.play('hero-walk-right', true);
        else if (velocityX < 0) player.anims.play('hero-walk-left', true);
        else if (velocityY > 0) player.anims.play('hero-walk-down', true);
        else if (velocityY < 0) player.anims.play('hero-walk-up', true);
    } else {
        if (footstepsSound) footstepsSound.pause();
        player.anims.stop();
        // Set idle frame based on last direction
        const frame = player.anims.currentAnim ? player.anims.currentAnim.name.split('-')[2] : 'down';
        player.setFrame({
            'down': 0,
            'up': 12,
            'left': 4,
            'right': 8
        }[frame]);
    }
    
    // Lighting Toggle
    if (Phaser.Input.Keyboard.JustDown(keys.l)) {
        toggleLighting(this);
    }
    
    // Fullscreen Toggle
    if (Phaser.Input.Keyboard.JustDown(keys.esc)) {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

// Toggle Lighting
function toggleLighting(scene) {
    lightingEnabled = !lightingEnabled;
    scene.lightingButton.setText(lightingEnabled ? '⚫ Lighting' : '⚪ Lighting');
    const alpha = lightingEnabled ? 0.6 : 0;
    scene.children.list.forEach(child => {
        if (child instanceof Phaser.GameObjects.Graphics || 
            child instanceof Phaser.GameObjects.Circle) {
            child.setAlpha(alpha * child.alpha / 0.6);
        }
    });
}

// Show Interaction Text
function showInteractionText(text, name = '') {
    const scene = game.scene.scenes[0];
    scene.interactionText.setText(text);
    scene.interactionText.visible = true;
    scene.nameTag.setText(name);
    scene.nameTag.visible = name !== '';
    
    scene.time.delayedCall(3000, () => {
        scene.interactionText.visible = false;
        scene.nameTag.visible = false;
    });
}

// Initialize Game
game = new Phaser.Game(config);
