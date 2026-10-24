import React, { useState, useMemo } from 'react';
import { CREATIVE_LANGUAGES, ParticipantContribution, LanguageDefinition } from '../types';
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
  Globe,
  MessageCircle,
  Scissors,
  PenTool,
  Film,
  Activity,
  Leaf,
  GraduationCap
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
  Compass: <Compass className="w-4 h-4" />,
  Scissors: <Scissors className="w-4 h-4" />,
  PenTool: <PenTool className="w-4 h-4" />,
  Film: <Film className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />
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
  const [dataConsent, setDataConsent] = useState(true);

  // Creative Data
  const [role, setRole] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');
  const [themes, setThemes] = useState('');
  const [memory, setMemory] = useState('');
  const [wish, setWish] = useState('');
  const [resources, setResources] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const CATEGORY_MAP: Record<string, string[]> = {
    'Imagen': ['Imagen e ilustración'],
    'Interactivo': ['Arte interactivo', 'Experiencias inmersivas'],
    'Video': ['Video y audiovisual'],
    'Animación de video': ['Animación y 3D'],
    'Lenguaje audiovisual': ['Fotografía y memoria visual', 'Cómic y narrativas gráficas'],
    'Programación creativa': ['Programación creativa', 'IA y experimentación'],
    'Textil': ['Textil, bordado y materias vivas'],
    'Performance': ['Performance y cuerpo'],
    'Ecología': ['Ecología y ciencia ciudadana'],
    'Pedagogía': ['Pedagogía y saberes tradicionales'],
    'ETC': ['Sonido y música', 'Instalación y objetos', 'Cartografía y territorio', 'Futuros imaginados', 'Escritura, poesía y fanzine']
  };

  const filteredLanguages: LanguageDefinition[] = useMemo(() => {
    if (activeCategoryFilter === 'Todos') return CREATIVE_LANGUAGES;
    const allowed = CATEGORY_MAP[activeCategoryFilter] || [];
    return CREATIVE_LANGUAGES.filter((l) => allowed.includes(l.name));
  }, [activeCategoryFilter]);

  // Multidisciplinary selection without strict upper limit
  const toggleLanguage = (langName: string) => {
    if (selectedLanguages.includes(langName)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== langName));
    } else {
      setSelectedLanguages([...selectedLanguages, langName]);
    }
    setStatusMessage(null);
  };

  const selectAllLanguages = () => {
    setSelectedLanguages(CREATIVE_LANGUAGES.map((l) => l.name));
    setStatusMessage(null);
  };

  const clearLanguages = () => {
    setSelectedLanguages([]);
    setStatusMessage(null);
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
    setDataConsent(true);
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

    if (!dataConsent) {
      setStatusMessage({
        text: 'Por favor marca la casilla de autorización para que Manuel Palacio (+57 300 610 1221) y Núcleo Colectivo puedan registrar tus datos en el taller.',
        isError: true
      });
      return;
    }

    if (selectedLanguages.length === 0) {
      setStatusMessage({
        text: 'Por favor, selecciona al menos 1 lenguaje creativo que te interese para continuar.',
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
      dataConsent: true,
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
            Registra tu nombre, datos de contacto y selecciona todos los lenguajes creativos que te interesen para sumarte al mapa colectivo.
          </p>
        </div>
        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dedbd3] bg-white text-xs font-bold text-[#111111]">
          ⏱ Participación abierta · 3–5 min
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

            {/* Checkboxes de autorización y contacto */}
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-3">
              {/* Autorización Habeas Data Manuel Palacio */}
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-stone-200/90 shadow-2xs">
                <input
                  id="form-consent"
                  type="checkbox"
                  required
                  checked={dataConsent}
                  onChange={(e) => setDataConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#7656ff] border-stone-300 rounded focus:ring-[#7656ff] accent-[#7656ff] cursor-pointer"
                />
                <label htmlFor="form-consent" className="text-xs text-stone-800 leading-snug cursor-pointer">
                  <strong className="text-stone-900 block font-bold mb-0.5">
                    Autorización de tratamiento de datos (Habeas Data):
                  </strong>
                  Autorizo a <strong>Manuel Palacio (+57 300 610 1221)</strong> y a <strong>Núcleo Colectivo</strong> a recopilar y custodiar mis datos para la memoria del taller, convocatorias culturales y la red de colaboración creativa.
                </label>
              </div>

              {/* Checkbox compartir contacto en el directorio */}
              <div className="flex items-center gap-2.5 px-1">
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

              {/* Contacto directo con Manuel Palacio */}
              <div className="pt-2 text-[11px] text-stone-500 flex items-center justify-between flex-wrap gap-2">
                <span>Facilitador del laboratorio: <strong>Manuel Palacio</strong></span>
                <a
                  href="https://wa.me/573006101221?text=Hola%20Manuel,%20tengo%20una%20consulta%20sobre%20el%20Laboratorio%20de%20Medios%20Digitales%20e%20IA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp directo: +57 300 610 1221</span>
                </a>
              </div>
            </div>
          </div>

          {/* SECTION B: LENGUAJES CREATIVOS (SIN LÍMITE RESTRICTIVO DE 3) */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <div>
                <label className="block text-sm font-extrabold text-[#111111]">
                  B. ¿Qué lenguajes creativos te interesan?{' '}
                  <span className="font-normal text-stone-500">(selecciona todos los que te convoquen)</span>
                </label>
                <span className="text-xs text-stone-500 block mt-0.5">
                  Elige libremente todas tus disciplinas y áreas de curiosidad para reflejar tu perfil multidisciplinario.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllLanguages}
                  className="px-3 py-1 text-xs font-bold text-[#7656ff] bg-[#eee9ff] hover:bg-[#ded4ff] rounded-full transition cursor-pointer"
                >
                  Seleccionar todos
                </button>
                {selectedLanguages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearLanguages}
                    className="px-2.5 py-1 text-xs font-medium text-stone-500 hover:text-stone-800 transition cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full transition ${
                    selectedLanguages.length > 0
                      ? 'bg-[#111111] text-[#f8c300] shadow-2xs'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                  aria-live="polite"
                >
                  {selectedLanguages.length} seleccionados
                </span>
              </div>
            </div>

            {/* Categorías (Separación explícita según solicitud) */}
            <div className="mb-3.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-[11px] font-black uppercase text-stone-500 whitespace-nowrap mr-1">
                  Categorías:
                </span>
                {[
                  'Todos',
                  'Imagen',
                  'Interactivo',
                  'Video',
                  'Animación de video',
                  'Lenguaje audiovisual',
                  'Programación creativa',
                  'Textil',
                  'Performance',
                  'Ecología',
                  'Pedagogía',
                  'ETC'
                ].map((cat) => {
                  const isActive = activeCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#111111] text-[#f8c300] shadow-2xs ring-1 ring-stone-900'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredLanguages.map((lang) => {
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

          {/* Personalized Welcome & WhatsApp Introduction Banner */}
          {statusMessage && (
            <div
              className={`p-5 rounded-2xl text-xs sm:text-sm font-medium transition ${
                statusMessage.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : 'bg-[#fff9db] border-2 border-[#25D366] text-stone-900 shadow-sm'
              }`}
              aria-live="polite"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#f8c300]" />
                  <strong className="text-base font-black text-stone-900">
                    {statusMessage.text}
                  </strong>
                </div>

                {!statusMessage.isError && (
                  <a
                    href="https://chat.whatsapp.com/ErtCU75vz84H95zQ7Lj8rM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full text-xs font-black shrink-0 transition shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Entrar al Grupo de WhatsApp</span>
                  </a>
                )}
              </div>

              {!statusMessage.isError && (
                <div className="pt-3 border-t border-[#25D366]/30 text-xs text-stone-700 space-y-2">
                  <p>
                    🎉 <strong>Siguiente paso recomendado:</strong> Preséntate en el grupo de WhatsApp con tu nombre y lo que te gustaría crear para que el colectivo empiece a conocerte.
                  </p>
                </div>
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
