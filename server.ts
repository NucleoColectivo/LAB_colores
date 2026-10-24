import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'contributions.json');
const DATA_ADVANCES_FILE = path.join(DATA_DIR, 'advances.json');

const DATA_PROJECT_FILE = path.join(DATA_DIR, 'creative-project.json');

const DEFAULT_CREATIVE_PROJECT = {
  id: "proj-manuel-oraculo",
  title: "Oráculo Interactivo y Memoria Comunitaria",
  author: "Manuel Palacio",
  intention: "Explorar cómo la IA y el arte generativo pueden ser un espejo sensible de las memorias de un territorio sin despojarlo de su identidad.",
  context: "Laboratorio de Medios Digitales e IA de Núcleo Colectivo, articulando artistas, educadores y tecnólogos.",
  targetAudience: "Comunidades locales, creadores visuales, programadores creativos e investigadores de memoria.",
  resources: "Laptops, navegadores web, modelos generativos, repositorio lab-colores.vercel.app y pantalla colectiva.",
  desiredResult: "Un sistema vivo donde las voces se transforman en paisajes visuales e interrogantes poéticos compartidos.",
  guidingQuestion: "¿De qué maneras la inteligencia artificial puede amplificar relatos comunitarios en lugar de estandarizarlos?",
  activeStage: "comprender",
  activeTools: ["01-explorador-ideas", "02-director-arte", "03-generador-imagenes", "05-disenador-interactivo"],
  decisions: {
    artDirection: {
      aesthetic: "Fotografía documental poética combinada con arte generativo orgánico",
      palette: ["#111111", "#f8c300", "#7656ff", "#f5f3ee"],
      contrast: "Alto contraste y texturas terrosas con acentos luminosos vibrantes",
      references: "Graciela Iturbide, Bill Viola, arte textil contemporáneo, p5.js generative shaders",
      rules: "Evitar clichés de neon cyberpunk; priorizar rostros genuinos, manos trabajadoras y grano analógico 35mm"
    },
    imageParams: {
      subject: "Retrato en primer plano de una persona mayor tejedora con filamentos de luz proyectados sobre sus manos",
      cameraType: "35mm Film Camera (Hasselblad 500C / Kodak Portra 400)",
      lens: "85mm f/1.4 Portrait Lens",
      framing: "Medium Close-Up (MCU)",
      angle: "Eye-level, íntimo y directo",
      lighting: "Golden Hour natural lateral con suave rebote cálido",
      depth: "Profundidad de campo corta (f/1.8), fondo sutilmente desenfocado",
      aspectRatio: "16:9"
    }
  },
  generatedOutputs: [],
  updatedAt: new Date().toISOString()
};

function readCreativeProject(): any {
  try {
    if (fs.existsSync(DATA_PROJECT_FILE)) {
      const content = fs.readFileSync(DATA_PROJECT_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.title) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading creative project file:', e);
  }
  fs.writeFileSync(DATA_PROJECT_FILE, JSON.stringify(DEFAULT_CREATIVE_PROJECT, null, 2), 'utf-8');
  return DEFAULT_CREATIVE_PROJECT;
}

function writeCreativeProject(data: any): void {
  try {
    fs.writeFileSync(DATA_PROJECT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing creative project file:', e);
  }
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
    createdAt: "2026-10-24T07:43:04.063Z",
    pin: "1221",
    qrCodeData: "nucleo://pass/1719820000000"
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

  // API Route: GET /api/creative-system/project
  app.get('/api/creative-system/project', (_req, res) => {
    const project = readCreativeProject();
    res.json(project);
  });

  // API Route: POST /api/creative-system/project
  app.post('/api/creative-system/project', (req, res) => {
    try {
      const project = req.body;
      if (!project || !project.title) {
        res.status(400).json({ error: 'Título del proyecto es requerido' });
        return;
      }
      project.updatedAt = new Date().toISOString();
      writeCreativeProject(project);
      res.json({ success: true, project });
    } catch (err) {
      console.error('Error saving creative project:', err);
      res.status(500).json({ error: 'Error al guardar el proyecto' });
    }
  });

  // API Route: POST /api/creative-system/assist
  app.post('/api/creative-system/assist', async (req, res) => {
    try {
      const { toolId, masterPrompt, userQuery } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({});
          const systemInstruction = `Eres un socio creativo, director de arte y diseñador estratégico de Núcleo Colectivo (lab-colores.vercel.app), colaborando con Manuel y participantes del taller.
Tu objetivo es traducir intenciones creativas en decisiones concretas, estéticas sofisticadas y prompts precisos para Midjourney v6, Runway Gen-3, p5.js, audio o código.
Mantén tono cercano, poético, riguroso y anti-clichés de IA genérica. Estructura la salida con títulos claros en Markdown.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `${masterPrompt}\n\nConsulta o ajuste adicional del usuario: ${userQuery || 'Ninguno, procesar los parámetros.'}`,
            config: {
              systemInstruction,
              temperature: 0.7,
            }
          });

          const text = response.text || '';
          res.json({
            success: true,
            source: 'gemini-3.8-flash',
            content: text
          });
          return;
        } catch (apiErr) {
          console.warn('[Gemini API] Error calling Gemini, falling back to structured assistant:', apiErr);
        }
      }

      // Fallback response when no API key or on API failure
      res.json({
        success: true,
        source: 'structured-template-engine',
        content: null
      });
    } catch (err) {
      console.error('Error in creative-system assist:', err);
      res.status(500).json({ error: 'Error en la asistencia creativa' });
    }
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
