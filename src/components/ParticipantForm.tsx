import React, { useState } from 'react';
import { CREATIVE_LANGUAGES, ParticipantContribution } from '../types';
import {
  Check,
  Send,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Palette,
  Camera,
  BookOpen,
  Video,
  Volume2,
  HandMetal,
  Code2,
  Cpu,
  Box,
  MapPin,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ParticipantFormProps {
  onSubmit: (contribution: ParticipantContribution) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Palette: <Palette className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Volume2: <Volume2 className="w-4 h-4" />,
  HandMetal: <HandMetal className="w-4 h-4" />,
  Code2: <Code2 className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Box: <Box className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />
};

export const ParticipantForm: React.FC<ParticipantFormProps> = ({ onSubmit }) => {
  const [alias, setAlias] = useState('');
  const [role, setRole] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [themes, setThemes] = useState('');
  const [memory, setMemory] = useState('');
  const [wish, setWish] = useState('');
  const [resources, setResources] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const toggleLanguage = (langName: string) => {
    if (selectedLanguages.includes(langName)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== langName));
      setStatusMessage(null);
    } else {
      if (selectedLanguages.length >= 3) {
        setStatusMessage({
          text: 'Puedes elegir máximo 3 lenguajes creativos para priorizar tu enfoque.',
          isError: true
        });
        return;
      }
      setSelectedLanguages([...selectedLanguages, langName]);
      setStatusMessage(null);
    }
  };

  const handleReset = () => {
    setAlias('');
    setRole('');
    setSelectedLanguages([]);
    setThemes('');
    setMemory('');
    setWish('');
    setResources('');
    setStatusMessage({ text: 'Ficha limpiada. Lista para un nuevo aporte.' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedLanguages.length === 0) {
      setStatusMessage({
        text: 'Por favor, selecciona al menos 1 lenguaje creativo (máximo 3) para continuar.',
        isError: true
      });
      return;
    }

    if (!themes.trim() && !wish.trim()) {
      setStatusMessage({
        text: 'Comparte al menos un tema de interés o lo que te gustaría crear para enriquecer el mapa colectivo.',
        isError: true
      });
      return;
    }

    const newRecord: ParticipantContribution = {
      id: Date.now(),
      alias: alias.trim() || 'Participante anónimo/a',
      role: role || 'Participante del taller',
      languages: selectedLanguages,
      themes: themes.trim(),
      memory: memory.trim(),
      wish: wish.trim(),
      resources: resources.trim(),
      createdAt: new Date().toISOString()
    };

    onSubmit(newRecord);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f8c300', '#7656ff', '#ff4fa3', '#111111']
      });
    } catch {
      // safe fallback
    }

    setStatusMessage({
      text: '¡Aporte sumado con éxito al mapa colectivo! Gracias por enriquecer la sesión.'
    });

    // Reset fields for the next participant or clean state
    setAlias('');
    setRole('');
    setSelectedLanguages([]);
    setThemes('');
    setMemory('');
    setWish('');
    setResources('');
  };

  return (
    <section id="participar" className="py-10 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#5e48d5]">
            Paso 01
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            01. Cuéntanos de ti
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-xl">
            Completa esta ficha. Puedes responder con total libertad y sin compartir datos personales sensibles.
          </p>
        </div>
        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dedbd3] bg-white text-xs font-bold text-[#111111]">
          ⏱ Participación · 3–5 min
        </span>
      </div>

      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-9 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Row: Alias & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="form-alias" className="block text-sm font-extrabold text-[#111111] mb-2">
                ¿Cómo te llamamos? <span className="font-normal text-stone-500">(opcional)</span>
              </label>
              <input
                id="form-alias"
                type="text"
                maxLength={50}
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Nombre, apodo o seudónimo colectivo"
                className="w-full border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl px-4 py-3 text-sm text-[#111111] bg-white transition outline-none"
              />
            </div>

            <div>
              <label htmlFor="form-role" className="block text-sm font-extrabold text-[#111111] mb-2">
                ¿Desde dónde participas?
              </label>
              <select
                id="form-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl px-4 py-3 text-sm text-[#111111] bg-white transition outline-none"
              >
                <option value="">Elige una opción de afinidad</option>
                <option value="Artista o creador/a">Artista o creador/a</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Docente o formador/a">Docente o formador/a</option>
                <option value="Gestor/a cultural">Gestor/a cultural</option>
                <option value="Integrante de un colectivo">Integrante de un colectivo</option>
                <option value="Curiosidad y ganas de explorar">Curiosidad y ganas de explorar</option>
                <option value="Otra experiencia">Otra experiencia comunitaria</option>
              </select>
            </div>
          </div>

          {/* Languages Selector */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
              <label className="block text-sm font-extrabold text-[#111111]">
                ¿Qué lenguajes creativos te interesan?{' '}
                <span className="font-normal text-stone-500">(elige hasta 3)</span>
              </label>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedLanguages.length === 3
                    ? 'bg-[#eee9ff] text-[#5e48d5]'
                    : selectedLanguages.length > 0
                    ? 'bg-stone-100 text-[#111111]'
                    : 'bg-stone-100 text-stone-500'
                }`}
                aria-live="polite"
              >
                {selectedLanguages.length} de 3 seleccionados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CREATIVE_LANGUAGES.map((lang) => {
                const isChecked = selectedLanguages.includes(lang.name);
                return (
                  <label
                    key={lang.id}
                    onClick={() => toggleLanguage(lang.name)}
                    className={`relative flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'border-[#7656ff] bg-[#f3f0ff] ring-2 ring-[#7656ff]/20 translate-y-[-1px]'
                        : 'border-[#dedbd3] bg-white hover:border-[#7656ff]/50 hover:bg-stone-50/70'
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition ${
                        isChecked
                          ? 'bg-[#7656ff] border-[#7656ff] text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-stone-700">{ICON_MAP[lang.iconName]}</span>
                        <strong className="text-sm font-bold text-[#111111] truncate">
                          {lang.name}
                        </strong>
                      </div>
                      <small className="block text-[11px] text-[#6e6b66] leading-tight">
                        {lang.desc}
                      </small>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Themes Textarea */}
          <div>
            <label htmlFor="form-themes" className="block text-sm font-extrabold text-[#111111] mb-2">
              ¿Qué temas, lugares, recuerdos o preguntas te gustaría explorar?
            </label>
            <textarea
              id="form-themes"
              maxLength={600}
              rows={3}
              value={themes}
              onChange={(e) => setThemes(e.target.value)}
              placeholder="Ej.: memorias del barrio, agua y naturaleza, identidad, juventudes, sonidos cotidianos, futuros posibles…"
              className="w-full border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl px-4 py-3 text-sm text-[#111111] bg-white transition outline-none resize-y"
            />
          </div>

          {/* Memory Textarea (Optional) */}
          <div>
            <label htmlFor="form-memory" className="block text-sm font-extrabold text-[#111111] mb-1">
              ¿Hay una imagen, historia, sonido o experiencia que te haya marcado?{' '}
              <span className="font-normal text-stone-500">(opcional)</span>
            </label>
            <p className="text-xs text-[#6e6b66] mb-2">
              Puedes describirla brevemente sin necesidad de compartir datos sensibles o privados.
            </p>
            <textarea
              id="form-memory"
              maxLength={500}
              rows={2}
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              placeholder="Una fotografía vieja, una frase de un abuelo, un ruido en la madrugada, una esquina..."
              className="w-full border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl px-4 py-3 text-sm text-[#111111] bg-white transition outline-none resize-y"
            />
          </div>

          {/* Creative Wish */}
          <div>
            <label htmlFor="form-wish" className="block text-sm font-extrabold text-[#111111] mb-2">
              ¿Qué te gustaría crear, expresar o compartir con otras personas?
            </label>
            <textarea
              id="form-wish"
              maxLength={500}
              rows={2}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Una idea inicial, un anhelo o una intuición, aunque todavía no esté del todo clara..."
              className="w-full border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl px-4 py-3 text-sm text-[#111111] bg-white transition outline-none resize-y"
            />
          </div>

          {/* Resources & Capacities */}
          <div>
            <label htmlFor="form-resources" className="block text-sm font-extrabold text-[#111111] mb-2">
              ¿Con qué recursos o capacidades cuentas? <span className="font-normal text-stone-500">(opcional)</span>
            </label>
            <input
              id="form-resources"
              type="text"
              maxLength={300}
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              placeholder="Celular con cámara, dibujo, laptop, voz, saberes tradicionales, herramientas manuales, trabajo en equipo…"
              className="w-full border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl px-4 py-3 text-sm text-[#111111] bg-white transition outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-sm sm:text-base transition cursor-pointer active:scale-98 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Sumar mi aporte al mapa</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 bg-[#e8e5de] hover:bg-stone-300 text-[#111111] font-bold rounded-full text-sm transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar ficha</span>
            </button>
          </div>

          {/* Status feedback message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                statusMessage.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : 'bg-[#fff9db] border-l-4 border-[#f8c300] text-stone-900'
              }`}
              aria-live="polite"
            >
              {statusMessage.text}
            </div>
          )}

          <p className="text-xs text-[#6e6b66]">
            ℹ Las respuestas quedan guardadas en la memoria local del navegador de este taller y pueden exportarse en CSV o JSON.
          </p>
        </form>
      </div>
    </section>
  );
};
