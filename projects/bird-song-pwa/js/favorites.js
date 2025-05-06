let currentAudio = null;
let currentButton = null;

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(id) {
  const favs = new Set(getFavorites());
  favs.delete(id); // Always remove from favorites when un-clicked
  localStorage.setItem('favorites', JSON.stringify([...favs]));
  renderCards(); // Refresh cards
}

async function renderCards() {
  const response = await fetch('birds.json');
  const data = await response.json();
  const birds = data.birds;

  const favs = new Set(getFavorites());
  const container = document.getElementById('card-container');
  container.innerHTML = '';

  birds.forEach(bird => {
    if (!favs.has(bird.id)) return; // Skip non-favorited birds

    const card = document.createElement('div');
    card.className = 'card flex-row mb-3 position-relative';
    card.innerHTML = `
      <img src="${bird.image}" class="card-img-left" alt="${bird.title}">
      <div class="card-body">
        <h5 class="card-title">${bird.title}</h5>
        <p class="card-text">${bird.description}</p>
        <button class="btn btn-sm btn-outline-primary audio-btn" data-audio="${bird.audio}">
          🔊 Play
        </button>
      </div>
      <i class="favorite-icon bi bi-heart-fill filled" data-id="${bird.id}"></i>
    `;

    // Audio button logic (same as browse)
    const audioBtn = card.querySelector('.audio-btn');
    const audio = new Audio(bird.audio);

    audioBtn.addEventListener('click', () => {
      if (currentAudio && currentAudio.src === audio.src) {
        if (!currentAudio.paused) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          audioBtn.classList.remove('btn-primary');
          currentAudio = null;
          currentButton = null;
          return;
        }
      }

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentButton) {
          currentButton.classList.remove('btn-primary');
        }
      }

      currentAudio = audio;
      currentButton = audioBtn;
      audio.play();
      audioBtn.classList.add('btn-primary');

      audio.onended = () => {
        audioBtn.classList.remove('btn-primary');
        currentAudio = null;
        currentButton = null;
      };
    });

    // Remove from favorites logic
    const favIcon = card.querySelector('.favorite-icon');
    favIcon.addEventListener('click', () => {
      toggleFavorite(bird.id);
    });

    container.appendChild(card);
  });

  // If no favorites, show a message
  if (!container.hasChildNodes()) {
    container.innerHTML = '<p>You have no favorite birds yet. Go to Browse and pick some!</p>';
  }
}

document.addEventListener('DOMContentLoaded', renderCards);