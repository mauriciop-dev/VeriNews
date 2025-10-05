// VeriNews Background Service Worker
// Handles Chrome Built-in AI APIs and verification logic

class VeriNewsAI {
  constructor() {
    this.promptSession = null;
    this.summarizerSession = null;
    this.translatorSession = null;
    this.cache = new Map();
  }

  async initialize() {
    try {
      // Initialize AI capabilities
      await this.checkAICapabilities();
    } catch (error) {
      console.error('AI initialization error:', error);
    }
  }

  async checkAICapabilities() {
    // Check for Prompt API
    if ('ai' in self && 'languageModel' in self.ai) {
      const capabilities = await self.ai.languageModel.capabilities();
      console.log('Prompt API available:', capabilities.available);
    }

    // Check for Summarizer API
    if ('ai' in self && 'summarizer' in self.ai) {
      const capabilities = await self.ai.summarizer.capabilities();
      console.log('Summarizer API available:', capabilities.available);
    }

    // Check for Translator API
    if ('translation' in self) {
      console.log('Translator API available');
    }
  }

  async getSummarizer() {
    if (!this.summarizerSession) {
      if ('ai' in self && 'summarizer' in self.ai) {
        this.summarizerSession = await self.ai.summarizer.create({
          type: 'tl;dr',
          format: 'plain-text',
          length: 'short'
        });
      }
    }
    return this.summarizerSession;
  }

  async getPromptSession() {
    if (!this.promptSession) {
      if ('ai' in self && 'languageModel' in self.ai) {
        this.promptSession = await self.ai.languageModel.create({
          systemPrompt: `Eres un verificador de noticias conciso y preciso. Recibe un titular y un breve contenido y devuelve:
- status: one of ["Confirmada","En confirmación","No confirmada"]
- confidence: decimal between 0 and 1
- short_reason: 1-2 sentences explaining por qué
- confirming_urls: up to 5 URLs que confirmen la misma información (si las hay)
- refuting_urls: up to 5 URLs que refuten o presenten versiones contradictorias

Responde SIEMPRE en formato JSON válido.`
        });
      }
    }
    return this.promptSession;
  }

  async summarizeText(text) {
    try {
      const summarizer = await this.getSummarizer();
      if (summarizer) {
        const summary = await summarizer.summarize(text);
        return summary;
      }
      // Fallback: extract first 200 chars
      return text.substring(0, 200) + '...';
    } catch (error) {
      console.error('Summarization error:', error);
      return text.substring(0, 200) + '...';
    }
  }

  async translateText(text, sourceLang, targetLang) {
    try {
      if ('translation' in self) {
        const canTranslate = await self.translation.canTranslate({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang
        });
        
        if (canTranslate === 'readily' || canTranslate === 'after-download') {
          const translator = await self.translation.createTranslator({
            sourceLanguage: sourceLang,
            targetLanguage: targetLang
          });
          
          if (canTranslate === 'after-download') {
            await translator.ready;
          }
          
          return await translator.translate(text);
        }
      }
      return text; // Return original if translation not available
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  async verifyNews(headline, content, url, lang = 'en') {
    try {
      // Check cache
      const cacheKey = `${url}_${headline}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Step 1: Summarize if content is long
      let summary = content;
      if (content.length > 500) {
        summary = await this.summarizeText(content);
      }

      // Step 2: Translate if needed
      const browserLang = chrome.i18n.getUILanguage().split('-')[0];
      if (lang !== browserLang && lang !== 'en') {
        summary = await this.translateText(summary, lang, browserLang);
      }

      // Step 3: Get verification from Prompt API
      const promptSession = await this.getPromptSession();
      
      const prompt = `Titular: "${headline}"
Resumen: "${summary}"
IdiomaOriginal: "${lang}"
IdiomaPreferido: "${browserLang}"

Responde en JSON con:
{
  "status": "Confirmada|En confirmación|No confirmada",
  "confidence": 0.0-1.0,
  "short_reason": "Una o dos oraciones",
  "confirming_urls": ["https://..."],
  "refuting_urls": ["https://..."]
}`;

      let result;
      if (promptSession) {
        const response = await promptSession.prompt(prompt);
        
        // Try to parse JSON from response
        try {
          // Extract JSON from response (might have markdown formatting)
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          // Fallback result
          result = this.createFallbackResult(headline);
        }
      } else {
        // Fallback if Prompt API not available
        result = this.createFallbackResult(headline);
      }

      // Normalize and validate result
      result = this.normalizeResult(result);
      
      // Cache result
      this.cache.set(cacheKey, result);
      
      // Store in history
      await this.saveToHistory(url, headline, result);
      
      return result;
    } catch (error) {
      console.error('Verification error:', error);
      return this.createFallbackResult(headline);
    }
  }

  createFallbackResult(headline) {
    return {
      status: 'En confirmación',
      confidence: 0.5,
      short_reason: 'Verificación en proceso. Las APIs de AI no están disponibles o la noticia requiere verificación manual.',
      confirming_urls: [],
      refuting_urls: [],
      summary: headline
    };
  }

  normalizeResult(result) {
    // Ensure all required fields exist
    return {
      status: result.status || 'En confirmación',
      confidence: typeof result.confidence === 'number' ? result.confidence : 0.5,
      short_reason: result.short_reason || 'Verificación completada',
      confirming_urls: Array.isArray(result.confirming_urls) ? result.confirming_urls : [],
      refuting_urls: Array.isArray(result.refuting_urls) ? result.refuting_urls : [],
      summary: result.summary || ''
    };
  }

  async saveToHistory(url, headline, result) {
    try {
      const storage = await chrome.storage.local.get(['history']);
      let history = storage.history || [];
      
      history.unshift({
        url,
        headline,
        date: new Date().toISOString(),
        status: result.status,
        confidence: result.confidence,
        sources_confirm: result.confirming_urls,
        sources_refute: result.refuting_urls
      });
      
      // Keep only last 100
      if (history.length > 100) {
        history = history.slice(0, 100);
      }
      
      await chrome.storage.local.set({ history });
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  getStatusColor(status) {
    switch (status) {
      case 'Confirmada':
        return 'green';
      case 'No confirmada':
        return 'red';
      case 'En confirmación':
      default:
        return 'yellow';
    }
  }

  async updateIcon(tabId, status) {
    const color = this.getStatusColor(status);
    const iconPaths = {
      green: {
        '16': 'icons/icon16.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png'
      },
      yellow: {
        '16': 'icons/icon16.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png'
      },
      red: {
        '16': 'icons/icon16.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png'
      }
    };

    try {
      await chrome.action.setIcon({
        tabId,
        path: iconPaths[color]
      });
      
      // Set badge
      await chrome.action.setBadgeText({
        tabId,
        text: color === 'green' ? '✓' : color === 'red' ? '✗' : '?'
      });
      
      await chrome.action.setBadgeBackgroundColor({
        tabId,
        color: color === 'green' ? '#4CAF50' : color === 'red' ? '#F44336' : '#FFC107'
      });
    } catch (error) {
      console.error('Error updating icon:', error);
    }
  }
}

// Initialize AI manager
const aiManager = new VeriNewsAI();
aiManager.initialize();

// Message handlers
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'verifyNews') {
    const { headline, content, url, lang } = request;
    
    aiManager.verifyNews(headline, content, url, lang)
      .then(result => {
        // Update icon
        if (sender.tab?.id) {
          aiManager.updateIcon(sender.tab.id, result.status);
        }
        sendResponse({ success: true, result });
      })
      .catch(error => {
        console.error('Verification error:', error);
        sendResponse({ 
          success: false, 
          error: error.message,
          result: aiManager.createFallbackResult(headline)
        });
      });
    
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'getVerification') {
    // Return cached verification for current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { action: 'getHeadline' }, (response) => {
          if (response) {
            sendResponse(response);
          }
        });
      }
    });
    return true;
  }

  if (request.action === 'saveRating') {
    const { mediaId, mediaName, rating } = request;
    
    chrome.storage.local.get(['mediaRatings'], (storage) => {
      let ratings = storage.mediaRatings || {};
      
      if (!ratings[mediaId]) {
        ratings[mediaId] = {
          name: mediaName,
          ratings: [],
          avg_rating: 0,
          count: 0
        };
      }
      
      ratings[mediaId].ratings.push(rating);
      ratings[mediaId].count = ratings[mediaId].ratings.length;
      ratings[mediaId].avg_rating = ratings[mediaId].ratings.reduce((a, b) => a + b, 0) / ratings[mediaId].count;
      
      chrome.storage.local.set({ mediaRatings: ratings }, () => {
        sendResponse({ success: true });
      });
    });
    
    return true;
  }

  if (request.action === 'getUserConfirmation') {
    const { url, confirmation } = request;
    
    chrome.storage.local.get(['userConfirmations'], (storage) => {
      let confirmations = storage.userConfirmations || {};
      confirmations[url] = confirmation;
      
      chrome.storage.local.set({ userConfirmations: confirmations }, () => {
        sendResponse({ success: true });
      });
    });
    
    return true;
  }
});

// Tab update listener to reset icon
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Reset icon to default
    chrome.action.setBadgeText({ tabId, text: '' });
  }
});

console.log('VeriNews background service worker initialized');
