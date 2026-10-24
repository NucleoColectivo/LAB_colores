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
  }
];

// Initial default contributions - ONLY Manuel Palacio as real baseline
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
    createdAt: "2026-10-24T07:43:04.063Z"
  }
];

function readContributions(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out demo seeds so only real registrations and Manuel Palacio remain
        const cleaned = parsed.filter(item => 
          item.name !== "Lucía Morales Mendoza" && 
          item.name !== "Camilo Rengifo Ortiz"
        );
        if (cleaned.length !== parsed.length) {
          writeContributions(cleaned);
        }
        return cleaned.length > 0 ? cleaned : DEFAULT_CONTRIBUTIONS;
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
        // Filter out seed advances that were tied to demo personas Lucía and Camilo
        const cleaned = parsed.filter(item => item.id !== "adv-2" && item.id !== "adv-3");
        if (cleaned.length !== parsed.length) {
          writeAdvances(cleaned);
        }
        return cleaned.length > 0 ? cleaned : DEFAULT_ADVANCES;
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
