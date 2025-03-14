const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
    if (background.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    } else {
        // Wait until the image is loaded
        background.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        };
    }
}

// On change to any radio buttons, change the background
document.querySelectorAll('input[name="background"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentBackground = e.target.value;
        drawScene();
    });
});

// Draw initial background
window.onload = () => {
    document.querySelector('input[name="background"][value="nasa"]').checked = true;
    drawScene();
};