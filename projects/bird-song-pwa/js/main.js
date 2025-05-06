if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .catch(console.error);
  }
  
  function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }
  function toggleFavorite(id) {
    const favs = new Set(getFavorites());
    if (favs.has(id)) favs.delete(id);
    else favs.add(id);
    localStorage.setItem('favorites', JSON.stringify([...favs]));
  }
  
  async function renderCards({ onlyFavorites = false } = {}) {
    const data = await fetch('/birds.json').then(r => r.json());
    const birds = data.birds;
    const container = document.getElementById('card-container');
    container.innerHTML = '';
  
    const favs = new Set(getFavorites());
    birds.forEach(bird => {
      if (onlyFavorites && !favs.has(bird.id)) return;
  
      const card = document.createElement('div');
      card.className = 'card flex-row';
      card.innerHTML = `
        <img src="${bird.image}" class="card-img-left" alt="${bird.title}">
        <div class="card-body">
          <h5>${bird.title}</h5>
          <p>${bird.description}</p>
          <button class="btn btn-sm btn-outline-primary audio-btn">🔊 Play</button>
        </div>
        <i class="favorite-icon bi ${favs.has(bird.id) ? 'bi-heart-fill filled' : 'bi-heart'}"></i>
      `;
  
      // audio
      const audio = new Audio(bird.audio);
      card.querySelector('.audio-btn')
        .addEventListener('click', () => audio.play());
  
      // favorite toggle
      const icon = card.querySelector('.favorite-icon');
      icon.addEventListener('click', () => {
        toggleFavorite(bird.id);
        icon.classList.toggle('filled');
        icon.classList.toggle('bi-heart-fill');
        icon.classList.toggle('bi-heart');
      });
  
      container.appendChild(card);
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if (location.pathname.endsWith('browse.html')) {
      renderCards();
    } else if (location.pathname.endsWith('favorites.html')) {
      renderCards({ onlyFavorites: true });
    }
  });  

  let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn?.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      deferredPrompt = null;
    });
  }
});
