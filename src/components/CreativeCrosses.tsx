import React, { useState } from 'react';
import { CROSS_TEMPLATES, CREATIVE_LANGUAGES, ParticipantContribution, CreativeCrossTemplate } from '../types';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  ArrowUpRight,
  Filter,
  Users,
  Compass,
  Lightbulb,
  Plus
} from 'lucide-react';

interface CreativeCrossesProps {
  contributions: ParticipantContribution[];
}

export const CreativeCrosses: React.FC<CreativeCrossesProps> = ({ contributions }) => {
  const [focusTheme, setFocusTheme] = useState('');
  const [audience, setAudience] = useState('La comunidad en general');
  const [challenge, setChallenge] = useState('');
  const [statusMessage, setStatusMessage] = useState('Selecciona intereses o pulsa "Generar cruces" para explorar nuevas combinaciones interdisciplinarias.');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active generated ideas
  const [generatedIdeas, setGeneratedIdeas] = useState<
    Array<CreativeCrossTemplate & { customTheme?: string; customAudience?: string; customQuestion?: string }>
  >([
    {
      match: ['Fotografía y memoria visual', 'Sonido y música'],
      title: 'Archivo vivo: imágenes que se escuchan',
      desc: 'Combinar fotografías, relatos orales y paisajes sonoros para crear un archivo sensible y afectivo del territorio.',
      q: '¿Qué historias de nuestro entorno merecen ser vistas y escuchadas con calma?',
      tagColor: 'purple'
    },
    {
      match: ['Cartografía y territorio', 'Imagen e ilustración'],
      title: 'Cartografía afectiva de lugares con alma',
      desc: 'Construir un mapa colectivo ilustrado con rutas, recuerdos, advertencias poéticas y símbolos creados en comunidad.',
      q: '¿Qué lugares cuentan quiénes somos y cómo habitamos este territorio?',
      tagColor: 'yellow'
    }
  ]);

  // Generation logic
  const handleGenerate = () => {
    // Collect all chosen languages from all contributions
    const allLanguages = Array.from(
      new Set(contributions.flatMap((c) => c.languages || []))
    );

    // Pick top theme if empty
    const derivedTheme =
      focusTheme.trim() ||
      contributions.find((c) => c.themes)?.themes?.split(/[,;.]/)[0]?.trim() ||
      'memorias, territorio y convivencia';

    // Filter matching templates
    let matched = CROSS_TEMPLATES.filter((template) =>
      template.match.some((lang) => allLanguages.includes(lang))
    );

    if (matched.length < 2) {
      // shuffle all templates to give fresh inspiration
      matched = [...CROSS_TEMPLATES].sort(() => 0.5 - Math.random());
    } else {
      matched = [...matched].sort(() => 0.5 - Math.random());
    }

    const selected = matched.slice(0, 4).map((t) => ({
      ...t,
      customTheme: derivedTheme,
      customAudience: audience,
      customQuestion: challenge.trim() || t.q
    }));

    setGeneratedIdeas(selected);
    setStatusMessage('Cruces generados a partir de los lenguajes y temas del grupo. Conversen y adapten la propuesta antes de elegir.');
  };

  const handleSelectAsStartingPoint = (ideaTitle: string, question: string) => {
    setFocusTheme(ideaTitle);
    setChallenge(question);
    setStatusMessage(`"${ideaTitle}" trasladada al espacio de enfoque. Ajusten el tema y la pregunta entre todas y todos.`);

    const el = document.getElementById('ideas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadIdea = (idea: CreativeCrossTemplate & { customTheme?: string; customAudience?: string; customQuestion?: string }) => {
    const textContent = `=========================================
FICHA DE IDEACIÓN — NÚCLEO COLECTIVO
Laboratorio de Ideas · Sesión 1
=========================================

TÍTULO DEL CRUCE:
${idea.title}

DISCIPLINAS QUE SE ENCUENTRAN:
${idea.match.join(' + ')}

DESCRIPCIÓN DEL PROYECTO:
${idea.desc}

TEMA / INQUIETUD EXPLORADA:
${idea.customTheme || focusTheme || 'Memorias y territorio'}

PÚBLICO / COMUNIDAD:
${idea.customAudience || audience}

PREGUNTA GENERADORA:
${idea.customQuestion || challenge || idea.q}

NOTAS DEL EQUIPO:
- ¿Qué tenemos a la mano para empezar?
- ¿A quién invitamos a la conversación?
- Primer prototipo en 1 hora:

Núcleo Colectivo — Crear con lo que tenemos. Imaginar lo que podemos ser.
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha-cruce-${idea.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setStatusMessage(`Ficha descargada: "${idea.title}".`);
  };

  const handleCopyIdea = async (
    idea: CreativeCrossTemplate & { customTheme?: string; customAudience?: string; customQuestion?: string },
    index: number
  ) => {
    const summary = `✦ ${idea.title} [${idea.match.join(' + ')}]\n${idea.desc}\nTema: ${idea.customTheme || focusTheme || 'General'}\nPregunta: ${idea.customQuestion || idea.q}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedId(`idea-${index}`);
      setTimeout(() => setCopiedId(null), 2000);
      setStatusMessage('Idea copiada al portapapeles.');
    } catch {
      // fallback
    }
  };

  return (
    <section id="ideas" className="py-10 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#5e48d5]">
            Paso 03
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            03. Cruces para imaginar
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-xl">
            La herramienta sugiere combinaciones interdisciplinarias a partir de los intereses del mapa. Son puntos de partida para dialogar, no conclusiones fijas.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-sm transition cursor-pointer active:scale-98 shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generar nuevos cruces</span>
        </button>
      </div>

      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Synthesis Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label htmlFor="focus-theme" className="block text-sm font-extrabold text-[#111111] mb-2">
              Tema o necesidad que queremos explorar
            </label>
            <input
              id="focus-theme"
              type="text"
              value={focusTheme}
              onChange={(e) => setFocusTheme(e.target.value)}
              placeholder="Ej.: memorias del barrio, convivencia, agua, identidad, futuros..."
              className="w-full border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl px-4 py-3 text-sm text-[#111111] bg-white transition outline-none"
            />
          </div>

          <div>
            <label htmlFor="audience-select" className="block text-sm font-extrabold text-[#111111] mb-2">
              ¿Con quién o para quién?
            </label>
            <select
              id="audience-select"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl px-4 py-3 text-sm text-[#111111] bg-white transition outline-none"
            >
              <option value="La comunidad en general">La comunidad en general</option>
              <option value="Niños, niñas y adolescentes">Niños, niñas y adolescentes</option>
              <option value="Jóvenes">Jóvenes</option>
              <option value="Personas mayores">Personas mayores</option>
              <option value="Un colectivo cultural">Un colectivo cultural</option>
              <option value="Varias generaciones juntas">Varias generaciones juntas</option>
              <option value="Artistas y creadores">Artistas y creadores</option>
            </select>
          </div>
        </div>

        {/* Challenge textarea */}
        <div className="mb-6">
          <label htmlFor="challenge-text" className="block text-sm font-extrabold text-[#111111] mb-2">
            ¿Qué nos gustaría comprender, transformar o compartir?
          </label>
          <textarea
            id="challenge-text"
            rows={2}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Ej.: ¿Cómo podemos compartir las historias del barrio que casi nunca se escuchan pero que guardan la memoria viva?"
            className="w-full border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl px-4 py-3 text-sm text-[#111111] bg-white transition outline-none resize-y"
          />
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generatedIdeas.map((idea, index) => {
            const isCopied = copiedId === `idea-${index}`;
            return (
              <article
                key={`${idea.title}-${index}`}
                className="p-6 rounded-2xl border border-[#dedbd3] bg-[#faf9f6] hover:bg-white transition flex flex-col justify-between shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full ${
                        index % 2 === 0
                          ? 'bg-[#eee9ff] text-[#5e48d5]'
                          : 'bg-[#fff1a8] text-[#8a6800]'
                      }`}
                    >
                      Cruce posible 0{index + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyIdea(idea, index)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition"
                        title="Copiar resumen del cruce"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadIdea(idea)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition"
                        title="Descargar Ficha de Ideación en texto"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#111111] mb-2 leading-snug">
                    {idea.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#45423d] leading-relaxed mb-3">
                    {idea.desc}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {idea.match.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded-md bg-stone-200/80 text-[#111111] text-[11px] font-semibold"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-200/80 mb-4 text-xs">
                    <span className="font-extrabold text-[#5e48d5] block mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Pregunta generadora:
                    </span>
                    <p className="font-medium text-stone-800 italic">
                      "{idea.customQuestion || idea.q}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Público: {idea.customAudience || audience}
                  </span>
                  <button
                    onClick={() =>
                      handleSelectAsStartingPoint(
                        idea.title,
                        idea.customQuestion || idea.q
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#111111] hover:text-[#7656ff] transition cursor-pointer"
                  >
                    <span>Elegir como punto de partida</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Live status feedback */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2 text-xs text-[#6e6b66]">
          <p aria-live="polite">{statusMessage}</p>
          <span className="italic">
            Tip: Usa el botón "Descargar Ficha" para entregar una copia a cada mesa de trabajo.
          </span>
        </div>
      </div>
    </section>
  );
};
