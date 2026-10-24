import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'contributions.json');
const DATA_ADVANCES_FILE = path.join(DATA_DIR, 'advances.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_ADVANCES = [
  {
    id: "adv-1",
    type: "individual",
    title: "Oráculo Interactivo: Modelado de prompts con memorias comunitarias",
    authors: ["Manuel Palacio"],
    commonPoints: ["Inteligencia Artificial", "Lo Interactivo", "La Imagen"],
    individualIdea: "Explorar cómo la IA puede actuar como un espejo sensible de las memorias de un territorio sin despojarlo de su identidad.",
    milestone: "Estructuración de prompt y flujo en servidor para condensar relatos orales en imágenes y preguntas generadoras.",
    status: "prototipo",
    mediaUrl: "https://lab-colores.vercel.app/",
    createdAt: "2026-10-24T09:45:00.000Z"
  },
  {
    id: "adv-2",
    type: "colectivo",
    title: "Alianza Imagen + Código Sonoro: Fanzine reactivo del río",
    authors: ["Lucía Morales Mendoza", "Camilo Rengifo Ortiz", "Manuel Palacio"],
    commonPoints: ["La Imagen", "Lo Interactivo", "El Sonido & La Música", "Territorio & Memoria"],
    individualIdea: "Lucía parte de la ilustración botánica y mapas familiares; Camilo parte del código sonoro en p5.js y sensores; Manuel asesora la arquitectura de cruce.",
    collectiveIntersection: "Unir el mapa impreso con una interfaz web sonora que reproduce los rumores del agua según la interacción del espectador.",
    milestone: "Primer prototipo híbrido: 3 láminas ilustradas digitalizadas conectadas a un oscilador web reactivo.",
    status: "prototipo",
    mediaUrl: "https://lab-colores.vercel.app/",
    createdAt: "2026-10-24T10:15:00.000Z"
  },
  {
    id: "adv-3",
    type: "individual",
    title: "Microcápsula Audiovisual: Voces del mercado en stop-motion",
    authors: ["Lucía Morales Mendoza"],
    commonPoints: ["El Video & Movimiento", "La Imagen"],
    individualIdea: "Crear una cápsula de 30 segundos usando fotografías de objetos del mercado intervenidas con tinta.",
    milestone: "Storyboard de 6 escenas listo y prueba de animación cuadro a cuadro de 12 fotogramas.",
    status: "boceto",
    mediaUrl: "https://lab-colores.vercel.app/",
    createdAt: "2026-10-24T10:30:00.000Z"
  }
];

// Initial default contributions including Manuel Palacio!
const DEFAULT_CONTRIBUTIONS = [
  {
    id: 1719820000000,
    name: "Manuel Palacio",
    alias: "Manuel",
    email: "nucleo.colectivo.art@gmail.com",
    phone: "+57 300 610 1221",
    location: "Núcleo Colectivo",
    organization: "Núcleo Colectivo · Laboratorio de Medios Digitales e IA",
    social: "@nucleo.colectivo",
    shareContact: true,
    dataConsent: true,
    role: "Artista o creador/a",
    languages: [
      "IA y experimentación",
      "Programación creativa",
      "Imagen e ilustración",
      "Experiencias inmersivas",
      "Video y audiovisual",
      "Sonido y música"
    ],
    themes: "Inteligencia artificial para procesos creativos, arte generativo, medios interactivos y memoria comunitaria",
    memory: "Exploración de la frontera entre el arte sensible y los modelos generativos de IA en comunidad.",
    wish: "Consolidar el Laboratorio de Medios Digitales e IA como un espacio vivo de co-creación y experimentación abierta.",
    resources: "Dirección creativa, diseño estratégico, programación, experimentación con IA y gestión comunitaria.",
    createdAt: new Date().toISOString()
  },
  {
    id: 1719820000001,
    name: "Lucía Morales Mendoza",
    alias: "Lucía M.",
    email: "lucia.morales.arte@gmail.com",
    phone: "+57 312 456 7890",
    location: "Barrio San Antonio / Cali",
    organization: "Taller Gráfico La Madriguera",
    social: "@lucia_grabado",
    shareContact: true,
    role: "Artista o creador/a",
    languages: ["Imagen e ilustración", "Fotografía y memoria visual", "Cartografía y territorio"],
    themes: "Memorias del río, árboles antiguos del barrio, relatos de abuelas",
    memory: "Las tardes en la casa de mi abuela cosiendo retazos mientras escuchábamos la radio comunitaria.",
    wish: "Poder hacer un fanzine con mapas bordados y fotografías antiguas de los vecinos para repartir en las tiendas.",
    resources: "Cámara digital, acuarelas, scanner casero y muchas ganas de entrevistar adultos mayores.",
    createdAt: "2026-10-24T09:14:00.000Z"
  },
  {
    id: 1719820000002,
    name: "Camilo Rengifo Ortiz",
    alias: "Camilo R.",
    email: "camilo.creativecode@gmail.com",
    phone: "+57 301 987 6543",
    location: "Comuna 4 / Medellín",
    organization: "Colectivo Sintético Lab",
    social: "github.com/camilo-code",
    shareContact: true,
    role: "Estudiante",
    languages: ["Programación creativa", "IA y experimentación", "Sonido y música"],
    themes: "Música generativa, datos bioclimáticos, inteligencia artificial aplicada al paisaje sonoro",
    memory: "La primera vez que un sketch en p5.js comenzó a modular frecuencias sonoras según la temperatura ambiental.",
    wish: "Desarrollar una instalación interactiva donde las plantas del parque comunal generen melodías audibles.",
    resources: "Laptop, sensores básicos Arduino, teclado MIDI y conocimientos en p5.js y Python.",
    createdAt: "2026-10-24T09:22:00.000Z"
  }
];

function readContributions(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading contributions file:', e);
  }
  // Initialize with defaults if empty
  fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_CONTRIBUTIONS, null, 2), 'utf-8');
  return DEFAULT_CONTRIBUTIONS;
}

function writeContributions(data: any[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing contributions file:', e);
  }
}

function readAdvances(): any[] {
  try {
    if (fs.existsSync(DATA_ADVANCES_FILE)) {
      const content = fs.readFileSync(DATA_ADVANCES_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading advances file:', e);
  }
  fs.writeFileSync(DATA_ADVANCES_FILE, JSON.stringify(DEFAULT_ADVANCES, null, 2), 'utf-8');
  return DEFAULT_ADVANCES;
}

function writeAdvances(data: any[]): void {
  try {
    fs.writeFileSync(DATA_ADVANCES_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing advances file:', e);
  }
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // API Route: GET /api/contributions
  app.get('/api/contributions', (_req, res) => {
    const list = readContributions();
    res.json(list);
  });

  // API Route: POST /api/contributions
  app.post('/api/contributions', (req, res) => {
    try {
      const newContribution = req.body;
      if (!newContribution || (!newContribution.name && !newContribution.alias)) {
        res.status(400).json({ error: 'Nombre o seudónimo es requerido' });
        return;
      }

      const list = readContributions();
      // Deduplicate by ID
      const existingIndex = list.findIndex((c) => String(c.id) === String(newContribution.id));
      if (existingIndex >= 0) {
        list[existingIndex] = newContribution;
      } else {
        list.push(newContribution);
      }

      writeContributions(list);
      console.log(`[API] Nuevo aporte guardado: ${newContribution.name || newContribution.alias} (Total: ${list.length})`);
      res.status(201).json({ success: true, count: list.length, contribution: newContribution });
    } catch (err) {
      console.error('Error saving contribution:', err);
      res.status(500).json({ error: 'Error interno al guardar aporte' });
    }
  });

  // API Route: DELETE /api/contributions
  app.delete('/api/contributions', (_req, res) => {
    writeContributions([]);
    res.json({ success: true, message: 'Datos borrados del servidor' });
  });

  // API Route: GET /api/advances
  app.get('/api/advances', (_req, res) => {
    const list = readAdvances();
    res.json(list);
  });

  // API Route: POST /api/advances
  app.post('/api/advances', (req, res) => {
    try {
      const newAdvance = req.body;
      if (!newAdvance || !newAdvance.title) {
        res.status(400).json({ error: 'Título del avance es requerido' });
        return;
      }

      const list = readAdvances();
      const existingIndex = list.findIndex((a) => String(a.id) === String(newAdvance.id));
      if (existingIndex >= 0) {
        list[existingIndex] = newAdvance;
      } else {
        list.unshift(newAdvance);
      }

      writeAdvances(list);
      console.log(`[API] Nuevo avance registrado: ${newAdvance.title} [${newAdvance.type}]`);
      res.status(201).json({ success: true, count: list.length, advance: newAdvance });
    } catch (err) {
      console.error('Error saving advance:', err);
      res.status(500).json({ error: 'Error interno al guardar avance' });
    }
  });

  // API Route: DELETE /api/advances/:id
  app.delete('/api/advances/:id', (req, res) => {
    const { id } = req.params;
    const list = readAdvances().filter((a) => String(a.id) !== String(id));
    writeAdvances(list);
    res.json({ success: true, count: list.length });
  });

  // API Route: DELETE /api/advances (clear all)
  app.delete('/api/advances', (_req, res) => {
    writeAdvances([]);
    res.json({ success: true, message: 'Avances borrados del servidor' });
  });

  // Setup Vite in middleware mode for dev
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production serve dist
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Laboratorio de Ideas running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
