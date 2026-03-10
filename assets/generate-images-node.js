const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Create placeholder images for the RPG town demo
function createPlaceholderImage(width, height, color, text = '') {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Add text if specified
    if (text) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);
    }
    
    return canvas;
}

// Save canvas as PNG file
function saveCanvasAsPNG(canvas, filename) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, filename), buffer);
    console.log(`Generated ${filename}`);
}

try {
    // Create tileset image
    const tilesetCanvas = createCanvas(256, 256);
    const tilesetCtx = tilesetCanvas.getContext('2d');

    // Grass
    tilesetCtx.fillStyle = '#4a7c59';
    tilesetCtx.fillRect(0, 0, 32, 32);
    tilesetCtx.fillStyle = '#3d6649';
    for (let i = 0; i < 5; i++) {
        tilesetCtx.fillRect(Math.random() * 32, Math.random() * 32, 2, 2);
    }

    // Dirt
    tilesetCtx.fillStyle = '#8d6e63';
    tilesetCtx.fillRect(32, 0, 32, 32);

    // Cobblestone
    tilesetCtx.fillStyle = '#757575';
    tilesetCtx.fillRect(64, 0, 32, 32);
    tilesetCtx.fillStyle = '#9e9e9e';
    for (let i = 0; i < 10; i++) {
        const x = 64 + Math.random() * 28;
        const y = 0 + Math.random() * 28;
        tilesetCtx.fillRect(x, y, 4, 4);
    }

    // Water
    tilesetCtx.fillStyle = '#1976d2';
    tilesetCtx.fillRect(96, 0, 32, 32);
    tilesetCtx.fillStyle = '#2196f3';
    for (let i = 0; i < 8; i++) {
        tilesetCtx.fillRect(96 + Math.random() * 32, 0 + Math.random() * 32, 3, 1);
    }

    // Tall grass
    tilesetCtx.fillStyle = '#66bb6a';
    tilesetCtx.fillRect(128, 0, 32, 32);
    tilesetCtx.fillStyle = '#4caf50';
    for (let i = 0; i < 15; i++) {
        tilesetCtx.fillRect(128 + Math.random() * 32, 0 + Math.random() * 32, 2, 10);
    }

    // Building roof
    tilesetCtx.fillStyle = '#5d4037';
    tilesetCtx.fillRect(0, 32, 32, 32);

    // Building wall
    tilesetCtx.fillStyle = '#8d6e63';
    tilesetCtx.fillRect(32, 32, 32, 32);

    // Door
    tilesetCtx.fillStyle = '#6d4c41';
    tilesetCtx.fillRect(64, 32, 32, 32);

    // Window
    tilesetCtx.fillStyle = '#ffeb3b';
    tilesetCtx.fillRect(96, 32, 32, 32);

    saveCanvasAsPNG(tilesetCanvas, 'tileset.png');

    saveCanvasAsPNG(createPlaceholderImage(192, 160, '#8d6e63', 'Building 1'), 'building1.png');
    saveCanvasAsPNG(createPlaceholderImage(192, 160, '#a1887f', 'Building 2'), 'building2.png');
    saveCanvasAsPNG(createPlaceholderImage(192, 160, '#6d4c41', 'Building 3'), 'building3.png');
    saveCanvasAsPNG(createPlaceholderImage(96, 128, '#4a7c59', 'Tree'), 'tree.png');
    saveCanvasAsPNG(createPlaceholderImage(64, 32, '#795548', 'Sign'), 'sign.png');
    saveCanvasAsPNG(createPlaceholderImage(64, 96, '#795548', 'Well'), 'well.png');
    saveCanvasAsPNG(createPlaceholderImage(96, 32, '#795548', 'Bench'), 'bench.png');
    saveCanvasAsPNG(createPlaceholderImage(32, 96, '#5d4037', 'Lamp'), 'streetlamp.png');

    // Character spritesheets
    const heroCanvas = createCanvas(128, 192);
    const heroCtx = heroCanvas.getContext('2d');
    ['#ff6b6b', '#4ecdc4', '#ffd166', '#6a0572'].forEach((color, index) => {
        for (let i = 0; i < 4; i++) {
            const x = i * 32;
            const y = index * 48;
            heroCtx.fillStyle = color;
            heroCtx.fillRect(x + 8, y + 24, 16, 24);
            heroCtx.fillStyle = '#fff';
            heroCtx.fillRect(x + 12, y + 8, 8, 16);
            heroCtx.fillStyle = '#000';
            heroCtx.fillRect(x + 14, y + 12, 4, 8);
        }
    });
    saveCanvasAsPNG(heroCanvas, 'hero-spritesheet.png');

    const villagerCanvas = createCanvas(128, 192);
    const villagerCtx = villagerCanvas.getContext('2d');
    ['#f06292', '#9575cd', '#4db6ac', '#81d4fa'].forEach((color, index) => {
        for (let i = 0; i < 4; i++) {
            const x = i * 32;
            const y = index * 48;
            villagerCtx.fillStyle = color;
            villagerCtx.fillRect(x + 8, y + 24, 16, 24);
            villagerCtx.fillStyle = '#fff';
            villagerCtx.fillRect(x + 12, y + 8, 8, 16);
            villagerCtx.fillStyle = '#000';
            villagerCtx.fillRect(x + 14, y + 12, 4, 8);
        }
    });
    saveCanvasAsPNG(villagerCanvas, 'villager-spritesheet.png');

    const merchantCanvas = createCanvas(128, 192);
    const merchantCtx = merchantCanvas.getContext('2d');
    ['#fff176', '#aed581', '#ffb74d', '#b39ddb'].forEach((color, index) => {
        for (let i = 0; i < 4; i++) {
            const x = i * 32;
            const y = index * 48;
            merchantCtx.fillStyle = color;
            merchantCtx.fillRect(x + 8, y + 24, 16, 24);
            merchantCtx.fillStyle = '#fff';
            merchantCtx.fillRect(x + 12, y + 8, 8, 16);
            merchantCtx.fillStyle = '#000';
            merchantCtx.fillRect(x + 14, y + 12, 4, 8);
            merchantCtx.fillStyle = '#6d4c41';
            merchantCtx.fillRect(x + 10, y + 30, 12, 16);
        }
    });
    saveCanvasAsPNG(merchantCanvas, 'merchant-spritesheet.png');

    const blacksmithCanvas = createCanvas(128, 192);
    const blacksmithCtx = blacksmithCanvas.getContext('2d');
    ['#78909c', '#546e7a', '#90a4ae', '#b0bec5'].forEach((color, index) => {
        for (let i = 0; i < 4; i++) {
            const x = i * 32;
            const y = index * 48;
            blacksmithCtx.fillStyle = color;
            blacksmithCtx.fillRect(x + 8, y + 24, 16, 24);
            blacksmithCtx.fillStyle = '#fff';
            blacksmithCtx.fillRect(x + 12, y + 8, 8, 16);
            blacksmithCtx.fillStyle = '#000';
            blacksmithCtx.fillRect(x + 14, y + 12, 4, 8);
            blacksmithCtx.fillStyle = '#ff6f00';
            blacksmithCtx.fillRect(x + 14, y + 32, 4, 8);
        }
    });
    saveCanvasAsPNG(blacksmithCanvas, 'blacksmith-spritesheet.png');

    // Door spritesheet
    const doorCanvas = createCanvas(128, 64);
    const doorCtx = doorCanvas.getContext('2d');
    doorCtx.fillStyle = '#6d4c41';
    doorCtx.fillRect(0, 0, 64, 64);
    doorCtx.fillStyle = '#4e342e';
    doorCtx.fillRect(8, 16, 48, 32);
    doorCtx.fillStyle = '#fdd835';
    doorCtx.fillRect(28, 24, 8, 8);
    doorCtx.fillRect(64, 0, 64, 64);
    doorCtx.fillStyle = '#4e342e';
    doorCtx.fillRect(72, 16, 48, 32);
    doorCtx.fillStyle = '#fdd835';
    doorCtx.fillRect(92, 24, 8, 8);
    doorCtx.fillStyle = '#000';
    doorCtx.fillRect(80, 16, 32, 32);
    saveCanvasAsPNG(doorCanvas, 'door-spritesheet.png');

    console.log('All placeholder images generated successfully!');
} catch (error) {
    console.error('Error generating images:', error);
}
