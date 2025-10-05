# ✅ VeriNews - Test Checklist

## Pre-Testing Setup

- [ ] Chrome Canary/Dev instalado (versión 127+)
- [ ] Flags de AI habilitados en `chrome://flags`
- [ ] Gemini Nano descargado (verificar en `chrome://components/`)
- [ ] Extensión cargada en `chrome://extensions/`
- [ ] Modo desarrollador activado

---

## 1. Detección Automática de Noticias

### Test 1.1: Sitios en Inglés
- [ ] Abrir https://www.bbc.com/news
- [ ] Badge aparece sobre el titular principal
- [ ] Badge muestra estado "En confirmación"
- [ ] Color inicial es amarillo

### Test 1.2: Sitios en Español
- [ ] Abrir https://elpais.com
- [ ] Badge detecta titular en español
- [ ] Verificación funciona en español

### Test 1.3: Sitios en otros idiomas
- [ ] Abrir https://www.lemonde.fr (francés)
- [ ] Badge aparece
- [ ] Traducción automática funciona

### Test 1.4: Páginas NO noticias
- [ ] Abrir https://www.google.com
- [ ] Badge NO aparece (correcto)
- [ ] Abrir https://www.wikipedia.org
- [ ] Badge NO aparece en homepage

---

## 2. Verificación con AI

### Test 2.1: Verificación Completa
- [ ] Abrir artículo de noticias
- [ ] Esperar 2-3 segundos
- [ ] Semáforo cambia de amarillo a verde/rojo
- [ ] Confianza % se muestra

### Test 2.2: Análisis de Contenido
- [ ] Verificar que se extraiga el titular correcto
- [ ] Verificar que se extraiga contenido del artículo
- [ ] Imagen destacada se detecta (si existe)

### Test 2.3: Fallback sin AI
- [ ] Deshabilitar flag de Prompt API
- [ ] Recargar extensión
- [ ] Badge sigue funcionando con mensaje fallback

---

## 3. Popup Panel

### Test 3.1: Apertura del Panel
- [ ] Click en badge flotante → popup se abre
- [ ] Click en icono de extensión → popup se abre
- [ ] Dimensiones: 500px ancho, ~600px alto
- [ ] Las 4 pestañas son visibles

### Test 3.2: Tab Estado
- [ ] Resumen de 1-2 oraciones visible
- [ ] Imagen destacada aparece (si existe)
- [ ] Lista de fuentes confirman
- [ ] Enlaces son clicables
- [ ] Enlaces abren en nueva pestaña

### Test 3.3: Tab Refuta
- [ ] Fuentes contradictorias listadas
- [ ] Iconos X rojos visibles
- [ ] Fact-checkers mencionados
- [ ] Si no hay fuentes: mensaje apropiado

### Test 3.4: Tab Usuario
- [ ] 3 titulares comparativos visibles
- [ ] Botones "Confirmo / No confirmo" funcionan
- [ ] Estrellas de rating funcionan
- [ ] Estado activo se guarda visualmente

### Test 3.5: Tab Medios
- [ ] 4+ medios listados
- [ ] Scores visibles (1.0-5.0)
- [ ] Colores apropiados:
  - Verde: score ≥ 4
  - Amarillo: 3 ≤ score < 4
  - Rojo: score < 3

---

## 4. Interactividad

### Test 4.1: Confirmaciones de Usuario
- [ ] Click "Confirmo" → botón se marca activo
- [ ] Click "No confirmo" → botón se marca activo
- [ ] Estado se guarda en chrome.storage.local
- [ ] Reabrir popup → estado persistido

### Test 4.2: Ratings de Medios
- [ ] Click en estrella → estrellas se llenan hasta esa posición
- [ ] Rating se guarda en storage
- [ ] Reabrir popup → rating persiste
- [ ] Tab Medios refleja nuevo average

### Test 4.3: Navegación de Tabs
- [ ] Click cada tab → contenido cambia
- [ ] Animación fade-in funciona
- [ ] Tab activo marcado con color
- [ ] Línea inferior azul en tab activo

---

## 5. Storage y Persistencia

### Test 5.1: Historial
- [ ] Verificar 5+ noticias diferentes
- [ ] Abrir Chrome DevTools
- [ ] Ir a Application → Storage → Local Storage
- [ ] Verificar key "history" existe
- [ ] Array contiene últimas verificaciones
- [ ] Máximo 100 entradas

### Test 5.2: Ratings de Medios
- [ ] Calificar 3+ medios
- [ ] Verificar key "mediaRatings" en storage
- [ ] Contiene: avg_rating, count, ratings array
- [ ] Datos persisten después de cerrar Chrome

### Test 5.3: Limpieza de Storage
- [ ] Desinstalar extensión
- [ ] Reinstalar
- [ ] Storage vacío (datos eliminados)

---

## 6. Multilingüe

### Test 6.1: Detección de Idioma
- [ ] Página en inglés → lang detectado: "en"
- [ ] Página en español → lang detectado: "es"
- [ ] Página en francés → lang detectado: "fr"

### Test 6.2: Traducción Automática
- [ ] Artículo en francés, navegador en inglés
- [ ] Translator API invocada
- [ ] Análisis en inglés (traducido)
- [ ] UI muestra idioma original

---

## 7. Performance

### Test 7.1: Velocidad de Verificación
- [ ] Tiempo desde detección hasta resultado: < 3 segundos
- [ ] Badge aparece: < 500ms
- [ ] Popup abre: < 200ms

### Test 7.2: Impacto en Navegación
- [ ] Scroll suave (sin lag)
- [ ] Carga de página no afectada significativamente
- [ ] CPU usage razonable (< 10% en idle)

### Test 7.3: Múltiples Tabs
- [ ] Abrir 5 tabs con noticias
- [ ] Cada tab verifica independientemente
- [ ] No hay conflictos entre tabs

---

## 8. UI/UX

### Test 8.1: Badge Flotante
- [ ] Posicionado sobre/cerca del titular
- [ ] No obstruye contenido importante
- [ ] Animación pulse suave
- [ ] Hover efecto funciona
- [ ] Botón cerrar (×) funciona

### Test 8.2: Diseño Responsive
- [ ] Popup se ve bien en diferentes resoluciones
- [ ] Scroll funciona si contenido es largo
- [ ] Scrollbar personalizada visible
- [ ] Contenido no se corta

### Test 8.3: Accesibilidad
- [ ] Colores tienen buen contraste
- [ ] Textos legibles (tamaño mínimo 12px)
- [ ] Iconos tienen significado claro
- [ ] Tooltips informativos

---

## 9. Edge Cases

### Test 9.1: Sin Internet
- [ ] Deshabilitar conexión
- [ ] Verificación usa solo cache/on-device
- [ ] Mensaje apropiado si no hay datos

### Test 9.2: APIs No Disponibles
- [ ] Simular flag deshabilitado
- [ ] Fallback a procesamiento básico
- [ ] Usuario informado apropiadamente

### Test 9.3: Contenido Inusual
- [ ] Artículo muy corto (< 100 chars)
- [ ] Artículo muy largo (> 10,000 chars)
- [ ] Sin imagen destacada
- [ ] Titular en MAYÚSCULAS

### Test 9.4: Sitios Complejos
- [ ] Sitios con paywall
- [ ] Sitios con CAPTCHA
- [ ] Sitios con lazy loading
- [ ] Single-page applications (SPA)

---

## 10. Seguridad y Privacidad

### Test 10.1: No Data Leaks
- [ ] Abrir Chrome DevTools → Network
- [ ] Verificar no hay requests a servidores externos
- [ ] Solo requests a fact-checker APIs (anónimos)

### Test 10.2: Permisos Apropiados
- [ ] Revisar manifest.json
- [ ] Solo permisos necesarios
- [ ] No permisos excesivos

### Test 10.3: Content Security Policy
- [ ] No hay inline scripts en HTML
- [ ] No hay eval() en código
- [ ] Todos los scripts están en archivos externos

---

## 11. Compatibilidad

### Test 11.1: Navegadores
- [ ] Chrome Canary (funciona)
- [ ] Chrome Dev (funciona)
- [ ] Chrome Stable (funciona con limitaciones)

### Test 11.2: Sistemas Operativos
- [ ] Windows 10/11
- [ ] macOS
- [ ] Linux (Ubuntu/Debian)

---

## 12. Documentación

### Test 12.1: README
- [ ] Instrucciones claras
- [ ] Screenshots/GIFs incluidos
- [ ] Links funcionan
- [ ] Formato markdown correcto

### Test 12.2: Política de Privacidad
- [ ] Link desde popup funciona
- [ ] Abre en nueva pestaña
- [ ] Contenido completo y claro
- [ ] Legalmente correcto

### Test 12.3: INSTALL.md
- [ ] Pasos numerados claramente
- [ ] Troubleshooting útil
- [ ] Screenshots si es necesario

---

## Resumen de Resultados

| Categoría | Tests Pasados | Tests Totales | % |
|-----------|---------------|---------------|---|
| Detección | __/__ | 4 | __% |
| Verificación AI | __/__ | 3 | __% |
| Popup Panel | __/__ | 5 | __% |
| Interactividad | __/__ | 3 | __% |
| Storage | __/__ | 3 | __% |
| Multilingüe | __/__ | 2 | __% |
| Performance | __/__ | 3 | __% |
| UI/UX | __/__ | 3 | __% |
| Edge Cases | __/__ | 4 | __% |
| Seguridad | __/__ | 3 | __% |
| Compatibilidad | __/__ | 2 | __% |
| Documentación | __/__ | 3 | __% |

**Total: __/38 tests pasados (___%)**

---

## Criterios de Aceptación

✅ **Mínimo para Release:** 32/38 tests (85%)
🎯 **Target para Challenge:** 36/38 tests (95%)
🏆 **Perfecto:** 38/38 tests (100%)

---

## Notas de Testing

Fecha: _______________
Tester: _______________
Versión: 1.0.0
Build: _______________

### Bugs Encontrados:
1. 
2. 
3. 

### Mejoras Sugeridas:
1. 
2. 
3. 

### Observaciones:

