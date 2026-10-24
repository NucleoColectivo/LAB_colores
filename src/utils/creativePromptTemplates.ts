import { CreativeProject, CreativeToolId, GeneratedOutput } from '../types/creativeSystem';

export interface CompiledPromptResult {
  title: string;
  toolId: CreativeToolId;
  masterPrompt: string;
  recommendedModel: string;
  fallbackDeliverable: string;
}

export function compileMasterPrompt(
  toolId: CreativeToolId,
  project: CreativeProject,
  inputs: Record<string, any>
): CompiledPromptResult {
  const author = project.author || 'Creador/a del taller';
  const intention = inputs.intention || project.intention || 'Explorar nuevas conexiones entre arte y tecnología';
  const context = inputs.context || project.context || 'Laboratorio de Medios Digitales e IA';
  const audience = inputs.targetAudience || project.targetAudience || 'Comunidad y participantes del taller';
  const resources = inputs.resources || project.resources || 'Navegador web, herramientas digitales y tiempo de taller';
  const desiredResult = inputs.desiredResult || project.desiredResult || 'Un prototipo o serie visual reproducible';
  const aesthetic = inputs.aesthetic || project.decisions?.artDirection?.aesthetic || 'Documental contemporáneo con sensibilidad poética';
  const palette = inputs.palette || (project.decisions?.artDirection?.palette ? project.decisions.artDirection.palette.join(', ') : 'Dorado (#f8c300), violeta (#7656ff), negro (#111111), crudo (#f5f3ee)');

  switch (toolId) {
    case '01-explorador-ideas': {
      const prompt = `Actúa como director/a creativo/a, investigador/a y diseñador/a de experiencias. Ayúdame a convertir una intención inicial en un proyecto creativo viable.

Mi intención: ${intention}.

Contexto: ${context}.
Público: ${audience}.
Recursos disponibles: ${resources}.
Resultado deseado: ${desiredResult}.

Primero, identifica la intención principal y formula una pregunta generadora. No presupongas que la solución debe ser una imagen o un video.

Después:
1. Resume el propósito del proyecto en una frase.
2. Identifica la necesidad, el interés o la oportunidad que aborda.
3. Define el público y el contexto.
4. Propón hasta tres rutas creativas diferentes.
5. Para cada ruta, indica qué experiencia produciría, qué lenguajes utilizaría y qué valor aportaría.
6. Divide la ruta más pertinente en acciones o entregables independientes.
7. Explica qué decisiones faltan por tomar y cuáles pueden posponerse.
8. Sugiere una primera acción pequeña y viable para probar la idea (primeros 15-30 minutos).

No inventes información que no te haya dado. Si falta un dato decisivo, pregúntamelo antes de cerrar la propuesta.
El objetivo no es generar una idea espectacular aislada, sino diseñar un sistema coherente de creación que pueda desarrollarse por etapas.`;

      const deliverable = `### ✦ Ficha del Proyecto: ${project.title}
**Propósito central:** ${intention}

#### Pregunta Generadora:
> ¿Cómo transformar "${intention}" en un dispositivo sensible y accesible para ${audience}?

#### 3 Rutas Creativas Viables:
1. **Ruta Sensible Documental:** Retratos y testimonios visuales con archivo comunitario (Lenguaje: Fotografía analógica + narración oral).
2. **Ruta Interactiva Generativa:** Interfaz web táctil donde el público altera parámetros visuales en vivo (Lenguaje: p5.js + shaders web).
3. **Ruta Audiovisual Inmersiva:** Video-poema de 3 planos con paisaje sonoro reactivo (Lenguaje: Runway Gen-3 + diseño sonoro).

#### Primera chispa en 15 minutos:
1. Tomar una frase testimonial o memoria del territorio.
2. Definir una paleta de 3 colores con significado simbólico.
3. Redactar el primer prompt fotográfico en el Módulo 03.`;

      return {
        title: 'Exploración de Intención y Propósito',
        toolId,
        masterPrompt: prompt,
        recommendedModel: 'gemini-3.8-flash / Claude / ChatGPT',
        fallbackDeliverable: deliverable
      };
    }

    case '02-director-arte': {
      const references = inputs.references || project.decisions?.artDirection?.references || 'Artes visuales contemporáneas, fotografía de autor y archivo local';
      const prompt = `Actúa como director/a de arte. Define un sistema visual coherente para el siguiente proyecto.

Proyecto: ${project.title} — ${intention}
Intención: ${intention}
Público: ${audience}
Estética deseada: ${aesthetic}
Referencias: ${references}
Colores: ${palette}
Aplicación: ${inputs.application || 'Exposición web, proyecciones en sala y repositorio de lab-colores'}
Restricciones: ${inputs.restrictions || 'Evitar clichés de IA genérica (luces de neón cyberpunk vacías, rostros plásticos sin textura)'}

Desarrolla:
1. Concepto visual y atributos del estilo.
2. Paleta cromática y tratamiento del contraste.
3. Composición, formas, texturas y materiales.
4. Iluminación o tratamiento de sombras.
5. Tipos de encuadre y escala visual.
6. Reglas de consistencia para que las distintas piezas pertenezcan al mismo universo.
7. Tres variantes de dirección visual: conservadora, experimental y arriesgada.
Finalmente, crea una guía reutilizable que pueda aplicarse a imágenes, videos, piezas gráficas y experiencias digitales.`;

      const deliverable = `### ✦ Guía de Dirección de Arte & Sistema Visual
**Universo estético:** ${aesthetic}

#### 1. Paleta Cromática y Contraste:
- **Tono Primario (Luz):** Dorado cálido (#f8c300) — Simboliza memoria, reververación y calidez humana.
- **Tono Secundario (Espacio):** Violeta profundo (#7656ff) — Representa la experimentación y el misterio digital.
- **Base Terrosa (Materia):** Negro mineral (#111111) y Crudo fibra (#f5f3ee) — Otorgan anclaje físico y descanso ocular.

#### 2. Texturas & Materiales:
- Grano de película de 35mm tangible, papel rugoso de fibra de algodón, superficies de arcilla o madera desgastada con reflejos de luz orgánica.

#### 3. Reglas de Consistencia:
- **Sí:** Enfoques íntimos con óptica f/1.4, contraste natural, imperfecciones reales y rostros con carácter.
- **No:** Superficies sintéticas lisas, estética "glow" sin fuente física, composiciones simétricas forzadas.`;

      return {
        title: 'Sistema de Dirección de Arte',
        toolId,
        masterPrompt: prompt,
        recommendedModel: 'gemini-3.8-flash',
        fallbackDeliverable: deliverable
      };
    }

    case '03-generador-imagenes': {
      const subject = inputs.subject || 'Persona mayor sabia en un taller de oficios tradicionales, rodeada de herramientas y luz cálida';
      
      // Auto recommendation resolution
      const camera = inputs.cameraType === 'auto' || !inputs.cameraType
        ? '35mm Film Camera (Kodak Portra 400, authentic film grain)'
        : inputs.cameraType;
      const lens = inputs.lens === 'auto' || !inputs.lens
        ? '85mm f/1.4 portrait prime lens'
        : inputs.lens;
      const framing = inputs.framing === 'auto' || !inputs.framing
        ? 'Medium Close-Up shot (MCU)'
        : inputs.framing;
      const lighting = inputs.lighting === 'auto' || !inputs.lighting
        ? 'Directional golden hour natural sunlight with soft fill from the shadow side'
        : inputs.lighting;
      const depth = inputs.depth === 'auto' || !inputs.depth
        ? 'Shallow depth of field with creamy optical bokeh'
        : inputs.depth;
      const ar = inputs.aspectRatio || '16:9';

      const prompt = `Actúa como fotógrafo/a profesional y especialista en prompts visuales para Midjourney v6 y Flux. Procesa los siguientes parámetros en un prompt fotográfico definitivo sin palabras de relleno.

Sujeto: ${subject}
Intención expresiva: ${intention}
Estilo visual general: ${aesthetic}
Tipo de cámara: ${camera}
Lente y óptica: ${lens}
Encuadre y ángulo: ${framing}
Iluminación: ${lighting}
Profundidad de campo: ${depth}
Aspect Ratio: ${ar}

Genera:
1. El PROMPT PRINCIPAL en inglés para Midjourney/Flux (preciso, descriptivo, sin adjetivos vacíos como 'hyperrealistic' o '4k').
2. Tres variantes compositivas: (A) Detalle cerrado / Macro de manos o textura, (B) Retrato en su entorno territorial, (C) Composición poética de alto contraste.
3. Parámetros recomendados de Midjourney (--ar ${ar} --style raw --v 6.1).`;

      const readyMidjourneyPrompt = `${subject}, ${framing}, captured on ${camera}, ${lens}, ${lighting}, ${depth}, natural skin texture, authentic emotional weight, earthy color palette with warm accents, film grain, subtle halation --ar ${ar} --style raw --v 6.1`;

      const deliverable = `### ✦ Prompt Fotográfico Profesional Listo para Usar

\`\`\`
${readyMidjourneyPrompt}
\`\`\`

#### Variantes de Composición:
- **Variante A (Macro íntimo):** Extreme close-up of aged working hands intertwining natural fibers with subtle light rays, 100mm macro, deep textures --ar ${ar} --v 6.1
- **Variante B (En su entorno):** Wide angle shot 28mm of the workspace, atmosphere filled with floating dust particles, subject immersed in creation --ar ${ar} --v 6.1
- **Variante C (Contraluz poético):** Chiaroscuro profile silhouette against a warm window, edge rim light highlighting silhouette --ar ${ar} --v 6.1`;

      return {
        title: 'Prompt Fotográfico Profesional',
        toolId,
        masterPrompt: prompt,
        recommendedModel: 'Midjourney v6.1 / Flux Pro / Gemini Image',
        fallbackDeliverable: deliverable
      };
    }

    case '04-director-video': {
      const movement = inputs.movement === 'auto' || !inputs.movement
        ? 'Slow and deliberate push-in dolly shot moving smoothly towards the subject'
        : inputs.movement;
      const rhythm = inputs.rhythm === 'auto' || !inputs.rhythm
        ? 'Contemplative and steady cinematic pace'
        : inputs.rhythm;
      const format = inputs.format || '16:9 widescreen';

      const prompt = `Actúa como director/a de cine y especialista en video generativo (Runway Gen-3 / Sora / Kling). Diseña una secuencia cinematográfica coherente basada en:

Intención del proyecto: ${intention}
Estilo visual: ${aesthetic}
Formato de cámara: ${format}
Movimiento principal: ${movement}
Ritmo deseado: ${rhythm}

Diseña:
1. Guion técnico de 3 planos continuos (Plano 1: Establecimiento, Plano 2: Acercamiento íntimo, Plano 3: Resonancia o revelación).
2. Prompts en inglés listos para Runway Gen-3 con descriptores de movimiento de cámara claros.
3. Guía de sonido y ambientación para sincronización.`;

      const runwayPrompt1 = `Cinematic 4K shot. ${project.decisions?.imageParams?.subject || 'Artisan working in a warm studio'}, ${movement}, soft natural atmospheric lighting, 35mm film color science, smooth continuous motion, no sudden morphing.`;

      const deliverable = `### ✦ Secuencia Cinematográfica para Runway Gen-3

#### Plano 1 (00:00 - 00:05) — Establecimiento:
\`\`\`
Wide establishing shot of the studio, slow vertical crane down, morning sun filtering through haze, rich textures --motion 4
\`\`\`

#### Plano 2 (00:05 - 00:10) — Acercamiento íntimo:
\`\`\`
${runwayPrompt1} --motion 3
\`\`\`

#### Plano 3 (00:10 - 00:15) — Detalle y Revelación:
\`\`\`
Extreme close-up macro, hands finishing the delicate craft, golden light reflection on skin, slow optical rack focus --motion 2
\`\`\`

#### Nota de continuidad sonora:
Ambiente de sala silenciosa con resonancia de madera crujiendo y zumbido tenue de frecuencias bajas a 432Hz.`;

      return {
        title: 'Guion Cinematográfico y Secuencia de Video',
        toolId,
        masterPrompt: prompt,
        recommendedModel: 'Runway Gen-3 Alpha / Kling / Luma Dream Machine',
        fallbackDeliverable: deliverable
      };
    }

    case '05-disenador-interactivo': {
      const inputType = inputs.inputType === 'auto' || !inputs.inputType ? 'Movimiento del mouse y clic' : inputs.inputType;
      const outputType = inputs.outputType === 'auto' || !inputs.outputType ? 'Lienzo interactivo en p5.js con partículas orgánicas' : inputs.outputType;

      const prompt = `Actúa como diseñador/a de experiencias interactivas y programador/a creativo/a con p5.js. Diseña la interacción para el proyecto:

Intención: ${intention}
Público: ${audience}
Entrada: ${inputType}
Salida esperada: ${outputType}

Estructura el sistema siguiendo el ciclo:
ENTRADA (Sensado / Input) → PROCESAMIENTO (Algoritmo / Regla) → TRANSFORMACIÓN → SALIDA (Visual / Sonora)

Genera:
1. Diagrama de flujo de interacción paso a paso.
2. Código inicial en p5.js funcional, comentado y accesible para principiantes.
3. Indicaciones para probarlo en el navegador en menos de 15 minutos.`;

      const deliverable = `### ✦ Flujo de Experiencia Interactiva
**Ciclo:** Entrada (${inputType}) → Algoritmo de resonancia → Salida (${outputType})

\`\`\`javascript
// p5.js - Prototipo Interactivo en 15 Minutos
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255);
  for (let i = 0; i < 60; i++) {
    particles.push(new MemoryParticle(random(width), random(height)));
  }
}

function draw() {
  background(17, 17, 17, 25); // Fondo carbón con estela
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function mouseMoved() {
  for (let p of particles) {
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < 120) {
      p.react(mouseX, mouseY);
    }
  }
}

class MemoryParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.color = color(248, 195, 0); // Oro Núcleo Colectivo
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  react(mx, my) {
    this.vx += (mx - this.x) * 0.01;
    this.vy += (my - this.y) * 0.01;
    this.color = color(118, 86, 255); // Mutación a violeta con proximidad
  }
  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, 6);
  }
}
\`\`\``;

      return {
        title: 'Diseño de Interacción & Código p5.js',
        toolId,
        masterPrompt: prompt,
        recommendedModel: 'p5.js Web Editor / Gemini Code',
        fallbackDeliverable: deliverable
      };
    }

    case '06-laboratorio-sonido': {
      const prompt = `Actúa como diseñador/a sonoro/a y productor/a de música experimental. Diseña el universo de audio para:

Proyecto: ${project.title}
Intención: ${intention}
Atmósfera visual: ${aesthetic}

Define:
1. Concepto sonoro y mapa de frecuencias (Bajos telúricos, medios orgánicos, agudos cristalinos).
2. Guion de capas de audio para 60 segundos de reproducción en loop.
3. Prompts descriptivos para herramientas de audio generativo (Suno, Udio, Stable Audio).`;

      const deliverable = `### ✦ Mapa de Diseño Sonoro & Audio Generativo
**Concepto Sonoro:** "Respiración de arcilla y frecuencias de memoria"

#### Capas de Sonido (Loop inmersivo):
1. **Capa 01 (Cimiento telúrico):** Drone de baja frecuencia a 55Hz con textura de viento distante.
2. **Capa 02 (Materia viva):** Sonidos foley de manos manipulando fibras naturales, susurros casi inaudibles y agua goteando.
3. **Capa 03 (Destellos armónicos):** Acordes lentos de sintetizador analógico cálido en escala pentatónica menor.

#### Prompt para Stable Audio / Udio:
\`\`\`
Ambient meditative soundscape, soft analog synthesizer drone in D minor, tactile foley textures of wood and clay, warm vinyl crackle, 60 bpm, spacious reverb, deeply emotional and serene
\`\`\``;

      return {
        title: 'Laboratorio de Sonido & Paisaje Sonoro',
        toolId,
        masterPrompt: prompt,
        recommendedModel: 'Stable Audio / Suno / Reaper DAW',
        fallbackDeliverable: deliverable
      };
    }

    case '07-productos-digitales': {
      const prompt = `Actúa como diseñador/a de producto UX/UI y especialista en diseño de información accesible. Estructura la experiencia digital para:

Proyecto: ${project.title}
Intención: ${intention}
Público objetivo: ${audience}

Desarrolla:
1. Arquitectura de información (Árbol de navegación y pantallas clave).
2. Principios de accesibilidad WCAG (Contraste de color, etiquetas semánticas, navegación por teclado).
3. Especificación de componentes y microinteracciones de feedback.`;

      const deliverable = `### ✦ Arquitectura y Especificación Digital
**Estructura del Proyecto en lab-colores.vercel.app:**

#### 1. Flujo de Pantallas:
- **/inicio:** Portal de bienvenida con pregunta generadora y selección de ruta.
- **/lienzo:** Espacio interactivo vivo con renderizado a pantalla completa.
- **/archivo:** Galería de memorias y aportes comunitarios con filtros de búsqueda.

#### 2. Criterios de Accesibilidad:
- Contraste mínimo de 4.5:1 verificado en todos los textos sobre fondos oscuros.
- Modos de reducción de movimiento respetando \`prefers-reduced-motion\`.
- Teclas rápidas para control con teclado (Espacio = Pausar animación, R = Reiniciar).`;

      return {
        title: 'Arquitectura de Producto & Accesibilidad',
        toolId,
        masterPrompt: prompt,
        recommendedModel: 'Figma / React / Tailwind',
        fallbackDeliverable: deliverable
      };
    }

    case '08-productor-gestor': {
      const prompt = `Actúa como productor/a ejecutivo/a de proyectos creativos y gestor/a cultural. Convierte esta idea en un plan de acción por fases:

Proyecto: ${project.title}
Intención: ${intention}
Recursos: ${resources}
Entregable final deseado: ${desiredResult}

Estructura el proyecto en 3 fases:
- FASE 1: Prototipo Rápido (Los primeros 15 a 60 minutos de taller).
- FASE 2: Desarrollo y Profundización (Iteración de piezas y coherencia).
- FASE 3: Activación y Circulación (Publicación comunitaria en lab-colores y muestra colectiva).

Incluye responsables sugeridos, riesgos a mitigar y criterios de calidad.`;

      const deliverable = `### ✦ Plan de Producción y Lanzamiento

#### FASE 1: Prototipo Rápido (Primeros 15-30 minutos)
- **Acción:** Definir la intención clave y generar el primer prompt fotográfico en el Módulo 03.
- **Entregable:** 1 imagen o boceto interactivo listo para compartir en la mesa de trabajo.
- **Responsable:** Creador/a individual.

#### FASE 2: Desarrollo y Coherencia (1 a 2 horas)
- **Acción:** Articular la dirección de arte con los avances de otros compañeros de la mesa.
- **Entregable:** Serie de 3 piezas coherentes (imagen + audio o interacción).

#### FASE 3: Activación y Publicación (Mesa final)
- **Acción:** Registrar el avance en el repositorio lab-colores.vercel.app y proyectar en pantalla grande.
- **Criterio de calidad:** Claridad narrativa, accesibilidad y fidelidad a la memoria comunitaria.`;

      return {
        title: 'Plan de Producción y Lanzamiento',
        toolId,
        masterPrompt: prompt,
        recommendedModel: 'Notion / Tablero de Producción',
        fallbackDeliverable: deliverable
      };
    }

    default:
      return {
        title: 'Asistencia Creativa',
        toolId,
        masterPrompt: `Explorar proyecto: ${project.title}`,
        recommendedModel: 'gemini-3.8-flash',
        fallbackDeliverable: 'Resultado en proceso.'
      };
  }
}
