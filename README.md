# VeriNews - Verificador de Noticias con IA

![VeriNews](icons/icon128.png)

**Extensión de Chrome para verificar noticias en tiempo real usando Chrome Built-in AI APIs**

Desarrollado para el **Google Chrome Built-in AI Challenge 2025**

## 🎯 Descripción

VeriNews es una extensión de Chrome que verifica automáticamente la veracidad de las noticias que lees en línea, utilizando las APIs de IA integradas de Chrome (Prompt API, Summarizer API, Translator API y Gemini Nano). La extensión analiza titulares, contenido y fuentes para proporcionar una evaluación instantánea de la credibilidad de las noticias.

## ✨ Características Principales

### 🚦 Sistema de Semáforo Visual
- **Verde**: Noticia confirmada por múltiples fuentes
- **Amarillo**: En proceso de confirmación
- **Rojo**: Noticia no confirmada o contradictoria

### 📊 Panel de Verificación con 4 Pestañas

#### 1. **Estado**
- Resumen automático de la noticia (Summarizer API)
- Imagen destacada de la noticia
- Lista de fuentes que confirman la información

#### 2. **Refuta**
- Fuentes que contradicen o refutan la noticia
- Verificadores de hechos consultados (Snopes, FactCheck.org, PolitiFact)

#### 3. **Usuario**
- Comparación de titulares de diferentes medios
- Sistema de confirmación personal (Confirmo / No confirmo)
- Calificación de medios (1-5 estrellas)

#### 4. **Medios**
- Ranking de credibilidad de medios
- Basado en historial de verificaciones
- Combinación de datos algorítmicos y valoraciones de usuarios

### 🤖 Tecnologías Chrome Built-in AI

1. **Prompt API**: Análisis de veracidad y búsqueda de fuentes
2. **Summarizer API**: Generación de resúmenes concisos
3. **Translator API**: Traducción automática para análisis multilingüe
4. **Gemini Nano**: Procesamiento local para mayor privacidad

## 📦 Instalación

### Requisitos Previos
- Google Chrome versión 127 o superior
- Chrome Built-in AI APIs habilitadas (Chrome Canary/Dev recomendado)

### Habilitar Chrome Built-in AI APIs

1. Abre Chrome y ve a `chrome://flags`
2. Busca y habilita los siguientes flags:
   - `#optimization-guide-on-device-model`
   - `#prompt-api-for-gemini-nano`
   - `#summarization-api-for-gemini-nano`
   - `#translation-api`
3. Reinicia Chrome

### Instalar la Extensión

1. Descarga o clona este repositorio
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el "Modo de desarrollador" (esquina superior derecha)
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `verinews-extension`
6. ¡Listo! El icono de VeriNews aparecerá en tu barra de herramientas

## 🚀 Uso

### Verificación Automática
1. Visita cualquier sitio de noticias
2. VeriNews detectará automáticamente el artículo
3. Un badge flotante aparecerá sobre el titular
4. El badge mostrará el estado de verificación (rojo/amarillo/verde)

### Panel de Análisis Detallado
1. Haz clic en el badge flotante o en el icono de la extensión
2. Se abrirá el panel con las 4 pestañas
3. Explora las fuentes, comparaciones y calificaciones
4. Participa calificando medios y confirmando noticias

### Historial de Verificaciones
- La extensión guarda las últimas 100 verificaciones
- Los datos se almacenan localmente en tu navegador
- Puedes revisar el historial en cualquier momento

## 🔧 Estructura del Proyecto

```
verinews-extension/
├── manifest.json           # Configuración de la extensión
├── popup.html             # UI principal del panel
├── privacy.html           # Política de privacidad
├── icons/                 # Iconos de la extensión
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── css/
│   ├── content.css        # Estilos del badge flotante
│   └── popup.css          # Estilos del panel
└── js/
    ├── background.js      # Service worker y APIs de IA
    ├── content.js         # Detección de noticias
    └── popup.js           # Lógica del panel
```

## 🔐 Privacidad y Seguridad

### Compromiso con la Privacidad
- **Procesamiento Local**: Prioriza Gemini Nano on-device
- **Sin Servidores Externos**: No enviamos datos a servidores propios
- **Almacenamiento Local**: Todos los datos en `chrome.storage.local`
- **Sin Seguimiento**: No rastreamos tu actividad de navegación

### Datos Almacenados Localmente
- Historial de verificaciones (últimas 100)
- Calificaciones de medios por usuario
- Confirmaciones personales de noticias
- Preferencias de idioma

### Transparencia
- Código fuente completamente abierto
- Sin analíticas de terceros
- Sin recolección de datos personales

## 🛠️ Desarrollo y Contribución

### Tecnologías Utilizadas
- **Manifest V3**: Última versión de extensiones de Chrome
- **Chrome Built-in AI APIs**: Prompt, Summarizer, Translator
- **Vanilla JavaScript**: Sin frameworks pesados
- **CSS Moderno**: Gradientes, animaciones, responsive

### Configuración de Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/tuusuario/verinews-extension.git

# Abrir en tu editor
cd verinews-extension

# Hacer cambios y probar en chrome://extensions/
```

### Testing Manual

Checklist de QA:
- [ ] Badge aparece en páginas de noticias
- [ ] Semáforo cambia según verificación
- [ ] Panel se abre al hacer clic
- [ ] 4 pestañas funcionan correctamente
- [ ] Ratings se guardan en storage
- [ ] Funciona en múltiples idiomas
- [ ] Iconos se actualizan por pestaña

## 🏆 Chrome Built-in AI Challenge 2025

Esta extensión fue creada para el **Google Chrome Built-in AI Challenge 2025** y demuestra:

1. **Uso Innovador de APIs**: Combina Prompt, Summarizer y Translator
2. **Privacidad Primero**: Procesamiento on-device con Gemini Nano
3. **Experiencia de Usuario**: Interface intuitiva con feedback visual
4. **Impacto Social**: Combate la desinformación en tiempo real
5. **Código Limpio**: Arquitectura modular y mantenible

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 🤝 Contacto y Soporte

- **Issues**: [GitHub Issues](https://github.com/tuusuario/verinews-extension/issues)
- **Email**: [email protected]
- **Devpost**: [Proyecto VeriNews](https://devpost.com/software/verinews)

## 🙏 Agradecimientos

- Google Chrome Team por las Built-in AI APIs
- Comunidad de verificadores de hechos
- Todos los beta testers

---

**VeriNews** - Verificando noticias, protegiendo la verdad 🛡️✨

*Desarrollado con ❤️ para hacer de Internet un lugar más confiable*
