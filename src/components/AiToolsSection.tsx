import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight, Search, Sparkles, ChartNoAxesCombined, BookOpen, Palette,
  Video, AudioLines, Code2, Gamepad2, Megaphone, Workflow, Database,
  ExternalLink, X, SlidersHorizontal, Lightbulb, GraduationCap, Clock3
} from 'lucide-react';

type Tool = {
  name: string;
  url: string;
  description: string;
  uses: string[];
  level: 'Inicial' | 'Intermedio' | 'Avanzado';
  access: 'Gratis' | 'Freemium' | 'De pago / prueba';
  featured?: boolean;
};

type Category = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  tools: Tool[];
  exercise: string;
};

const categories: Category[] = [
  {
    id: 'datos',
    title: 'Datos y análisis',
    subtitle: 'Cruza información, encuentra patrones y convierte cifras en decisiones.',
    icon: ChartNoAxesCombined,
    color: 'yellow',
    tools: [
      { name: 'ChatGPT', url: 'https://chatgpt.com/', description: 'Analiza archivos, tablas y conjuntos de datos; ayuda a encontrar tendencias y explicar resultados.', uses: ['Explorar archivos CSV y Excel', 'Crear tablas y gráficos', 'Interpretar indicadores'], level: 'Inicial', access: 'Freemium', featured: true },
      { name: 'Google Sheets', url: 'https://sheets.google.com/', description: 'Organiza información en hojas de cálculo colaborativas y aplica fórmulas.', uses: ['Cruzar registros', 'Limpiar y ordenar datos', 'Crear tablas dinámicas'], level: 'Inicial', access: 'Gratis' },
      { name: 'Looker Studio', url: 'https://lookerstudio.google.com/', description: 'Construye tableros visuales para consultar indicadores y reportes.', uses: ['Visualizar resultados', 'Crear reportes', 'Compartir tableros'], level: 'Intermedio', access: 'Gratis' },
      { name: 'AppSheet', url: 'https://www.appsheet.com/', description: 'Crea aplicaciones sin código conectadas a hojas de cálculo y otras fuentes.', uses: ['Registrar información', 'Consultar bases de datos', 'Crear formularios de campo'], level: 'Intermedio', access: 'Freemium' }
    ],
    exercise: 'Usa una tabla de ejemplo —ventas, gastos, inventario o encuesta— para responder tres preguntas, encontrar una tendencia y presentar los resultados en un tablero.'
  },
  {
    id: 'investigacion',
    title: 'Investigación y documentos',
    subtitle: 'Consulta fuentes, organiza archivos y transforma información en conocimiento.',
    icon: BookOpen,
    color: 'violet',
    tools: [
      { name: 'NotebookLM', url: 'https://notebooklm.google.com/', description: 'Trabaja con fuentes propias y responde preguntas fundamentadas en los documentos que agregas.', uses: ['Consultar documentos', 'Comparar fuentes', 'Preparar guías y resúmenes'], level: 'Inicial', access: 'Freemium', featured: true },
      { name: 'Perplexity', url: 'https://www.perplexity.ai/', description: 'Investiga en la web y presenta respuestas acompañadas de referencias.', uses: ['Explorar temas', 'Localizar fuentes', 'Contrastar información'], level: 'Inicial', access: 'Freemium' },
      { name: 'Google Drive', url: 'https://drive.google.com/', description: 'Almacena y organiza documentos, hojas de cálculo, imágenes y materiales de trabajo.', uses: ['Organizar archivos', 'Compartir carpetas', 'Colaborar en documentos'], level: 'Inicial', access: 'Freemium' },
      { name: 'Claude', url: 'https://claude.ai/', description: 'Apoya la lectura, síntesis, escritura y análisis de documentos extensos.', uses: ['Resumir textos', 'Comparar documentos', 'Estructurar informes'], level: 'Inicial', access: 'Freemium' }
    ],
    exercise: 'Crea una carpeta temática en Drive, selecciona documentos públicos y trabaja con ellos en NotebookLM para construir una guía de consulta con fuentes verificables.'
  },
  {
    id: 'diseno',
    title: 'Diseño e imagen',
    subtitle: 'Desarrolla piezas visuales, presentaciones, identidades y materiales de comunicación.',
    icon: Palette,
    color: 'pink',
    tools: [
      { name: 'Canva', url: 'https://www.canva.com/', description: 'Diseña presentaciones, carteles, publicaciones, documentos y piezas para redes.', uses: ['Crear piezas gráficas', 'Diseñar catálogos', 'Preparar presentaciones'], level: 'Inicial', access: 'Freemium', featured: true },
      { name: 'Adobe Firefly', url: 'https://firefly.adobe.com/', description: 'Genera y edita imágenes y recursos visuales mediante instrucciones.', uses: ['Explorar conceptos visuales', 'Crear fondos', 'Editar imágenes'], level: 'Inicial', access: 'Freemium' },
      { name: 'Ideogram', url: 'https://ideogram.ai/', description: 'Genera imágenes y explora composiciones con texto integrado.', uses: ['Afiches conceptuales', 'Exploración tipográfica', 'Imágenes para campañas'], level: 'Inicial', access: 'Freemium' },
      { name: 'Adobe Express', url: 'https://www.adobe.com/express/', description: 'Crea y adapta contenidos gráficos y audiovisuales para diferentes formatos.', uses: ['Piezas para redes', 'Adaptar formatos', 'Videos cortos'], level: 'Inicial', access: 'Freemium' }
    ],
    exercise: 'Elige un producto, actividad o servicio y crea una presentación visual breve con portada, propuesta de valor, imágenes y datos de contacto.'
  },
  {
    id: 'video',
    title: 'Video y audiovisual',
    subtitle: 'Pasa de una idea o imagen a una pieza audiovisual para contar y compartir.',
    icon: Video,
    color: 'orange',
    tools: [
      { name: 'Google Flow', url: 'https://labs.google/fx/tools/flow', description: 'Explora generación audiovisual con IA a partir de instrucciones y recursos visuales.', uses: ['Crear escenas', 'Animar ideas', 'Experimentar con narrativas'], level: 'Intermedio', access: 'Freemium', featured: true },
      { name: 'Runway', url: 'https://runwayml.com/', description: 'Genera y transforma video con herramientas de inteligencia artificial.', uses: ['Generar clips', 'Transformar escenas', 'Experimentar con movimiento'], level: 'Intermedio', access: 'Freemium' },
      { name: 'CapCut', url: 'https://www.capcut.com/', description: 'Edita videos, agrega subtítulos, música y recursos para redes sociales.', uses: ['Editar reels', 'Subtitular', 'Montar campañas'], level: 'Inicial', access: 'Freemium' },
      { name: 'HeyGen', url: 'https://www.heygen.com/', description: 'Crea videos explicativos con presentadores virtuales y doblaje.', uses: ['Videos informativos', 'Presentaciones habladas', 'Traducción audiovisual'], level: 'Intermedio', access: 'Freemium' }
    ],
    exercise: 'Escribe un guion de 30 segundos, desarrolla una imagen o escena y edita un video breve con subtítulos. Verifica derechos de imagen y materiales utilizados.'
  },
  {
    id: 'audio',
    title: 'Audio y voz',
    subtitle: 'Convierte textos en narraciones, limpia grabaciones y explora creación sonora.',
    icon: AudioLines,
    color: 'cyan',
    tools: [
      { name: 'ElevenLabs', url: 'https://elevenlabs.io/', description: 'Genera narraciones, voces sintéticas y recursos de audio.', uses: ['Narrar textos', 'Crear voces para videos', 'Explorar doblaje'], level: 'Inicial', access: 'Freemium', featured: true },
      { name: 'Suno', url: 'https://suno.com/', description: 'Experimenta con la creación de canciones y piezas musicales mediante IA.', uses: ['Bocetos musicales', 'Canciones originales', 'Exploración sonora'], level: 'Inicial', access: 'Freemium' },
      { name: 'Adobe Podcast', url: 'https://podcast.adobe.com/', description: 'Mejora la claridad de grabaciones de voz y prepara audio hablado.', uses: ['Limpiar entrevistas', 'Mejorar voz', 'Preparar podcasts'], level: 'Inicial', access: 'Freemium' }
    ],
    exercise: 'Convierte un texto propio en un guion narrado. Prueba una voz sintética o graba tu voz y mejora el audio. La clonación requiere autorización expresa.'
  },
  {
    id: 'apps',
    title: 'Aplicaciones y web',
    subtitle: 'Prototipa sitios, herramientas y aplicaciones con apoyo de IA.',
    icon: Code2,
    color: 'blue',
    tools: [
      { name: 'Lovable', url: 'https://lovable.dev/', description: 'Construye prototipos de aplicaciones y sitios describiendo lo que necesitas.', uses: ['Crear interfaces', 'Prototipar productos', 'Conectar servicios'], level: 'Intermedio', access: 'Freemium', featured: true },
      { name: 'Bolt', url: 'https://bolt.new/', description: 'Crea y prueba aplicaciones web a partir de instrucciones conversacionales.', uses: ['Prototipos web', 'Interfaces funcionales', 'Experimentos rápidos'], level: 'Intermedio', access: 'Freemium' },
      { name: 'Replit', url: 'https://replit.com/', description: 'Programa, ejecuta y publica proyectos desde un entorno en línea.', uses: ['Desarrollar aplicaciones', 'Probar código', 'Publicar prototipos'], level: 'Intermedio', access: 'Freemium' },
      { name: 'Cursor', url: 'https://cursor.com/', description: 'Editor de código con asistencia de IA para comprender y desarrollar proyectos.', uses: ['Programar', 'Revisar código', 'Mantener proyectos'], level: 'Avanzado', access: 'Freemium' }
    ],
    exercise: 'Describe una necesidad en una frase, define quién la usaría y construye un prototipo pequeño. Prueba sus funciones y revisa privacidad, seguridad y accesibilidad antes de publicarlo.'
  },
  {
    id: 'juegos',
    title: 'Juegos y educación',
    subtitle: 'Diseña dinámicas, retos y experiencias para aprender jugando.',
    icon: Gamepad2,
    color: 'green',
    tools: [
      { name: 'Genially', url: 'https://genially.com/', description: 'Crea experiencias y contenidos interactivos, juegos y presentaciones.', uses: ['Escape rooms', 'Juegos interactivos', 'Material educativo'], level: 'Inicial', access: 'Freemium', featured: true },
      { name: 'Educaplay', url: 'https://www.educaplay.com/', description: 'Desarrolla actividades como crucigramas, asociaciones y cuestionarios.', uses: ['Retos de aprendizaje', 'Actividades de repaso', 'Juegos de palabras'], level: 'Inicial', access: 'Freemium' },
      { name: 'Kahoot!', url: 'https://kahoot.com/', description: 'Prepara juegos de preguntas y actividades grupales.', uses: ['Evaluaciones lúdicas', 'Concursos', 'Dinámicas de grupo'], level: 'Inicial', access: 'Freemium' },
      { name: 'Wordwall', url: 'https://wordwall.net/', description: 'Crea juegos de asociación, memoria, clasificación y cuestionarios.', uses: ['Juegos de memoria', 'Ruletas', 'Fichas imprimibles'], level: 'Inicial', access: 'Freemium' }
    ],
    exercise: 'Diseña un juego de memoria o asociación para un público definido. Especifica qué habilidad busca estimular y valida las reglas con participantes reales.'
  },
  {
    id: 'redes',
    title: 'Redes y comunicación',
    subtitle: 'Planea contenidos, comunica servicios y conecta con tus públicos.',
    icon: Megaphone,
    color: 'pink',
    tools: [
      { name: 'ChatGPT', url: 'https://chatgpt.com/', description: 'Apoya la ideación, escritura y planificación de contenidos.', uses: ['Calendarios editoriales', 'Guiones y textos', 'Ideas de campaña'], level: 'Inicial', access: 'Freemium', featured: true },
      { name: 'Canva', url: 'https://www.canva.com/', description: 'Diseña publicaciones, historias, presentaciones y recursos para redes.', uses: ['Carruseles', 'Historias', 'Piezas de campaña'], level: 'Inicial', access: 'Freemium' },
      { name: 'Metricool', url: 'https://metricool.com/', description: 'Organiza publicaciones y consulta métricas de redes sociales.', uses: ['Programar contenidos', 'Revisar indicadores', 'Comparar resultados'], level: 'Intermedio', access: 'Freemium' },
      { name: 'Manychat', url: 'https://manychat.com/', description: 'Automatiza conversaciones y respuestas en canales compatibles.', uses: ['Responder consultas frecuentes', 'Captar contactos', 'Guiar conversaciones'], level: 'Intermedio', access: 'Freemium' }
    ],
    exercise: 'Planea una campaña de una semana: define público, objetivo, cuatro publicaciones y una pieza audiovisual. Revisa que la información sea correcta y accesible.'
  },
  {
    id: 'automatizacion',
    title: 'Automatización y organización',
    subtitle: 'Conecta herramientas y reduce tareas repetitivas.',
    icon: Workflow,
    color: 'violet',
    tools: [
      { name: 'Make', url: 'https://www.make.com/', description: 'Conecta servicios y diseña automatizaciones visuales.', uses: ['Transferir registros', 'Enviar avisos', 'Conectar formularios'], level: 'Intermedio', access: 'Freemium', featured: true },
      { name: 'Zapier', url: 'https://zapier.com/', description: 'Automatiza acciones entre aplicaciones compatibles.', uses: ['Conectar aplicaciones', 'Crear flujos', 'Reducir tareas manuales'], level: 'Intermedio', access: 'Freemium' },
      { name: 'Notion', url: 'https://www.notion.com/', description: 'Organiza proyectos, notas, tareas y bases de conocimiento.', uses: ['Gestionar proyectos', 'Documentar procesos', 'Crear espacios de equipo'], level: 'Inicial', access: 'Freemium' },
      { name: 'Google Workspace', url: 'https://workspace.google.com/', description: 'Combina herramientas de documentos, almacenamiento, formularios y colaboración.', uses: ['Formularios y hojas', 'Compartir archivos', 'Coordinar equipos'], level: 'Inicial', access: 'Freemium' }
    ],
    exercise: 'Dibuja un proceso repetitivo de principio a fin. Identifica qué información entra, qué tarea puede automatizarse y dónde se debe revisar el resultado.'
  }
];

const colorClasses: Record<string, string> = {
  yellow: 'bg-[#fff4c2] text-[#816100] border-[#f1d66d]',
  violet: 'bg-[#eee9ff] text-[#5e48d5] border-[#d7ccff]',
  pink: 'bg-[#ffe6f1] text-[#a52d67] border-[#ffc4dd]',
  orange: 'bg-[#ffeadc] text-[#a84b16] border-[#ffd0b1]',
  cyan: 'bg-[#def8f8] text-[#126b70] border-[#b4e9e9]',
  blue: 'bg-[#e5efff] text-[#2856a3] border-[#c6d9ff]',
  green: 'bg-[#e5f5e9] text-[#27643a] border-[#c2e7cb]'
};

const levelLabel: Record<Tool['level'], string> = {
  Inicial: 'Inicial',
  Intermedio: 'Intermedio',
  Avanzado: 'Avanzado'
};

export const AiToolsSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [showAllTools, setShowAllTools] = useState(false);

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return categories
      .filter(category => activeCategory === 'todos' || category.id === activeCategory)
      .map(category => ({
        ...category,
        tools: category.tools.filter(tool => {
          if (showAllTools) return !normalized || [tool.name, tool.description, ...tool.uses].join(' ').toLowerCase().includes(normalized);
          return (!normalized || [tool.name, tool.description, ...tool.uses].join(' ').toLowerCase().includes(normalized))
            && (tool.featured || !normalized);
        })
      }))
      .filter(category => category.tools.length > 0);
  }, [query, activeCategory, showAllTools]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    document.getElementById(`ai-category-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="herramientas-ia" className="py-12 sm:py-16 scroll-mt-24 border-t border-[#dedbd3]">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#5e48d5] mb-3">
            <Sparkles className="w-4 h-4" /> Biblioteca de exploración
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.02]">
            Herramientas IA <span className="text-[#7656ff]">por temas.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#55514a] leading-relaxed max-w-2xl">
            No tienes que aprenderlo todo. Empieza por lo que quieres resolver, explora las herramientas y prueba una ruta que tenga sentido para tu proyecto.
          </p>
        </div>
        <div className="rounded-2xl border border-[#dedbd3] bg-white p-4 max-w-sm">
          <p className="text-xs font-black uppercase tracking-wider text-[#6e6b66] mb-1">Principio del laboratorio</p>
          <p className="font-bold leading-snug">La herramienta se adapta a tu necesidad, no al contrario.</p>
        </div>
      </div>

      <div className="rounded-3xl bg-[#111111] text-white p-5 sm:p-7 mb-8">
        <div className="flex items-center gap-2 text-[#f8c300] text-xs font-black uppercase tracking-widest mb-2">
          <Lightbulb className="w-4 h-4" /> Encuentra tu punto de partida
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-black">¿Qué te gustaría hacer?</h3>
            <p className="text-sm text-stone-300 mt-1">Busca por tema, herramienta o tarea. También puedes navegar por categorías.</p>
          </div>
          <label className="relative block w-full lg:w-[min(38vw,420px)]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ej. analizar datos, crear videos..." className="w-full rounded-xl bg-white text-[#111] pl-11 pr-10 py-3 text-sm outline-none focus:ring-4 focus:ring-[#f8c300]/35" aria-label="Buscar herramientas por tema o tarea" />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-black" aria-label="Limpiar búsqueda"><X className="w-4 h-4" /></button>}
          </label>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6" aria-label="Filtrar por categoría">
        <button onClick={() => setActiveCategory('todos')} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold border transition ${activeCategory === 'todos' ? 'bg-[#111] text-white border-[#111]' : 'bg-white border-[#dedbd3] hover:border-[#7656ff]'}`}>Todos los temas</button>
        {categories.map(category => {
          const Icon = category.icon;
          return <button key={category.id} onClick={() => scrollToCategory(category.id)} className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold border transition ${activeCategory === category.id ? 'bg-[#7656ff] text-white border-[#7656ff]' : 'bg-white border-[#dedbd3] hover:border-[#7656ff]'}`}><Icon className="w-3.5 h-3.5" />{category.title}</button>;
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="text-xs text-[#6e6b66]">{showAllTools ? 'Catálogo completo' : 'Selección inicial recomendada'} · {filteredCategories.reduce((total, category) => total + category.tools.length, 0)} herramientas visibles</p>
        <button onClick={() => setShowAllTools(v => !v)} className="inline-flex items-center gap-2 text-xs font-bold text-[#5e48d5] hover:text-[#111]">
          <SlidersHorizontal className="w-3.5 h-3.5" /> {showAllTools ? 'Ver selección recomendada' : 'Ver todas las herramientas'}
        </button>
      </div>

      <div className="space-y-8">
        {filteredCategories.map(category => {
          const Icon = category.icon;
          return (
            <article id={`ai-category-${category.id}`} key={category.id} className="scroll-mt-28">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${colorClasses[category.color] || colorClasses.violet}`}><Icon className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black">{category.title}</h3>
                  <p className="text-sm text-[#6e6b66] mt-0.5">{category.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {category.tools.map(tool => (
                  <div key={tool.name} className="bg-white border border-[#dedbd3] rounded-2xl p-4 flex flex-col min-h-[215px] hover:border-[#7656ff] hover:shadow-sm transition">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-[#6e6b66] font-bold">{category.title}</span>
                      {tool.featured && <span className="text-[9px] px-2 py-1 rounded-full bg-[#fff4c2] text-[#816100] font-black">RECOMENDADA</span>}
                    </div>
                    <h4 className="font-black text-lg leading-tight">{tool.name}</h4>
                    <p className="text-xs text-[#5c5851] leading-relaxed mt-2 flex-1">{tool.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] rounded-full bg-stone-100 px-2 py-1 text-stone-600">{tool.level}</span>
                      <span className="text-[10px] rounded-full bg-stone-100 px-2 py-1 text-stone-600">{tool.access}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-stone-100 mt-3 pt-3">
                      <button onClick={() => setActiveTool(tool)} className="text-xs font-bold text-[#5e48d5] hover:text-[#111]">Ver ficha</button>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#111] hover:text-[#7656ff]">Abrir herramienta <ArrowUpRight className="w-3.5 h-3.5" /></a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-xl bg-[#f0eee8] p-4 flex gap-3">
                <GraduationCap className="w-5 h-5 text-[#5e48d5] shrink-0 mt-0.5" />
                <div><p className="text-xs font-black uppercase tracking-wider mb-1">Prueba sugerida</p><p className="text-sm text-[#45423d] leading-relaxed">{category.exercise}</p></div>
              </div>
            </article>
          );
        })}
        {filteredCategories.length === 0 && <div className="text-center py-12 bg-white rounded-2xl border border-[#dedbd3]"><Search className="w-7 h-7 mx-auto text-stone-400 mb-2" /><p className="font-bold">No encontramos herramientas con esa búsqueda.</p><button onClick={() => { setQuery(''); setActiveCategory('todos'); }} className="mt-2 text-sm font-bold text-[#5e48d5]">Limpiar filtros</button></div>}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#dedbd3] bg-white p-5">
          <div className="flex items-center gap-2 mb-2"><Database className="w-5 h-5 text-[#5e48d5]" /><h3 className="font-black text-lg">Una ruta, varias herramientas</h3></div>
          <p className="text-sm text-[#5c5851] leading-relaxed">Organiza tus materiales en Drive, investiga con NotebookLM, analiza con un asistente IA y comunica los resultados con Canva, video o una aplicación. No necesitas usar todas las plataformas: elige las que aporten valor.</p>
        </div>
        <div className="rounded-2xl border border-[#dedbd3] bg-white p-5">
          <div className="flex items-center gap-2 mb-2"><Clock3 className="w-5 h-5 text-[#5e48d5]" /><h3 className="font-black text-lg">Antes de empezar</h3></div>
          <p className="text-sm text-[#5c5851] leading-relaxed">Los planes, precios y límites cambian. Revisa las condiciones de cada servicio. No cargues datos personales, clínicos, jurídicos o de menores sin autorización y medidas adecuadas de protección. Verifica siempre los resultados de IA.</p>
        </div>
      </div>

      {activeTool && (
        <div className="fixed inset-0 z-[70] bg-black/60 p-4 flex items-center justify-center" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setActiveTool(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="ai-tool-title" className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[10px] uppercase tracking-widest text-[#5e48d5] font-black mb-1">Ficha de herramienta</p><h3 id="ai-tool-title" className="text-2xl font-black">{activeTool.name}</h3></div>
              <button onClick={() => setActiveTool(null)} className="p-2 rounded-full hover:bg-stone-100" aria-label="Cerrar ficha"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-[#55514a] leading-relaxed mt-4">{activeTool.description}</p>
            <h4 className="font-black text-sm mt-5 mb-2">¿Qué puedes hacer?</h4>
            <ul className="list-disc pl-5 text-sm text-[#55514a] space-y-1">{activeTool.uses.map(use => <li key={use}>{use}</li>)}</ul>
            <div className="flex flex-wrap gap-2 mt-5"><span className="text-xs rounded-full bg-stone-100 px-3 py-1.5">{levelLabel[activeTool.level]}</span><span className="text-xs rounded-full bg-stone-100 px-3 py-1.5">{activeTool.access}</span></div>
            <a href={activeTool.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#f8c300] hover:bg-[#e5b300] text-[#111] font-black text-sm py-3">Explorar {activeTool.name} <ExternalLink className="w-4 h-4" /></a>
          </section>
        </div>
      )}
    </section>
  );
};

export default AiToolsSection;
