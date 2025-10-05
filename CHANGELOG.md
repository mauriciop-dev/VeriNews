# Changelog

All notable changes to VeriNews will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-03

### 🎉 Initial Release - Chrome Built-in AI Challenge 2025

#### Added
- **Core Features**
  - Automatic news article detection on any website
  - Real-time verification using Chrome Built-in AI APIs
  - Visual traffic light system (🟢 🟡 🔴) for credibility status
  - Floating badge overlay on news headlines
  - Comprehensive 4-tab analysis panel:
    - Estado (Status): Summary, image, confirming sources
    - Refuta (Refute): Contradicting sources, fact-checkers
    - Usuario (User): Headline comparison, confirmations, ratings
    - Medios (Media): Credibility scores for news outlets

- **AI Integration**
  - Prompt API (Gemini Nano): On-device news verification
  - Summarizer API: Automatic article summarization
  - Translator API: Multi-language support
  - Fallback mechanisms for API unavailability

- **User Features**
  - Personal confirmation system (Confirm/Reject news)
  - 5-star rating system for media outlets
  - Media credibility tracking
  - Verification history (last 100)

- **Privacy & Security**
  - On-device processing priority
  - Local data storage (chrome.storage.local)
  - No external servers or tracking
  - No personal data collection
  - Open source codebase

- **UI/UX**
  - Smooth animations and transitions
  - Responsive design
  - Custom scrollbars
  - Gradient color schemes
  - Pulse animations on traffic light

- **Documentation**
  - Comprehensive README.md
  - Privacy Policy (privacy.html)
  - Installation guide (INSTALL.md)
  - Testing checklist (TEST_CHECKLIST.md)
  - Demo script (DEMO_SCRIPT.md)
  - Architecture documentation (ARCHITECTURE.md)
  - Devpost submission content (devpost-description.md)

#### Technical Details
- Manifest V3 compliance
- Service Worker architecture
- Content Script injection
- Message passing architecture
- Efficient caching system
- Graceful error handling

#### Browser Support
- Chrome Canary 127+
- Chrome Dev 127+
- Chrome Stable (with limitations)

#### Languages Supported
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- And any language supported by Chrome Translator API

### Known Limitations
- Chrome Built-in AI APIs are experimental
- Gemini Nano requires manual download via chrome://components/
- Some news sites with complex layouts may not be detected
- Fact-checker APIs are accessed publicly (no authentication)

### Future Enhancements (Roadmap)
See devpost-description.md for detailed roadmap.

---

## [Unreleased]

### Planned for 1.1.0
- [ ] Multimedia verification (images, videos)
- [ ] Real-time alerts for breaking news
- [ ] Network graph of source connections
- [ ] Export verification reports (PDF)
- [ ] Cross-device sync (optional)
- [ ] Enhanced fact-checker integration
- [ ] Community-driven source ratings
- [ ] Browser reading mode integration

### Planned for 1.2.0
- [ ] Sentiment analysis of articles
- [ ] Bias detection algorithm
- [ ] Historical tracking of story evolution
- [ ] Mobile Chrome support
- [ ] API for third-party integrations
- [ ] Advanced statistics dashboard

### Planned for 2.0.0
- [ ] Plugin system for custom fact-checkers
- [ ] Machine learning improvements
- [ ] Context-aware analysis
- [ ] Professional fact-checker partnerships
- [ ] Premium features (optional)

---

## Development Notes

### Version Numbering
- **Major (X.0.0):** Breaking changes, major new features
- **Minor (1.X.0):** New features, backwards compatible
- **Patch (1.0.X):** Bug fixes, minor improvements

### Release Process
1. Update CHANGELOG.md
2. Update version in manifest.json
3. Test thoroughly (TEST_CHECKLIST.md)
4. Tag release in git
5. Create GitHub release
6. Submit to Chrome Web Store (when ready)

### Contributing
See README.md for contribution guidelines.

---

## License
MIT License - See LICENSE file for details

## Acknowledgments
- Google Chrome Team for Built-in AI APIs
- Fact-checking organizations worldwide
- Open source community
- Beta testers and early adopters

---

**VeriNews** - Verificando noticias, protegiendo la verdad 🛡️✨

For support: [email protected]
GitHub: https://github.com/tuusuario/verinews-extension
Devpost: https://devpost.com/software/verinews
