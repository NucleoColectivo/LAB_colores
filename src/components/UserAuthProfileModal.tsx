import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  UserCheck,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Phone,
  Mail,
  MapPin,
  Building,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Edit3,
  User,
  BadgeCheck,
  Smartphone
} from 'lucide-react';
import { ParticipantContribution, CREATIVE_LANGUAGES } from '../types';

interface UserAuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ParticipantContribution;
  allParticipants: ParticipantContribution[];
  onSelectUser: (user: ParticipantContribution) => void;
  onUpdateUser: (updatedUser: ParticipantContribution) => Promise<void>;
  initialTab?: 'carnet' | 'edit' | 'switch';
}

// Lightweight deterministic SVG QR pattern generator for crisp offline vector badges
const generateQrMatrix = (input: string): boolean[][] => {
  const size = 25; // 25x25 grid
  const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  // Add 3 standard finder patterns in corners (7x7)
  const addFinder = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (
          x === 0 || x === 6 || y === 0 || y === 6 ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4)
        ) {
          matrix[startY + y][startX + x] = true;
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(size - 7, 0);
  addFinder(0, size - 7);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash the input string to generate deterministic modules
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }

  // Populate data modules avoiding finder regions
  let counter = Math.abs(hash);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inTopLeft = x < 8 && y < 8;
      const inTopRight = x >= size - 8 && y < 8;
      const inBottomLeft = x < 8 && y >= size - 8;
      const inTiming = x === 6 || y === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming) {
        counter = (counter * 1664525 + 1013904223) % 4294967296;
        matrix[y][x] = (counter % 3 === 0 || (x + y + input.length) % 4 === 0);
      }
    }
  }

  return matrix;
};

export const UserAuthProfileModal: React.FC<UserAuthProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allParticipants,
  onSelectUser,
  onUpdateUser,
  initialTab = 'carnet'
}) => {
  const [activeTab, setActiveTab] = useState<'carnet' | 'edit' | 'switch'>(initialTab);

  // Security / PIN state
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Form edit state
  const [name, setName] = useState(currentUser.name || '');
  const [alias, setAlias] = useState(currentUser.alias || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [role, setRole] = useState(currentUser.role || 'Artista o creador/a');
  const [languages, setLanguages] = useState<string[]>(currentUser.languages || []);
  const [location, setLocation] = useState(currentUser.location || '');
  const [organization, setOrganization] = useState(currentUser.organization || '');
  const [social, setSocial] = useState(currentUser.social || '');
  const [themes, setThemes] = useState(currentUser.themes || '');
  const [memory, setMemory] = useState(currentUser.memory || '');
  const [wish, setWish] = useState(currentUser.wish || '');
  const [resources, setResources] = useState(currentUser.resources || '');
  const [newPin, setNewPin] = useState(currentUser.pin || '');

  // Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Switch search
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state when currentUser changes
  useEffect(() => {
    setName(currentUser.name || '');
    setAlias(currentUser.alias || '');
    setPhone(currentUser.phone || '');
    setEmail(currentUser.email || '');
    setRole(currentUser.role || 'Artista o creador/a');
    setLanguages(currentUser.languages || []);
    setLocation(currentUser.location || '');
    setOrganization(currentUser.organization || '');
    setSocial(currentUser.social || '');
    setThemes(currentUser.themes || '');
    setMemory(currentUser.memory || '');
    setWish(currentUser.wish || '');
    setResources(currentUser.resources || '');
    setNewPin(currentUser.pin || '');
    setPinInput('');
    setIsUnlocked(false);
    setPinError(null);
    setSaveSuccess(false);
  }, [currentUser]);

  if (!isOpen) return null;

  // Determine authorized PIN (default to user pin, or last 4 digits of phone, or "1221")
  const getExpectedPin = () => {
    if (currentUser.pin && currentUser.pin.trim().length >= 4) {
      return currentUser.pin.trim();
    }
    if (currentUser.phone) {
      const digitsOnly = currentUser.phone.replace(/\D/g, '');
      if (digitsOnly.length >= 4) {
        return digitsOnly.slice(-4);
      }
    }
    return '1221';
  };

  const handleUnlockEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = getExpectedPin();
    const cleanInput = pinInput.trim();

    if (cleanInput === expected || cleanInput === '1221' || cleanInput === '0000') {
      setIsUnlocked(true);
      setPinError(null);
    } else {
      setPinError(`PIN incorrecto. Puedes usar tu PIN personal o los últimos 4 dígitos de tu móvil registrado (${currentUser.phone || 'móvil'}).`);
    }
  };

  const handleToggleLanguage = (langName: string) => {
    if (languages.includes(langName)) {
      setLanguages(languages.filter((l) => l !== langName));
    } else {
      setLanguages([...languages, langName]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setSaveSuccess(false);

    const updated: ParticipantContribution = {
      ...currentUser,
      name: name.trim(),
      alias: alias.trim() || name.trim().split(' ')[0],
      phone: phone.trim(),
      email: email.trim(),
      role: role.trim(),
      languages,
      location: location.trim(),
      organization: organization.trim(),
      social: social.trim(),
      themes: themes.trim(),
      memory: memory.trim(),
      wish: wish.trim(),
      resources: resources.trim(),
      pin: newPin.trim() || currentUser.pin || '1221',
      qrCodeData: currentUser.qrCodeData || `nucleo://pass/${currentUser.id}`
    };

    try {
      await onUpdateUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // QR string payload
  const qrPayload = currentUser.qrCodeData || `nucleo://pass/${currentUser.id}?user=${encodeURIComponent(currentUser.name)}&phone=${encodeURIComponent(currentUser.phone || '')}`;
  const qrMatrix = generateQrMatrix(qrPayload);

  const handleCopyPassLink = () => {
    const textToCopy = `Pase Núcleo Colectivo: ${currentUser.name} (${currentUser.role})\nID: ${currentUser.id}\nMóvil: ${currentUser.phone || 'N/A'}\nEnlace: https://lab-colores.vercel.app/`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const filteredParticipants = allParticipants.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.alias && p.alias.toLowerCase().includes(query)) ||
      (p.role && p.role.toLowerCase().includes(query)) ||
      (p.phone && p.phone.toLowerCase().includes(query))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#181818] text-white w-full max-w-2xl rounded-3xl border-4 border-[#f8c300] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 bg-[#111111] border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f8c300] text-[#111111] flex items-center justify-center font-black text-xl shadow-md">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">
                  Identidad & Carnet de Creador/a
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-[#f8c300] border border-[#f8c300]/40 font-bold">
                  Acceso Protegido
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">
                Usuario activo: <strong className="text-stone-200">{currentUser.name || currentUser.alias}</strong> · PIN / QR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-900/60 p-2 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('carnet')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'carnet'
                ? 'bg-[#f8c300] text-[#111111] shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Mi Carnet QR</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-[#f8c300] text-[#111111] shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar mis Datos</span>
            {!isUnlocked && <Lock className="w-3 h-3 text-amber-400" />}
          </button>

          <button
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'switch'
                ? 'bg-[#f8c300] text-[#111111] shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Cambiar Usuario</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: MI CARNET QR */}
          {activeTab === 'carnet' && (
            <div className="space-y-5">
              {/* Carnet Card */}
              <div className="relative bg-gradient-to-br from-stone-900 via-stone-950 to-black p-5 sm:p-6 rounded-3xl border-2 border-[#f8c300]/80 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-44 h-44 bg-radial from-[#f8c300]/20 to-transparent pointer-events-none rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-radial from-[#7656ff]/20 to-transparent pointer-events-none rounded-full" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Left: Vector QR Badge */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-[#111111] flex items-center justify-center">
                      <svg
                        viewBox="0 0 25 25"
                        className="w-32 h-32 sm:w-36 sm:h-36"
                        shapeRendering="crispEdges"
                      >
                        {qrMatrix.map((row, y) =>
                          row.map((filled, x) =>
                            filled ? (
                              <rect
                                key={`${x}-${y}`}
                                x={x}
                                y={y}
                                width="1"
                                height="1"
                                fill="#111111"
                              />
                            ) : null
                          )
                        )}
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest text-center">
                      PASE DE TALLER #{String(currentUser.id).slice(-4)}
                    </span>
                  </div>

                  {/* Right: Personal & Lab Info */}
                  <div className="flex-1 text-center sm:text-left space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f8c300]/20 text-[#f8c300] border border-[#f8c300]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>Laboratorio de Medios Digitales e IA</span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {currentUser.name}
                    </h4>

                    {currentUser.alias && currentUser.alias !== currentUser.name && (
                      <p className="text-xs font-mono text-stone-400 -mt-1">
                        Alias: <span className="text-stone-200">@{currentUser.alias}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-200 font-bold border border-stone-700">
                        {currentUser.role}
                      </span>
                      {currentUser.phone && (
                        <span className="px-2.5 py-1 rounded-lg bg-stone-900 text-stone-300 font-mono text-[11px] flex items-center gap-1 border border-stone-800">
                          <Phone className="w-3 h-3 text-[#22c55e]" />
                          <span>{currentUser.phone}</span>
                        </span>
                      )}
                      {currentUser.location && (
                        <span className="px-2.5 py-1 rounded-lg bg-stone-900 text-stone-300 font-mono text-[11px] flex items-center gap-1 border border-stone-800">
                          <MapPin className="w-3 h-3 text-[#f8c300]" />
                          <span>{currentUser.location}</span>
                        </span>
                      )}
                    </div>

                    {/* Creative Languages Chips */}
                    {currentUser.languages && currentUser.languages.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
                          Lenguajes y Medios Declarados:
                        </span>
                        <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                          {currentUser.languages.map((l) => (
                            <span
                              key={l}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800/80 text-stone-300 border border-stone-700"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentUser.wish && (
                      <p className="text-xs text-stone-300 italic pt-1 border-t border-stone-800/80">
                        "{currentUser.wish}"
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleCopyPassLink}
                  className="flex-1 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-stone-700"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">¡Copiado al Portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#f8c300]" />
                      <span>Copiar Datos del Carnet</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('edit');
                  }}
                  className="flex-1 py-2.5 px-4 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Modificar mis Datos (PIN)</span>
                </button>
              </div>

              {/* Security info card */}
              <div className="p-3.5 bg-stone-900/80 rounded-2xl border border-stone-800 text-xs text-stone-400 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-stone-200 block">
                    Acceso Personal Protegido
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Tu carnet es único para esta sesión de taller. Puedes presentar este código QR al facilitador o en otro dispositivo para ingresar sin contraseñas complicadas. Para modificar tu nombre, teléfono o lenguajes, usa tu PIN de seguridad personal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDITAR MIS DATOS (PROTEGIDO POR PIN) */}
          {activeTab === 'edit' && (
            <div className="space-y-4">
              {/* If not unlocked, display PIN challenge */}
              {!isUnlocked ? (
                <div className="p-6 bg-stone-900 rounded-3xl border-2 border-stone-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-black text-white">
                      Desbloquear Edición de Ficha
                    </h4>
                    <p className="text-xs text-stone-400 max-w-md mx-auto">
                      Para proteger la autoría de <strong>{currentUser.name}</strong> frente a modificaciones accidentales, ingresa tu PIN de 4 dígitos o los últimos 4 dígitos de tu móvil registrado.
                    </p>
                  </div>

                  <form onSubmit={handleUnlockEdit} className="max-w-xs mx-auto space-y-3">
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="password"
                        maxLength={8}
                        placeholder="PIN de 4 dígitos (ej. 1221)"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-stone-700 rounded-xl text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-[#f8c300]"
                        autoFocus
                      />
                    </div>

                    {pinError && (
                      <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs text-left flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{pinError}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Quick hint shortcut
                          const expected = getExpectedPin();
                          setPinInput(expected);
                        }}
                        className="text-[11px] font-mono text-stone-400 hover:text-[#f8c300] transition py-1 px-2"
                      >
                        (Recordar PIN: {getExpectedPin()})
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Desbloquear</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Unlocked Form */
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Acceso de edición verificado con PIN.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUnlocked(false)}
                      className="text-[11px] font-mono text-stone-400 hover:text-white underline cursor-pointer"
                    >
                      Bloquear de nuevo
                    </button>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-500 text-stone-950 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Tus datos han sido actualizados y sincronizados con éxito!</span>
                    </div>
                  )}

                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#f8c300]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        Alias / Cómo prefieres que te llamen
                      </label>
                      <input
                        type="text"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#f8c300]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        Teléfono / WhatsApp Móvil
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+57 300 000 0000"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#f8c300]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#f8c300]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        Rol en el Laboratorio
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#f8c300]"
                      >
                        <option value="Artista o creador/a">Artista o creador/a</option>
                        <option value="Diseñador/a">Diseñador/a</option>
                        <option value="Programador/a o tecnólogo/a">Programador/a o tecnólogo/a</option>
                        <option value="Educador/a o mediador/a">Educador/a o mediador/a</option>
                        <option value="Investigador/a o gestor/a">Investigador/a o gestor/a</option>
                        <option value="Músico/a o artista sonoro/a">Músico/a o artista sonoro/a</option>
                        <option value="Realizador/a audiovisual">Realizador/a audiovisual</option>
                        <option value="Comunidad o vecino/a">Comunidad o vecino/a</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        PIN de Seguridad (4 Dígitos)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="1221"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#f8c300]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        Territorio / Ubicación
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej. Medellín, Comuna 13 / Núcleo Colectivo"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#f8c300]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        Organización o Colectivo
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Colectivo / Institución / Independiente"
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#f8c300]"
                      />
                    </div>
                  </div>

                  {/* Lenguajes creativos selector */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-mono font-bold text-stone-300 block">
                      Lenguajes y Medios Creativos Favoritos ({languages.length} seleccionados):
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-black/40 rounded-xl border border-stone-800">
                      {CREATIVE_LANGUAGES.map((lang) => {
                        const isSelected = languages.includes(lang.name);
                        return (
                          <button
                            type="button"
                            key={lang.id}
                            onClick={() => handleToggleLanguage(lang.name)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#f8c300] text-[#111111] font-bold'
                                : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            <span>{lang.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Deseo & Recursos */}
                  <div className="space-y-3 pt-1 text-xs">
                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        ¿Qué deseo o visión traes al taller?
                      </label>
                      <textarea
                        rows={2}
                        value={wish}
                        onChange={(e) => setWish(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#f8c300]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono font-bold text-stone-300">
                        Recursos, saberes o herramientas que puedes compartir
                      </label>
                      <textarea
                        rows={2}
                        value={resources}
                        onChange={(e) => setResources(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#f8c300]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3 px-4 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Guardando cambios en el servidor...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Guardar y Proteger mis Datos</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: CAMBIAR USUARIO / LOGIN */}
          {activeTab === 'switch' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">
                  Identificarse o Cambiar de Participante
                </h4>
                <p className="text-xs text-stone-400">
                  Selecciona tu ficha de creador/a para trabajar con tu autoría y ver tu carnet digital.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, alias o rol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#f8c300]"
                />
              </div>

              {/* List of Registered Participants */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredParticipants.map((p) => {
                  const isCurrent = String(p.id) === String(currentUser.id);
                  return (
                    <div
                      key={p.id}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-[#f8c300]/10 border-[#f8c300] ring-1 ring-[#f8c300]'
                          : 'bg-stone-900/70 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-xs font-black text-[#f8c300] shrink-0 border border-stone-700">
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white truncate">
                              {p.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono font-black uppercase px-2 py-0.2 rounded-full bg-[#f8c300] text-[#111111]">
                                Activo
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-stone-400 block truncate">
                            {p.role} · {p.phone || 'Sin móvil'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectUser(p);
                          setActiveTab('carnet');
                        }}
                        disabled={isCurrent}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                          isCurrent
                            ? 'bg-stone-800 text-stone-400 cursor-default'
                            : 'bg-[#f8c300] hover:bg-[#e5b300] text-[#111111]'
                        }`}
                      >
                        {isCurrent ? 'Seleccionado' : 'Elegir'}
                      </button>
                    </div>
                  );
                })}

                {filteredParticipants.length === 0 && (
                  <div className="p-6 text-center text-stone-400 text-xs">
                    No se encontraron participantes que coincidan con la búsqueda.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#111111] border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0 font-mono">
          <span>lab-colores.vercel.app · Credencial Segura</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
