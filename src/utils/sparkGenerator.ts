import { CreativeSpark, WORKSHOP_THEMATIC_AXES, WorkshopThematicAxis } from '../types';

interface GenerateSparkParams {
  title?: string;
  categories: string[];
  individualIdea?: string;
  collectiveIntersection?: string;
  authors?: string[];
}

export function generateCreativeSpark(params: GenerateSparkParams): CreativeSpark {
  const { title, categories, individualIdea, collectiveIntersection, authors } = params;

  // Find matching thematic axes from the 10 defined
  const matchedAxes: WorkshopThematicAxis[] = WORKSHOP_THEMATIC_AXES.filter((axis) =>
    categories.some(
      (cat) =>
        cat.toLowerCase().includes(axis.name.toLowerCase()) ||
        axis.name.toLowerCase().includes(cat.toLowerCase())
    )
  );

  const primaryAxis = matchedAxes[0] || WORKSHOP_THEMATIC_AXES[0];
  const secondaryAxis = matchedAxes[1] || matchedAxes[0] || WORKSHOP_THEMATIC_AXES[1];

  const authorsString = authors && authors.length > 0 ? authors.join(' · ') : 'Equipo del taller';
  const ideaContext = collectiveIntersection || individualIdea || 'Exploración artística e interdisciplinaria de la memoria y el territorio';

  // Specific prompt recipes for each tool
  const runwayPrompt = `Cinematic ${primaryAxis.name.toLowerCase()} meets ${secondaryAxis.name.toLowerCase()}: ${ideaContext}. ${primaryAxis.runwayKeyword}. Volumetric lighting, organic motion, 35mm lens, atmospheric depth, 4k ultra-realistic render, slow poetic pacing.`;
  const runwayCameraMotion = `Smooth cinematic tracking and slow push-in focusing on the interplay between ${primaryAxis.name.toLowerCase()} and ${secondaryAxis.name.toLowerCase()}. Handheld tactile camera with natural motion blur.`;
  const runwayTips = `Ajusta el parámetro de Motion a 3-4 en Runway Gen-2/Gen-3 para mantener coherencia espacial. Agrega referencias fotográficas de la mesa de trabajo en Image-to-Video.`;

  const midjourneyPrompt = `Contemporary hybrid artwork fusing ${primaryAxis.name.toLowerCase()} and ${secondaryAxis.name.toLowerCase()}, inspired by "${ideaContext}". ${primaryAxis.midjourneyStyle}, subtle Latin American community aesthetics, tactile textures, rich pigments, editorial fine-art quality, award-winning gallery exhibition piece.`;
  const midjourneyAspectRatio = `--ar 16:9 --v 6.1 --stylize 250 --no corporate, generic stock photo`;
  const midjourneyStyleTips = `Copia este prompt en Discord o en la web de Midjourney. Prueba añadir una foto de tus bocetos físicos al inicio para que el modelo preserve la geometría de tu dibujo original.`;

  // Tailored p5.js sketch code
  const p5jsCode = `// Sketch de Prototipado Rápido (15 min) — Núcleo Colectivo
// Ejes: ${primaryAxis.name} + ${secondaryAxis.name}
// Autores: ${authorsString}

let particles = [];
let colorPalette = ['${primaryAxis.color}', '${secondaryAxis.color}', '#f8c300', '#111111', '#ffffff'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 48; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1.2, 1.2),
      vy: random(-1.2, 1.2),
      size: random(4, 18),
      col: random(colorPalette)
    });
  }
}

function draw() {
  background(17, 17, 17, 45); // estela de movimiento
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    // Rebote en bordes
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    // Interacción sensible con el cursor
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < 160) {
      let angle = atan2(p.y - mouseY, p.x - mouseX);
      p.x += cos(angle) * 2;
      p.y += sin(angle) * 2;
      stroke(248, 195, 0, 180);
      line(mouseX, mouseY, p.x, p.y);
    }

    noStroke();
    fill(p.col);
    circle(p.x, p.y, p.size);
  }
}

function mousePressed() {
  // Regenerar paleta al hacer clic
  for (let p of particles) {
    p.col = random(colorPalette);
  }
}`;

  return {
    sparkTitle: title ? `Chispa: ${title}` : `Chispa: Cruce entre ${primaryAxis.name} y ${secondaryAxis.name}`,
    thematicBridge: `Este cruce une la potencia expresiva de "${primaryAxis.name}" con "${secondaryAxis.name}". ${authorsString} pueden usar esta chispa para contrastar sus ideas individuales y producir un primer prototipo tangible antes de los 15 minutos.`,
    fifteenMinPlan: {
      min0to5: `Min 00–05: Diálogo de cruce. Poner sobre la mesa los bocetos de ${primaryAxis.name} y ${secondaryAxis.name}. Elegir la pregunta o metáfora central.`,
      min5to10: `Min 05–10: Disparo generativo. Pegar el prompt en Runway o Midjourney, o ejecutar el código p5.js en vivo para generar 3 variantes visuales.`,
      min10to15: `Min 10–15: Ensamblaje y acople. Seleccionar la mejor variante y conectarla con la idea individual de cada participante para documentar el avance.`
    },
    runway: {
      prompt: runwayPrompt,
      cameraMotion: runwayCameraMotion,
      tips: runwayTips
    },
    midjourney: {
      prompt: `${midjourneyPrompt} ${midjourneyAspectRatio}`,
      aspectRatio: '--ar 16:9',
      styleTips: midjourneyStyleTips
    },
    p5js: {
      title: `Sketch Reactivo: ${primaryAxis.name} + ${secondaryAxis.name}`,
      code: p5jsCode,
      interactionHint: `Mueve el cursor para interactuar con la constelación. Haz clic para cambiar la paleta y mutar el comportamiento visual.`
    }
  };
}
