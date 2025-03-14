const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Initialize astronaut character image
const astronaut = new Image();
astronaut.src = './assets/astronaut.png';

// Initialize variable for astronaut movement
let astronautX = 50;
let astronautY = 50;

const sliderX = document.getElementById('sliderX');
const sliderY = document.getElementById('sliderY');

// Initialize all item pictures
const items = {
    'rocket': new Image(), 
    'spaceship': new Image(), 
    'planet': new Image()
};
items['rocket'].src = './assets/space-ship-svgrepo-com.svg';
items['spaceship'].src = './assets/ufo-svgrepo-com.svg';
items['planet'].src = './assets/planet-earth-svgrepo-com.svg';

// Track which pictures are visible
const visibleItems = {
    'rocket': false,
    'spaceship': false,
    'planet': false
};

// Initialize all backgrounds
const backgrounds = {
    'nasa': new Image(),
    'blue-purple': new Image(),
    'galaxy': new Image()
};
backgrounds['nasa'].src = './assets/nasa-yZygONrUBe8-unsplash.jpg';
backgrounds['blue-purple'].src = './assets/jeremy-thomas-E0AHdsENmDg-unsplash.jpg';
backgrounds['galaxy'].src = './assets/shot-by-cerqueira-0o_GEzyargo-unsplash.jpg';

let currentBackground = 'nasa';

function drawScene() {
    const background = backgrounds[currentBackground];

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Draw astronaut
        if (astronaut.complete) {
            ctx.drawImage(astronaut, astronautX, astronautY, 200, 200);
        }

        // Draw items based on visibility
        if (visibleItems['rocket'] && items['rocket'].complete) {
            ctx.drawImage(items['rocket'], 400, 100, 200, 200);
        }
        if (visibleItems['spaceship'] && items['spaceship'].complete) {
            ctx.drawImage(items['spaceship'], 300, 450, 100, 100);
        }
        if (visibleItems['planet'] && items['planet'].complete) {
            ctx.drawImage(items['planet'], 50, 200, 150, 150);
        }
    };

    if (background.complete) {
        render();
    } else {
        background.onload = render;
    }
}

// Handle background change
document.querySelectorAll('input[name="background"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentBackground = e.target.value;
        drawScene();
    });
});

// Handle toggle pictures of items
document.querySelectorAll('input[name="items"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        const itemName = checkbox.value;
        visibleItems[itemName] = checkbox.checked;
        drawScene();
    });
});

sliderX.addEventListener('input', () => {
    astronautX = parseInt(sliderX.value);
    drawScene();
});

sliderY.addEventListener('input', () => {
    astronautY = parseInt(sliderY.value);
    drawScene();
});

// Draw the initial scene
window.onload = () => {
    document.querySelector('input[name="background"][value="nasa"]').checked = true;
    drawScene();
};