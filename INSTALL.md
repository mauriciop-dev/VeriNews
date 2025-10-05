# 🚀 Guía de Instalación Rápida - VeriNews

## Paso 1: Habilitar Chrome Built-in AI APIs

### Requisitos
- Google Chrome Canary o Chrome Dev (versión 127+)
- Descarga Chrome Canary: https://www.google.com/chrome/canary/

### Configurar Flags

1. Abre Chrome y ve a: `chrome://flags`

2. Busca y **HABILITA** los siguientes flags:

   ```
   #optimization-guide-on-device-model
   → Set to: Enabled BypassPerfRequirement
   
   #prompt-api-for-gemini-nano
   → Set to: Enabled
   
   #summarization-api-for-gemini-nano  
   → Set to: Enabled
   
   #translation-api
   → Set to: Enabled
   ```

3. Haz clic en **"Relaunch"** para reiniciar Chrome

4. Verifica que Gemini Nano se esté descargando:
   - Ve a: `chrome://components/`
   - Busca: "Optimization Guide On Device Model"
   - Si dice "Checking", espera unos minutos
   - Si dice versión (ej: "2024.5.21.1234"), ¡está listo!

## Paso 2: Instalar la Extensión

### Opción A: Desde la carpeta local

1. Descarga y descomprime `verinews-extension.zip`

2. Abre Chrome y ve a: `chrome://extensions/`

3. Activa el **"Modo de desarrollador"** (toggle en esquina superior derecha)

4. Haz clic en **"Cargar extensión sin empaquetar"**

5. Selecciona la carpeta `verinews-extension`

6. ¡Listo! Verás el icono de VeriNews en la barra de herramientas

### Opción B: Arrastrar y soltar

1. Ve a `chrome://extensions/`
2. Arrastra el archivo `verinews-extension.zip` a la ventana
3. Chrome instalará automáticamente

## Paso 3: Probar la Extensión

### Test Rápido

1. Visita un sitio de noticias, por ejemplo:
   - https://www.bbc.com/news
   - https://www.cnn.com
   - https://elpais.com

2. Busca el **badge flotante** sobre el titular principal
   - Debería aparecer automáticamente
   - Color inicial: 🟡 Amarillo (verificando)

3. Espera 2-3 segundos para la verificación

4. Haz clic en el badge o en el icono de la extensión

5. Explora las 4 pestañas:
   - ✅ Estado
   - ❌ Refuta  
   - 👤 Usuario
   - 📰 Medios

## Solución de Problemas

### ❓ "El badge no aparece"

**Solución:**
- Asegúrate de estar en una página de noticias real (no la página principal)
- Refresca la página (F5)
- Verifica que la extensión esté habilitada en `chrome://extensions/`

### ❓ "Las APIs de AI no funcionan"

**Solución:**
- Verifica los flags en `chrome://flags`
- Comprueba que Gemini Nano esté descargado en `chrome://components/`
- Reinicia Chrome completamente
- Si usas Chrome estable, cambia a Chrome Canary

### ❓ "Error al cargar la extensión"

**Solución:**
- Verifica que todos los archivos estén presentes:
  ```
  verinews-extension/
  ├── manifest.json ✓
  ├── popup.html ✓
  ├── privacy.html ✓
  ├── icons/ ✓
  ├── css/ ✓
  └── js/ ✓
  ```
- Revisa la consola de errores en `chrome://extensions/`

### ❓ "No se muestran fuentes"

**Solución:**
- Las APIs están en versión experimental
- Algunas noticias pueden no tener fuentes verificables
- La extensión usará fallbacks automáticos

## Verificación de Instalación Exitosa

✅ Checklist:

- [ ] Icono de VeriNews visible en barra de herramientas
- [ ] Badge aparece en páginas de noticias
- [ ] Popup se abre al hacer clic
- [ ] Las 4 pestañas son accesibles
- [ ] El semáforo cambia de color
- [ ] Se puede calificar medios con estrellas

## Próximos Pasos

1. **Explora diferentes sitios de noticias**
   - Prueba en múltiples idiomas
   - Compara verificaciones

2. **Califica medios**
   - Ve a la pestaña "Usuario"
   - Asigna estrellas a tus medios preferidos

3. **Revisa el historial**
   - Las últimas 100 verificaciones se guardan localmente

4. **Lee la política de privacidad**
   - Todo se procesa localmente
   - Tus datos nunca salen del dispositivo

## Recursos Adicionales

- 📖 [README completo](README.md)
- 🔒 [Política de Privacidad](privacy.html)
- 🐛 [Reportar problemas](https://github.com/tuusuario/verinews-extension/issues)
- 💬 [Devpost](https://devpost.com/software/verinews)

## Soporte

¿Necesitas ayuda? Contacta:
- **Email**: [email protected]
- **GitHub Issues**: https://github.com/tuusuario/verinews-extension/issues

---

**¡Disfruta usando VeriNews!** 🛡️✨

*Verificando noticias, protegiendo la verdad*
