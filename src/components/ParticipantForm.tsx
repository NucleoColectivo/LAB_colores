import React, { useState } from 'react';
import { CREATIVE_LANGUAGES, ParticipantContribution } from '../types';
import {
  Check,
  Send,
  RotateCcw,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Share2,
  Palette,
  Camera,
  BookOpen,
  Video,
  Volume2,
  HandMetal,
  Code2,
  Cpu,
  Box,
  Compass,
  Globe
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
  // Personal & Contact Data
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [organization, setOrganization] = useState('');
  const [social, setSocial] = useState('');
  const [shareContact, setShareContact] = useState(true);

  // Creative Data
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
    setName('');
    setAlias('');
    setEmail('');
    setPhone('');
    setLocation('');
    setOrganization('');
    setSocial('');
    setShareContact(true);
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

    if (!name.trim() && !alias.trim()) {
      setStatusMessage({
        text: 'Por favor, indícanos tu nombre o seudónimo para reconocerte en la red del taller.',
        isError: true
      });
      return;
    }

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
      name: name.trim() || alias.trim(),
      alias: alias.trim() || name.trim() || 'Participante anónimo/a',
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      organization: organization.trim(),
      social: social.trim(),
      shareContact,
      role: role || 'Participante del taller',
      languages: selectedLanguages,
      themes: themes.trim(),
      memory: memory.trim(),
      wish: wish.trim(),
      resources: resources.trim(),
      createdAt: new Date().toISOString()
    };

    onSubmit(newRecord);

    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#f8c300', '#7656ff', '#ff4fa3', '#111111']
      });
    } catch {
      // safe fallback
    }

    setStatusMessage({
      text: '¡Conexión exitosa! Tu ficha y datos quedaron sumados al mapa y a la red de creadores del taller.'
    });

    handleReset();
  };

  return (
    <section id="participar" className="py-10 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#5e48d5]">
            Paso 01 · Registro y Afinidades
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            01. Cuéntanos de ti y conecta con la red
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-xl">
            Registra tu nombre, datos de contacto e intereses creativos para sumarte al mapa colectivo y conectar con otros creadores.
          </p>
        </div>
        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dedbd3] bg-white text-xs font-bold text-[#111111]">
          ⏱ Participación · 3–5 min
        </span>
      </div>

      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-9 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION A: DATOS PERSONALES Y DE CONTACTO */}
          <div className="p-5 sm:p-6 bg-[#faf9f6] rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-200">
              <User className="w-4 h-4 text-[#7656ff]" />
              <h3 className="text-sm font-black uppercase tracking-wider text-[#111111]">
                A. Identificación y contacto para la red
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="form-name" className="block text-xs font-extrabold text-[#111111] mb-1.5">
                  Nombre completo o artístico <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="form-name"
                    type="text"
                    required
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej.: Diana Caicedo"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="form-alias" className="block text-xs font-extrabold text-[#111111] mb-1.5">
                  ¿Cómo te llamamos? <span className="font-normal text-stone-500">(apodo / nombre corto)</span>
                </label>
                <input
                  id="form-alias"
                  type="text"
                  maxLength={50}
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Ej.: Diana C."
                  className="w-full px-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
                />
              </div>

              <div>
                <label htmlFor="form-email" className="block text-xs font-extrabold text-[#111111] mb-1.5">
                  Correo electrónico <span className="font-normal text-stone-500">(para relatoría)</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="form-email"
                    type="email"
                    maxLength={80}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="diana@correo.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="form-phone" className="block text-xs font-extrabold text-[#111111] mb-1.5">
                  Teléfono / WhatsApp <span className="font-normal text-stone-500">(opcional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="form-phone"
                    type="tel"
                    maxLength={30}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="form-location" className="block text-xs font-extrabold text-[#111111] mb-1.5">
                  Barrio / Territorio / Ciudad
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="form-location"
                    type="text"
                    maxLength={60}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej.: Comuna 13 / Medellín"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="form-org" className="block text-xs font-extrabold text-[#111111] mb-1.5">
                  Colectivo / Escuela / Organización <span className="font-normal text-stone-500">(opcional)</span>
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="form-org"
                    type="text"
                    maxLength={60}
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Ej.: Colectivo Río Vivo"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="form-social" className="block text-xs font-extrabold text-[#111111] mb-1.5">
                  Instagram / Web / Portafolio <span className="font-normal text-stone-500">(opcional)</span>
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="form-social"
                    type="text"
                    maxLength={100}
                    value={social}
                    onChange={(e) => setSocial(e.target.value)}
                    placeholder="Ej.: @dianadibujo o https://behance.net/diana"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="form-role" className="block text-xs font-extrabold text-[#111111] mb-1.5">
                  ¿Desde dónde participas?
                </label>
                <select
                  id="form-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
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

            {/* Checkbox compartir datos con el colectivo */}
            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center gap-2.5">
              <input
                id="form-share"
                type="checkbox"
                checked={shareContact}
                onChange={(e) => setShareContact(e.target.checked)}
                className="w-4 h-4 text-[#7656ff] border-stone-300 rounded focus:ring-[#7656ff] accent-[#7656ff] cursor-pointer"
              />
              <label htmlFor="form-share" className="text-xs text-stone-700 font-medium cursor-pointer">
                Compartir mi contacto en el Directorio del Taller para conectar y colaborar con otros participantes.
              </label>
            </div>
          </div>

          {/* SECTION B: LENGUAJES CREATIVOS */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
              <label className="block text-sm font-extrabold text-[#111111]">
                B. ¿Qué lenguajes creativos te interesan?{' '}
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

          {/* SECTION C: TEMAS, DESEOS Y RECURSOS */}
          <div className="space-y-4">
            <div>
              <label htmlFor="form-themes" className="block text-sm font-extrabold text-[#111111] mb-1.5">
                C. ¿Qué temas, lugares, recuerdos o preguntas te gustaría explorar?
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

            <div>
              <label htmlFor="form-memory" className="block text-sm font-extrabold text-[#111111] mb-1">
                ¿Hay una imagen, historia, sonido o experiencia que te haya marcado?{' '}
                <span className="font-normal text-stone-500">(opcional)</span>
              </label>
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

            <div>
              <label htmlFor="form-wish" className="block text-sm font-extrabold text-[#111111] mb-1.5">
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

            <div>
              <label htmlFor="form-resources" className="block text-sm font-extrabold text-[#111111] mb-1.5">
                ¿Con qué recursos, saberes o capacidades cuentas para aportar?{' '}
                <span className="font-normal text-stone-500">(opcional)</span>
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
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-sm sm:text-base transition cursor-pointer active:scale-98 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Conectar mi ficha y sumar al mapa</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-5 py-3.5 bg-[#e8e5de] hover:bg-stone-300 text-[#111111] font-bold rounded-full text-sm transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar ficha</span>
            </button>
          </div>

          {/* Status feedback message */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-medium transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                statusMessage.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : 'bg-[#fff9db] border-l-4 border-[#25D366] text-stone-900'
              }`}
              aria-live="polite"
            >
              <div>{statusMessage.text}</div>
              {!statusMessage.isError && (
                <a
                  href="https://chat.whatsapp.com/ErtCU75vz84H95zQ7Lj8rM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full text-xs font-black shrink-0 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Unirme al Grupo de WhatsApp</span>
                </a>
              )}
            </div>
          )}

          <p className="text-xs text-[#6e6b66]">
            🔒 Los datos quedan guardados para el taller y podrás conectar con los demás participantes en la sección de red y mapa colectivo.
          </p>
        </form>
      </div>
    </section>
  );
};
