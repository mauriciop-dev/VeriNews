// VeriNews Popup Script
// Manages the popup UI and user interactions

class VeriNewsPopup {
  constructor() {
    this.verificationData = null;
    this.currentTab = 'estado';
    this.mediaRatings = {};
    this.userConfirmations = {};
  }

  async init() {
    // Load data from content script
    await this.loadVerificationData();
    
    // Setup tab switching
    this.setupTabs();
    
    // Load storage data
    await this.loadStorageData();
    
    // Render initial content
    this.render();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  async loadVerificationData() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab?.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getHeadline' });
        
        if (response) {
          this.verificationData = response;
          console.log('Verification data loaded:', this.verificationData);
        } else {
          console.warn('No verification data available');
          this.showNoDataMessage();
        }
      }
    } catch (error) {
      console.error('Error loading verification data:', error);
      this.showErrorMessage();
    }
  }

  async loadStorageData() {
    try {
      const storage = await chrome.storage.local.get(['mediaRatings', 'userConfirmations']);
      this.mediaRatings = storage.mediaRatings || {};
      this.userConfirmations = storage.userConfirmations || {};
    } catch (error) {
      console.error('Error loading storage data:', error);
    }
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    this.currentTab = tabName;
    
    // Lazy load content for specific tabs
    if (tabName === 'usuario') {
      this.renderUserTab();
    } else if (tabName === 'medios') {
      this.renderMediaTab();
    }
  }

  render() {
    if (!this.verificationData || !this.verificationData.verificationResult) {
      return;
    }
    
    const result = this.verificationData.verificationResult;
    
    // Update header status
    this.updateStatus(result);
    
    // Render Estado tab (always rendered first)
    this.renderEstadoTab(result);
    
    // Render Refuta tab
    this.renderRefutaTab(result);
  }

  updateStatus(result) {
    const statusCircle = document.getElementById('statusCircle');
    const statusLabel = document.getElementById('statusLabel');
    const statusConfidence = document.getElementById('statusConfidence');
    
    // Update circle color
    statusCircle.classList.remove('green', 'yellow', 'red');
    
    let colorClass = 'yellow';
    if (result.status === 'Confirmada') {
      colorClass = 'green';
    } else if (result.status === 'No confirmada') {
      colorClass = 'red';
    }
    
    statusCircle.classList.add(colorClass);
    
    // Update text
    statusLabel.textContent = result.status;
    
    const confidencePercent = Math.round(result.confidence * 100);
    statusConfidence.textContent = `Confianza: ${confidencePercent}% • ${result.short_reason}`;
  }

  renderEstadoTab(result) {
    // Render summary
    const summaryText = document.getElementById('summaryText');
    summaryText.textContent = result.summary || this.verificationData.content?.substring(0, 200) + '...' || 'No hay resumen disponible';
    
    // Render image
    const imageSection = document.getElementById('imageSection');
    const featuredImage = document.getElementById('featuredImage');
    
    if (this.verificationData.imageUrl) {
      featuredImage.src = this.verificationData.imageUrl;
      featuredImage.alt = this.verificationData.headline;
      imageSection.classList.remove('hidden');
    } else {
      imageSection.classList.add('hidden');
    }
    
    // Render confirming sources
    const confirmingSources = document.getElementById('confirmingSources');
    
    if (result.confirming_urls && result.confirming_urls.length > 0) {
      confirmingSources.innerHTML = '';
      
      result.confirming_urls.forEach(url => {
        const sourceItem = this.createSourceItem(url, 'confirm');
        confirmingSources.appendChild(sourceItem);
      });
    } else {
      confirmingSources.innerHTML = '<p class="empty-state">No se encontraron fuentes que confirmen esta noticia</p>';
    }
  }

  renderRefutaTab(result) {
    const refutingSources = document.getElementById('refutingSources');
    
    if (result.refuting_urls && result.refuting_urls.length > 0) {
      refutingSources.innerHTML = '';
      
      result.refuting_urls.forEach(url => {
        const sourceItem = this.createSourceItem(url, 'refute');
        refutingSources.appendChild(sourceItem);
      });
    } else {
      refutingSources.innerHTML = '<p class="empty-state">No se encontraron fuentes que refuten esta noticia</p>';
    }
    
    // Add fact-checker info
    const factCheckersList = document.getElementById('factCheckersList');
    const factCheckers = ['Snopes.com', 'FactCheck.org', 'PolitiFact', 'AFP Factual'];
    
    factCheckersList.innerHTML = '<p class="info">Se consultaron: ' + factCheckers.join(', ') + '</p>';
  }

  createSourceItem(url, type) {
    const a = document.createElement('a');
    a.className = 'source-item';
    a.href = url;
    a.target = '_blank';
    
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', `source-icon ${type}`);
    icon.setAttribute('width', '16');
    icon.setAttribute('height', '16');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'currentColor');
    
    if (type === 'confirm') {
      icon.innerHTML = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>';
    } else {
      icon.innerHTML = '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>';
    }
    
    const info = document.createElement('div');
    info.className = 'source-info';
    
    const title = document.createElement('div');
    title.className = 'source-title';
    title.textContent = this.getTitleFromUrl(url);
    
    const urlDiv = document.createElement('div');
    urlDiv.className = 'source-url';
    urlDiv.textContent = url;
    
    info.appendChild(title);
    info.appendChild(urlDiv);
    
    a.appendChild(icon);
    a.appendChild(info);
    
    return a;
  }

  getTitleFromUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  async renderUserTab() {
    const headlineComparison = document.getElementById('headlineComparison');
    
    if (!this.verificationData?.verificationResult) {
      headlineComparison.innerHTML = '<p class="empty-state">No hay datos de comparación disponibles</p>';
      return;
    }
    
    headlineComparison.innerHTML = '';
    
    // Create mock headlines from different media sources
    const mediaSources = [
      { id: 'cnn', name: 'CNN', headline: this.verificationData.headline },
      { id: 'bbc', name: 'BBC News', headline: this.verificationData.headline },
      { id: 'reuters', name: 'Reuters', headline: this.verificationData.headline }
    ];
    
    mediaSources.forEach(source => {
      const item = this.createHeadlineItem(source);
      headlineComparison.appendChild(item);
    });
  }

  createHeadlineItem(source) {
    const div = document.createElement('div');
    div.className = 'headline-item';
    
    div.innerHTML = `
      <div class="headline-header">
        <div class="headline-media">${source.name}</div>
      </div>
      <div class="headline-text">"${source.headline}"</div>
      <div class="headline-actions">
        <div class="user-confirmation">
          <button class="confirm-btn confirm" data-media="${source.id}" data-action="confirm">
            Confirmo
          </button>
          <button class="confirm-btn reject" data-media="${source.id}" data-action="reject">
            No confirmo
          </button>
        </div>
        <div class="rating-control">
          <span class="rating-label">Calificar:</span>
          ${this.createStarRating(source.id)}
        </div>
      </div>
    `;
    
    return div;
  }

  createStarRating(mediaId) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="star" data-media="${mediaId}" data-rating="${i}">★</span>`;
    }
    return html;
  }

  async renderMediaTab() {
    const mediaRatings = document.getElementById('mediaRatings');
    
    // Calculate media scores
    const mediaList = [
      { id: 'cnn', name: 'CNN' },
      { id: 'bbc', name: 'BBC News' },
      { id: 'reuters', name: 'Reuters' },
      { id: 'apnews', name: 'Associated Press' }
    ];
    
    mediaRatings.innerHTML = '';
    
    for (const media of mediaList) {
      const rating = this.mediaRatings[media.id];
      const score = rating ? rating.avg_rating : 3.5; // Default score
      const count = rating ? rating.count : 0;
      
      const item = this.createMediaItem(media, score, count);
      mediaRatings.appendChild(item);
    }
  }

  createMediaItem(media, score, count) {
    const div = document.createElement('div');
    div.className = 'media-item';
    
    const scoreClass = score >= 4 ? 'high' : score >= 3 ? 'medium' : 'low';
    
    div.innerHTML = `
      <div class="media-score ${scoreClass}">${score.toFixed(1)}</div>
      <div class="media-info">
        <div class="media-name">${media.name}</div>
        <div class="media-stats">
          ${count} valoraciones de usuarios
        </div>
      </div>
    `;
    
    return div;
  }

  setupEventListeners() {
    // Privacy link
    document.getElementById('privacyLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'privacy.html' });
    });
    
    // Delegate events for dynamic content
    document.addEventListener('click', async (e) => {
      // Confirmation buttons
      if (e.target.classList.contains('confirm-btn')) {
        const mediaId = e.target.getAttribute('data-media');
        const action = e.target.getAttribute('data-action');
        await this.handleConfirmation(mediaId, action, e.target);
      }
      
      // Star ratings
      if (e.target.classList.contains('star')) {
        const mediaId = e.target.getAttribute('data-media');
        const rating = parseInt(e.target.getAttribute('data-rating'));
        await this.handleRating(mediaId, rating, e.target);
      }
    });
  }

  async handleConfirmation(mediaId, action, button) {
    const confirmation = action === 'confirm';
    
    // Update UI
    const buttons = button.parentElement.querySelectorAll('.confirm-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Save to storage
    try {
      await chrome.runtime.sendMessage({
        action: 'getUserConfirmation',
        url: window.location.href,
        confirmation
      });
    } catch (error) {
      console.error('Error saving confirmation:', error);
    }
  }

  async handleRating(mediaId, rating, star) {
    // Update UI
    const stars = star.parentElement.querySelectorAll('.star');
    stars.forEach((s, idx) => {
      if (idx < rating) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
    
    // Save to storage
    try {
      await chrome.runtime.sendMessage({
        action: 'saveRating',
        mediaId,
        mediaName: mediaId.toUpperCase(),
        rating
      });
      
      // Update local data
      if (!this.mediaRatings[mediaId]) {
        this.mediaRatings[mediaId] = { ratings: [], count: 0, avg_rating: 0 };
      }
      this.mediaRatings[mediaId].ratings.push(rating);
      this.mediaRatings[mediaId].count++;
      this.mediaRatings[mediaId].avg_rating = 
        this.mediaRatings[mediaId].ratings.reduce((a, b) => a + b, 0) / 
        this.mediaRatings[mediaId].count;
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  }

  showNoDataMessage() {
    document.querySelector('.verinews-content').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📰</div>
        <p>No se detectó ninguna noticia en esta página.</p>
        <p style="font-size: 12px; margin-top: 8px;">Visita una página de noticias para verificar su contenido.</p>
      </div>
    `;
  }

  showErrorMessage() {
    document.querySelector('.verinews-content').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Error al cargar los datos de verificación.</p>
        <p style="font-size: 12px; margin-top: 8px;">Por favor, recarga la página e intenta de nuevo.</p>
      </div>
    `;
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const popup = new VeriNewsPopup();
  popup.init();
});
