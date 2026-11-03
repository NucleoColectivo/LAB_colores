# Plan de Auditoría Integral y Mejoras del Sistema Núcleo Colectivo

Auditoría técnica, estética y metodológica completa de la plataforma **Núcleo Colectivo** (`lab-colores.vercel.app`), diagnosticando el estado actual de UX/UI, programación, flujos de datos y dinámicas de taller en vivo, junto con la propuesta de ejecución priorizada.

---

### Diagnóstico de Auditoría: Hallazgos & Brechas

| Dimensión | Estado Actual | Brecha / Oportunidad de Mejora |
| :--- | :--- | :--- |
| **UX / UI & Jerarquía** | Completa pero densa; cabecera con más de 10 accesos compitiendo. | Unificar accesos en la cabecera bajo el contrato de 3 zonas y dar protagonismo a los modos de sesión en vivo. |
| **Modo Proyector** | Histograma de lenguajes y códigos QR estáticos. | Falta el **Temporizador Sprint 15 min** (bloques 0-5m, 5-10m, 10-15m con campana acústica), la **Ruleta de Cruces en Vivo** y la proyección en tiempo real de la Ficha Activa. |
| **Repositorio & Avances** | Solo acepta enlaces de texto externos en `mediaUrl`. | No permite adjuntar o previsualizar imágenes directas ni reproducir notas de voz/audio locales de los avances sonoros. |
| **Credencial / Carnet** | Renderizado vectorial QR y PIN completado. | Falta acción directa de **Impresión / Descarga en formato gafete de taller** con diseño editorial listo para recortar o compartir. |
| **Asistente de Intención** | Fichas en `localStorage` y cálculo de avance funcional. | Falta botón de generación rápida de variantes poéticas y vinculación directa al Proyector de sala. |

---

## 1. Alcance & Módulos a Implementar

```
┌────────────────────────────────────────────────────────────────────────┐
│                   NÚCLEO COLECTIVO · SISTEMA INTEGRAL                  │
├───────────────────────┬────────────────────────┬───────────────────────┤
│    01. DINÁMICAS      │      02. MULTIMEDIA    │    03. CARNET & UX    │
│  DE TALLER EN VIVO    │    DE AVANCES & AUDIO  │   EDITORIAL PROYECTOR │
├───────────────────────┼────────────────────────┼───────────────────────┤
│ • Temporizador 15 min │ • Subida de imagen     │ • Gafete / Carnet     │
│   (3 bloques audibles)│   (boceto / captura)   │   imprimible/PDF      │
│ • Ruleta de Cruces    │ • Reproductor de audio │ • Header limpio con   │
│   Aleatorios en Muro  │   para paisajes sonoros│   indicador live      │
│ • Presentación Ficha  │ • Previsualizador      │ • Notificaciones con  │
│   Activa en Proyector │   integrado en tarjetas│   campana sonora Web  │
└───────────────────────┴────────────────────────┴───────────────────────┘
```

### Módulo A: Dinámicas de Taller en Modo Proyector
1. **Temporizador de Sprint de 15 Minutos**:
   - Cuenta regresiva sincronizada con 3 etapas visibles:
     - `Min 00:00 - 05:00`: *Definir Intención & Pregunta Generadora*.
     - `Min 05:00 - 10:00`: *Estructurar Prompt y Detonar Herramientas de IA*.
     - `Min 10:00 - 15:00`: *Probar Prototipo y Documentar en Avances*.
   - Sonido acústico suave con Web Audio API al cambiar de bloque y al finalizar el sprint.
2. **Ruleta de Cruces Creativos en Vivo**:
   - Selector aleatorio en pantalla completa que toma 2 participantes con lenguajes complementarios y proyecta su desafío creativo en tiempo real.
3. **Muro de Ficha Activa Proyectada**:
   - Pestaña para proyectar en gran formato la Ficha de Proyecto seleccionada para revisiones colectivas de mesa.

### Módulo B: Multimedia Enriquecida en Avances de Co-Creación
1. **Subida / Adjunto de Archivo de Imagen & Audio**:
   - Permite arrastrar o seleccionar una captura de pantalla, boceto visual o archivo de audio (`.mp3`, `.wav`, `.m4a`).
   - Almacenamiento seguro en base64/dataURL o URL remota con previsualizador responsivo.
2. **Reproductor de Audio Integrado**:
   - Para avances de paisajes sonoros y testimonios orales, reproduce el audio directamente en la tarjeta con controles de play/pause y barra de onda.

### Módulo C: Carnet de Taller Imprimible & Optimización Visual
1. **Vista de Impresión / Descarga de Credencial**:
   - Formato gafete editorial de 9x6 cm listo para imprimir desde el navegador con corte perimetral, código QR nítido, datos de autoría y lenguajes.
2. **Limpieza de Cabecera (Top Bar Contract)**:
   - Agrupación ordenada de enlaces de navegación evitando saturación en pantallas medianas y móviles, manteniendo acceso instantáneo al Proyector, WhatsApp y Carnet QR.

---

## 2. Plan de Ejecución por Pasos

### Paso 1: Modo Proyector con Dinámicas en Vivo (`src/components/ProjectorModal.tsx`)
- Integrar barra superior de modos: **Muro de Lenguajes**, **Temporizador 15 Min** y **Ruleta de Cruces**.
- Programar motor de temporizador con Web Audio API (`playSparkChime`).
- Diseñar la ruleta interactiva con animación fluida para proyectar cruces en sala.

### Paso 2: Soporte Multimedia en Avances (`src/components/CoCreationAdvances.tsx`)
- Añadir selector de archivo (imagen/audio) en el formulario de avance.
- Crear componente ligero `InlineAudioPlayer` y visualizador de miniatura con zoom en modal.
- Sincronizar datos con el endpoint `/api/advances`.

### Paso 3: Credencial Imprimible en Carnet (`src/components/UserAuthProfileModal.tsx`)
- Añadir botón "Imprimir Gafete de Taller" que renderiza una hoja de impresión CSS limpia con líneas de corte para gafete físico.

### Paso 4: Verificación, Linting y Compilación
- Ejecutar `lint_applet` y `compile_applet` para garantizar cero errores de TypeScript y máxima estabilidad.

---

## 3. Preguntas de Decisión para el Usuario

> [!IMPORTANT]
> Revisa estas prioridades antes de proceder a la ejecución:
> 1. **¿Prefieres que el temporizador de 15 minutos emita avisos sonoros al cambiar de bloque (minuto 5 y 10) además del aviso final?**
> 2. **¿Deseas que los archivos de audio adjuntos en los avances tengan límite de duración sugerido (por ejemplo, notas de voz de hasta 2 minutos)?**
