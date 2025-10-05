// VeriNews Content Script
// Detects news articles and shows verification badge

class VeriNewsContent {
  constructor() {
    this.badge = null;
    this.verificationResult = null;
    this.headline = null;
    this.content = null;
    this.imageUrl = null;
    this.lang = null;
    this.isNewsPage = false;
  }

  init() {
    // Check if this is a news article page
    this.isNewsPage = this.detectNewsArticle();
    
    if (this.isNewsPage) {
      console.log('VeriNews: News article detected');
      this.extractArticleData();
      this.createBadge();
      this.startVerification();
    }
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getHeadline') {
        sendResponse({
          headline: this.headline,
          content: this.content,
          imageUrl: this.imageUrl,
          lang: this.lang,
          verificationResult: this.verificationResult
        });
      }
      
      if (request.action === 'updateBadge') {
        this.updateBadge(request.status);
      }
      
      return true;
    });
  }

  detectNewsArticle() {
    // Heuristics to detect if this is a news article
    const hasArticleTag = document.querySelector('article') !== null;
    const hasNewsSchema = document.querySelector('meta[property="og:type"][content*="article"]') !== null;
    const hasH1 = document.querySelector('h1') !== null;
    const hasNewsKeywords = /news|noticia|article|artículo|story|reportaje/i.test(document.title);
    
    // Check URL patterns common in news sites
    const newsUrlPattern = /\/(news|noticias|article|story|post|blog)\/|\/\d{4}\/\d{2}\//;
    const hasNewsUrl = newsUrlPattern.test(window.location.pathname);
    
    return (hasArticleTag || hasNewsSchema || hasNewsUrl) && hasH1;
  }

  extractArticleData() {
    // Extract headline
    this.headline = this.extractHeadline();
    
    // Extract content
    this.content = this.extractContent();
    
    // Extract image
    this.imageUrl = this.extractImage();
    
    // Detect language
    this.lang = this.detectLanguage();
    
    console.log('Extracted data:', { 
      headline: this.headline, 
      contentLength: this.content?.length,
      imageUrl: this.imageUrl,
      lang: this.lang
    });
  }

  extractHeadline() {
    // Priority order for headline extraction
    const selectors = [
      'h1[class*="headline"]',
      'h1[class*="title"]',
      'h1[class*="titulo"]',
      'article h1',
      'h1',
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'title'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.getAttribute('content') || element.textContent;
        if (text && text.trim().length > 10) {
          return text.trim();
        }
      }
    }
    
    return document.title;
  }

  extractContent() {
    // Try to extract article content
    const selectors = [
      'article p',
      '[class*="article-content"] p',
      '[class*="post-content"] p',
      '[itemprop="articleBody"] p',
      'meta[property="og:description"]',
      'meta[name="description"]'
    ];
    
    for (const selector of selectors) {
      if (selector.startsWith('meta')) {
        const meta = document.querySelector(selector);
        if (meta) {
          const content = meta.getAttribute('content');
          if (content && content.length > 50) {
            return content;
          }
        }
      } else {
        const paragraphs = document.querySelectorAll(selector);
        if (paragraphs.length > 0) {
          let text = '';
          paragraphs.forEach((p, idx) => {
            if (idx < 5) { // First 5 paragraphs
              text += p.textContent.trim() + ' ';
            }
          });
          if (text.length > 100) {
            return text.trim();
          }
        }
      }
    }
    
    return this.headline || '';
  }

  extractImage() {
    // Try to extract featured image
    const selectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'article img[class*="featured"]',
      'article img[class*="hero"]',
      'article img:first-of-type'
    ];
    
    for (const selector of selectors) {
      if (selector.startsWith('meta')) {
        const meta = document.querySelector(selector);
        if (meta) {
          const url = meta.getAttribute('content');
          if (url) return url;
        }
      } else {
        const img = document.querySelector(selector);
        if (img) {
          const url = img.src || img.getAttribute('data-src');
          if (url) return url;
        }
      }
    }
    
    return null;
  }

  detectLanguage() {
    // Detect page language
    const htmlLang = document.documentElement.lang;
    if (htmlLang) return htmlLang.split('-')[0];
    
    const metaLang = document.querySelector('meta[http-equiv="content-language"]');
    if (metaLang) return metaLang.getAttribute('content').split('-')[0];
    
    // Default to English
    return 'en';
  }

  createBadge() {
    // Create floating badge over the headline
    this.badge = document.createElement('div');
    this.badge.id = 'verinews-badge';
    this.badge.className = 'verinews-badge verinews-badge-yellow';
    this.badge.innerHTML = `
      <div class="verinews-badge-circle"></div>
      <span class="verinews-badge-text">En confirmación</span>
      <button class="verinews-badge-close" title="Cerrar">×</button>
    `;
    
    // Position badge near headline
    const h1 = document.querySelector('h1');
    if (h1) {
      // Insert badge before h1
      h1.parentNode.insertBefore(this.badge, h1);
      
      // Add click handler
      this.badge.addEventListener('click', (e) => {
        if (e.target.classList.contains('verinews-badge-close')) {
          this.badge.style.display = 'none';
        } else {
          // Open popup by sending message to background
          chrome.runtime.sendMessage({ action: 'openPopup' });
        }
      });
    } else {
      // Fallback: append to body
      document.body.appendChild(this.badge);
    }
  }

  updateBadge(status) {
    if (!this.badge) return;
    
    // Remove all color classes
    this.badge.classList.remove('verinews-badge-red', 'verinews-badge-yellow', 'verinews-badge-green');
    
    let color = 'yellow';
    let text = 'En confirmación';
    
    switch (status) {
      case 'Confirmada':
        color = 'green';
        text = 'Confirmada';
        break;
      case 'No confirmada':
        color = 'red';
        text = 'No confirmada';
        break;
    }
    
    this.badge.classList.add(`verinews-badge-${color}`);
    this.badge.querySelector('.verinews-badge-text').textContent = text;
  }

  async startVerification() {
    if (!this.headline) {
      console.log('VeriNews: No headline found, skipping verification');
      return;
    }
    
    try {
      // Send verification request to background
      const response = await chrome.runtime.sendMessage({
        action: 'verifyNews',
        headline: this.headline,
        content: this.content,
        url: window.location.href,
        lang: this.lang
      });
      
      if (response.success) {
        this.verificationResult = response.result;
        this.updateBadge(response.result.status);
        console.log('VeriNews: Verification complete', response.result);
      } else {
        console.error('VeriNews: Verification failed', response.error);
      }
    } catch (error) {
      console.error('VeriNews: Error during verification', error);
    }
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const veriNews = new VeriNewsContent();
    veriNews.init();
  });
} else {
  const veriNews = new VeriNewsContent();
  veriNews.init();
}
