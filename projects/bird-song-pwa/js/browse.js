let currentAudio = null;
let currentButton = null;

// Utility to get favorites from localStorage
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(id) {
  const favs = new Set(getFavorites());
  if (favs.has(id)) {
    favs.delete(id);
  } else {
    favs.add(id);
  }
  localStorage.setItem('favorites', JSON.stringify([...favs]));
  renderCards(); // re-render to update heart icons
}

async function renderCards() {
  const response = await fetch('birds.json');
  const data = await response.json();
  const birds = data.birds;

  const favs = new Set(getFavorites());
  const container = document.getElementById('card-container');
  container.innerHTML = '';

  birds.forEach(bird => {
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
      <i class="favorite-icon bi ${favs.has(bird.id) ? 'bi-heart-fill filled' : 'bi-heart'}" 
         data-id="${bird.id}"></i>
    `;

    // Play audio button
    const audioBtn = card.querySelector('.audio-btn');
    const audio = new Audio(bird.audio);

    audioBtn.addEventListener('click', () => {
      // If the same button is clicked again, stop playback
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

      // Stop any previous audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentButton) {
          currentButton.classList.remove('btn-primary');
        }
      }

      // Play new audio
      currentAudio = audio;
      currentButton = audioBtn;
      audio.play();
      audioBtn.classList.add('btn-primary');

      // When audio ends, reset button style
      audio.onended = () => {
        audioBtn.classList.remove('btn-primary');
        currentAudio = null;
        currentButton = null;
      };
    });

    // Favorite toggle
    const favIcon = card.querySelector('.favorite-icon');
    favIcon.addEventListener('click', () => {
      toggleFavorite(bird.id);
    });

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderCards);