# 🏗️ VeriNews - Arquitectura Técnica

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    NEWS WEBSITE                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │            Article Content                          │  │  │
│  │  │  ┌──────────────────────────────┐                  │  │  │
│  │  │  │    <h1>News Headline</h1>    │  🟢 [Badge]     │  │  │
│  │  │  │    <p>Content...</p>          │                  │  │  │
│  │  │  └──────────────────────────────┘                  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│         ▲                                      │                 │
│         │                                      │                 │
│         │ Inject Badge                        │ Extract Data    │
│         │                                      ▼                 │
│  ┌──────┴──────────────────────────────────────────────────┐   │
│  │            CONTENT SCRIPT (content.js)                   │   │
│  │  • Detect news articles                                  │   │
│  │  • Extract headline, content, image                      │   │
│  │  • Create floating badge                                 │   │
│  │  • Listen for user interactions                          │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│                             │ sendMessage                        │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │       BACKGROUND SERVICE WORKER (background.js)          │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │         VeriNewsAI Manager                         │  │   │
│  │  │  • Initialize AI APIs                              │  │   │
│  │  │  • Manage verification pipeline                    │  │   │
│  │  │  • Cache results                                   │  │   │
│  │  │  • Update extension icon                           │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────┬───────────────────┬───────────────────────────────┘   │
│         │                   │                                    │
│         │                   │                                    │
│    ┌────▼─────┐      ┌──────▼──────┐      ┌──────────────┐     │
│    │ Prompt   │      │ Summarizer  │      │ Translator   │     │
│    │   API    │      │     API     │      │     API      │     │
│    │          │      │             │      │              │     │
│    │ (Gemini  │      │ (On-Device) │      │ (On-Device)  │     │
│    │  Nano)   │      │             │      │              │     │
│    └────┬─────┘      └──────┬──────┘      └──────┬───────┘     │
│         │                   │                     │             │
│         └───────────────────┴─────────────────────┘             │
│                             │                                    │
│                             │ Results                            │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           POPUP UI (popup.html/js/css)                   │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Header: Traffic Light Status                      │  │   │
│  │  │  ┌──────┬──────┬──────┬──────┐                    │  │   │
│  │  │  │Estado│Refuta│User  │Medios│  [Tabs]            │  │   │
│  │  │  └──────┴──────┴──────┴──────┘                    │  │   │
│  │  │  ┌──────────────────────────────┐                 │  │   │
│  │  │  │  Tab Content                 │                 │  │   │
│  │  │  │  • Summary                   │                 │  │   │
│  │  │  │  • Confirming sources        │                 │  │   │
│  │  │  │  • Refuting sources          │                 │  │   │
│  │  │  │  • User ratings              │                 │  │   │
│  │  │  │  • Media scores              │                 │  │   │
│  │  │  └──────────────────────────────┘                 │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│                             │ Save/Load                          │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          chrome.storage.local                            │   │
│  │  • History (last 100 verifications)                      │   │
│  │  • Media ratings (user-provided)                         │   │
│  │  • User confirmations                                    │   │
│  │  • Preferences                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos Detallado

### 1. Detección de Noticias

```
User visits news site
       ↓
Content Script loaded (content.js)
       ↓
detectNewsArticle()
  • Check for <article> tag
  • Check og:type meta
  • Check URL patterns
  • Check for h1 element
       ↓
   [Is News?] ─── No ──→ Do nothing
       │
      Yes
       ↓
extractArticleData()
  • Headline from h1/og:title
  • Content from paragraphs
  • Image from og:image/first img
  • Language detection
       ↓
createBadge()
  • Inject floating badge
  • Position near headline
  • Show initial "verifying" state
```

### 2. Pipeline de Verificación

```
headline + content + url + lang
       ↓
sendMessage to background.js
       ↓
VeriNewsAI.verifyNews()
       │
       ├─→ Check cache
       │   └─→ If found: return cached
       │
       ├─→ [Step 1] Summarize content
       │   └─→ Summarizer API
       │       └─→ Result: 1-2 sentence summary
       │
       ├─→ [Step 2] Translate if needed
       │   └─→ Translator API
       │       └─→ Result: translated summary
       │
       ├─→ [Step 3] Verify with AI
       │   └─→ Prompt API (Gemini Nano)
       │       ├─→ Input: headline + summary + lang
       │       └─→ Output: {
       │              status: "Confirmada|En confirmación|No confirmada",
       │              confidence: 0.0-1.0,
       │              short_reason: "...",
       │              confirming_urls: [...],
       │              refuting_urls: [...]
       │           }
       │
       ├─→ [Step 4] Save to cache
       │   └─→ Map.set(url+headline, result)
       │
       ├─→ [Step 5] Save to history
       │   └─→ chrome.storage.local
       │       └─→ history array (max 100)
       │
       └─→ [Step 6] Update UI
           ├─→ Update badge color
           ├─→ Update extension icon
           └─→ Return result to content script
```

### 3. Interacción del Usuario

```
User clicks badge/icon
       ↓
Open popup.html
       ↓
popup.js loads
       ↓
loadVerificationData()
  • Request data from content script
  • Get cached verification result
       ↓
render()
  • Update traffic light
  • Show confidence score
  • Populate tabs
       ↓
User interacts
  ├─→ Switch tabs
  │   └─→ switchTab() → show/hide content
  │
  ├─→ Click "Confirmo/No confirmo"
  │   └─→ handleConfirmation()
  │       └─→ Save to chrome.storage.local
  │
  ├─→ Rate media (stars)
  │   └─→ handleRating()
  │       ├─→ Update visual stars
  │       ├─→ Save to storage
  │       └─→ Update media scores
  │
  └─→ Click source link
      └─→ Open in new tab
```

---

## Componentes Principales

### 1. manifest.json
**Propósito:** Configuración de la extensión
- Define permisos
- Registra scripts
- Configura action icon
- Declara recursos accesibles web

### 2. background.js (Service Worker)
**Propósito:** Lógica central y gestión de AI APIs
**Clases:**
- `VeriNewsAI`: Manager principal
  - `initialize()`: Setup AI capabilities
  - `verifyNews()`: Pipeline de verificación
  - `getSummarizer()`: Obtener Summarizer API
  - `getPromptSession()`: Obtener Prompt API
  - `translateText()`: Traducir con Translator API
  - `updateIcon()`: Actualizar icono por tab

### 3. content.js (Content Script)
**Propósito:** Interacción con páginas web
**Clases:**
- `VeriNewsContent`: Manager de contenido
  - `detectNewsArticle()`: Detectar si es noticia
  - `extractHeadline()`: Extraer titular
  - `extractContent()`: Extraer contenido
  - `extractImage()`: Extraer imagen
  - `createBadge()`: Crear badge flotante
  - `updateBadge()`: Actualizar estado visual

### 4. popup.html/js/css
**Propósito:** Interfaz de usuario
**Componentes:**
- Header con semáforo
- 4 pestañas navegables
- Renderizado dinámico de contenido
- Sistema de ratings y confirmaciones

### 5. chrome.storage.local
**Propósito:** Persistencia de datos
**Estructura:**
```javascript
{
  history: [
    {
      url: "https://...",
      headline: "...",
      date: "2025-10-03T...",
      status: "Confirmada",
      confidence: 0.85,
      sources_confirm: [...],
      sources_refute: [...]
    },
    // ... max 100
  ],
  mediaRatings: {
    "cnn": {
      name: "CNN",
      ratings: [5, 4, 5, 4],
      count: 4,
      avg_rating: 4.5
    },
    // ...
  },
  userConfirmations: {
    "https://...": true,  // confirmed
    "https://...": false, // rejected
    // ...
  }
}
```

---

## Chrome Built-in AI APIs

### Prompt API (Gemini Nano)
**Uso:** Análisis de veracidad
**Ventajas:**
- Procesamiento on-device
- Sin latencia de red
- Privacidad total
- Sin costos de API

**Prompt Structure:**
```
System: [Instructions for verification]
User: 
  Titular: "..."
  Resumen: "..."
  IdiomaOriginal: "es"
  IdiomaPreferido: "en"
Response: JSON with status, confidence, reason, urls
```

### Summarizer API
**Uso:** Resumir artículos largos
**Configuración:**
- Type: "tl;dr"
- Format: "plain-text"
- Length: "short"

**Beneficio:** Reduce tokens enviados a Prompt API

### Translator API
**Uso:** Traducción multilingüe
**Flujo:**
1. Detect source language
2. Check if translation available
3. Download model if needed (after-download)
4. Translate text
5. Use translated text for analysis

---

## Patrones de Diseño

### 1. Singleton
- `VeriNewsAI`: Una instancia global en background
- `VeriNewsContent`: Una instancia por página

### 2. Observer
- Message passing entre components
- Event listeners para UI interactions

### 3. Cache/Memoization
- Results cached by URL+headline
- Evita re-verificar la misma noticia

### 4. Fallback Strategy
```
Try Gemini Nano
  ↓ Failed?
Try basic analysis
  ↓ Failed?
Return "En confirmación" status
```

---

## Seguridad

### Content Security Policy
- No inline scripts
- No eval()
- Todos los recursos en archivos locales

### Permissions
Solo lo necesario:
- `activeTab`: Acceso a tab actual
- `scripting`: Inyectar content script
- `storage`: Guardar datos localmente
- `tabs`: Comunicación entre componentes
- `alarms`: (Opcional) Polling futuro

### Privacidad
- Sin analytics
- Sin tracking pixels
- Sin servidores externos
- Datos solo en dispositivo del usuario

---

## Escalabilidad

### Current Limits
- Cache: In-memory Map (ilimitado durante sesión)
- History: 100 últimas verificaciones
- Ratings: Sin límite (razonable en práctica)

### Future Improvements
- IndexedDB para cache persistente
- Worker threads para procesamiento paralelo
- Batch processing de múltiples tabs
- Sync across devices (opcional con consentimiento)

---

## Testing Strategy

### Unit Tests (Future)
- Test each function independently
- Mock Chrome APIs
- Test edge cases

### Integration Tests
- Test full verification pipeline
- Test UI interactions
- Test storage operations

### Manual Testing
- Ver TEST_CHECKLIST.md
- 38 test cases definidos

---

## Performance Metrics

### Target Metrics
- **Badge appearance:** < 500ms
- **Verification complete:** < 3s
- **Popup open:** < 200ms
- **Memory usage:** < 50MB
- **CPU usage (idle):** < 5%

### Optimization Techniques
- Lazy loading de tabs
- Debouncing de eventos
- Efficient DOM queries
- Minimal reflows

---

## Deployment

### Chrome Web Store (Future)
1. Package extension
2. Create developer account
3. Upload zip
4. Provide screenshots
5. Fill store listing
6. Submit for review

### Updates
- Manifest version increment
- Changelog update
- User notification of major changes

---

## Contribución

Ver README.md para guía de contribución.

### Architecture Decisions
Documentadas en código y este archivo.

### Future Architecture
- Plugin system for custom fact-checkers
- API para integraciones externas
- Mobile support

---

**Última actualización:** 3 de octubre de 2025
