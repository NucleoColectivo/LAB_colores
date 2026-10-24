import React, { useState, useMemo } from 'react';
import { ParticipantContribution, CREATIVE_LANGUAGES } from '../types';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  Sparkles,
  Download,
  Copy,
  Check,
  Filter,
  ExternalLink,
  MessageCircle,
  Share2
} from 'lucide-react';

interface UserNetworkProps {
  contributions: ParticipantContribution[];
}

export const UserNetwork: React.FC<UserNetworkProps> = ({ contributions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('todos');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered participants
  const filteredUsers = useMemo(() => {
    return contributions.filter((user) => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.alias?.toLowerCase().includes(query) ||
        user.location?.toLowerCase().includes(query) ||
        user.organization?.toLowerCase().includes(query) ||
        user.themes?.toLowerCase().includes(query) ||
        user.wish?.toLowerCase().includes(query) ||
        user.resources?.toLowerCase().includes(query) ||
        user.languages?.some((l) => l.toLowerCase().includes(query));

      // Language filter
      const matchesLang =
        selectedLanguageFilter === 'todos' ||
        user.languages?.includes(selectedLanguageFilter);

      // Role filter
      const matchesRole =
        selectedRoleFilter === 'todos' ||
        user.role?.toLowerCase() === selectedRoleFilter.toLowerCase();

      return matchesSearch && matchesLang && matchesRole;
    });
  }, [contributions, searchQuery, selectedLanguageFilter, selectedRoleFilter]);

  // Unique roles in current group
  const availableRoles = useMemo(() => {
    const set = new Set<string>();
    contributions.forEach((c) => {
      if (c.role) set.add(c.role);
    });
    return Array.from(set);
  }, [contributions]);

  const handleCopyContact = async (user: ParticipantContribution) => {
    const text = `✦ Contacto Taller Núcleo Colectivo:
Nombre: ${user.name || user.alias}
Rol: ${user.role}
Territorio: ${user.location || 'No especificado'}
Organización: ${user.organization || 'Independiente'}
Email: ${user.email || 'No indicado'}
Tel/WhatsApp: ${user.phone || 'No indicado'}
Lenguajes: ${(user.languages || []).join(', ')}
Deseo creativo: ${user.wish || ''}
Recursos ofrecidos: ${user.resources || ''}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(String(user.id));
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleExportDirectoryCsv = () => {
    if (contributions.length === 0) {
      alert('Aún no hay participantes registrados.');
      return;
    }

    const headers = [
      'Nombre Completo',
      'Apodo / Alias',
      'Correo Electrónico',
      'Teléfono / WhatsApp',
      'Barrio / Territorio',
      'Organización / Colectivo',
      'Red Social / Web',
      'Rol de Afinidad',
      'Lenguajes Creativos',
      'Deseo Creativo',
      'Recursos y Saberes Disponibles',
      'Fecha Registro'
    ];

    const rows = contributions.map((c) => [
      c.name || c.alias,
      c.alias || '',
      c.email || '',
      c.phone || '',
      c.location || '',
      c.organization || '',
      c.social || '',
      c.role || '',
      (c.languages || []).join(' | '),
      c.wish || '',
      c.resources || '',
      c.createdAt || ''
    ]);

    const csvContent =
      '\ufeff' +
      [headers, ...rows]
        .map((row) =>
          row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `directorio-participantes-nucleo-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="comunidad" className="py-10 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#5e48d5]">
            Paso 05 · Directorio & Conexión
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            05. Red de Creadores del Taller
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-xl">
            Conecta con los participantes del taller. Descubre con quién puedes hacer equipo, qué saberes se ofrecen y ponte en contacto directo.
          </p>
        </div>

        <button
          onClick={handleExportDirectoryCsv}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] hover:bg-stone-800 text-white rounded-full text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#f8c300]" />
          <span>Exportar Directorio de Contactos (CSV)</span>
        </button>
      </div>

      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* WhatsApp Group Quick Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#25D366]/15 to-transparent border border-[#25D366]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-sm font-black text-stone-900 block leading-tight">
                Grupo oficial de WhatsApp: Taller laboratorio de medios digitales e IA
              </strong>
              <p className="text-xs text-stone-600">
                Comparte enlaces, referencias visuales y coordina tus proyectos de co-creación.
              </p>
            </div>
          </div>

          <a
            href="https://chat.whatsapp.com/ErtCU75vz84H95zQ7Lj8rM"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-black rounded-full text-xs transition shadow-xs self-start sm:self-auto shrink-0"
          >
            <span>Unirme al Grupo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        {/* Search & Filter Bar */}
        <div className="space-y-4 mb-6 pb-6 border-b border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, territorio, colectivo o interés..."
                className="w-full pl-10 pr-4 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedLanguageFilter}
                onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
              >
                <option value="todos">Todos los lenguajes</option>
                {CREATIVE_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none"
              >
                <option value="todos">Todos los roles</option>
                {availableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 flex-wrap gap-2">
            <span>
              Mostrando <strong className="text-stone-900">{filteredUsers.length}</strong> de{' '}
              <strong className="text-stone-900">{contributions.length}</strong> participantes en la red
            </span>
            {(searchQuery || selectedLanguageFilter !== 'todos' || selectedRoleFilter !== 'todos') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguageFilter('todos');
                  setSelectedRoleFilter('todos');
                }}
                className="text-[#7656ff] font-bold hover:underline cursor-pointer"
              >
                Limpiar filtros de búsqueda
              </button>
            )}
          </div>
        </div>

        {/* Directory Grid */}
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500">
            <Users className="w-8 h-8 mx-auto text-stone-300 mb-2" />
            <p className="font-bold text-sm text-stone-700">No se encontraron creadores con este criterio.</p>
            <p className="text-xs text-stone-500 mt-1">Intenta con otros términos o registra un nuevo participante en la ficha.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredUsers.map((user) => {
              const isCopied = copiedId === String(user.id);
              const initials = (user.name || user.alias || 'PC')
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={user.id}
                  className="p-5 sm:p-6 rounded-2xl border border-[#dedbd3] bg-[#faf9f6] hover:bg-white transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between text-left group"
                >
                  <div>
                    {/* User Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-[#111111] text-[#f8c300] font-black text-sm flex items-center justify-center shrink-0 border border-stone-800">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-black text-[#111111] truncate leading-tight">
                            {user.name || user.alias}
                          </h4>
                          {user.alias && user.name && user.alias !== user.name && (
                            <span className="text-xs text-stone-500 block truncate">
                              ({user.alias})
                            </span>
                          )}
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#eee9ff] text-[#5e48d5]">
                              {user.role || 'Participante'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyContact(user)}
                        className="p-2 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition cursor-pointer"
                        title="Copiar datos de contacto"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Location & Org Badges */}
                    {(user.location || user.organization) && (
                      <div className="flex items-center gap-3 text-xs text-stone-600 mb-3 flex-wrap">
                        {user.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#7656ff]" />
                            {user.location}
                          </span>
                        )}
                        {user.organization && (
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Building2 className="w-3 h-3 text-stone-400" />
                            {user.organization}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Creative Languages Selected */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(user.languages || []).map((lang) => (
                        <span
                          key={lang}
                          className="px-2.5 py-0.5 rounded-md bg-white border border-stone-200 text-[#111111] text-[11px] font-bold shadow-2xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>

                    {/* Wish / What they want to create */}
                    {user.wish && (
                      <div className="mb-2 text-xs bg-white p-2.5 rounded-xl border border-stone-200/80">
                        <strong className="text-stone-900 block font-bold text-[11px] mb-0.5 text-[#5e48d5]">
                          Deseo o proyecto que busca crear:
                        </strong>
                        <p className="text-stone-700 italic leading-snug">"{user.wish}"</p>
                      </div>
                    )}

                    {/* Resources Offered */}
                    {user.resources && (
                      <div className="text-[11px] text-stone-600 mb-3 leading-snug">
                        <strong className="text-stone-800 font-bold">Saberes / Recursos que aporta: </strong>
                        <span>{user.resources}</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Actions Footer */}
                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      {user.email && (
                        <a
                          href={`mailto:${user.email}?subject=Taller%20N%C3%BAcleo%20Colectivo%20-%20Hola%20${encodeURIComponent(
                            user.name || user.alias
                          )}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#111111] font-bold transition text-xs"
                          title={`Escribir a ${user.email}`}
                        >
                          <Mail className="w-3.5 h-3.5 text-[#7656ff]" />
                          <span>Correo</span>
                        </a>
                      )}

                      {user.phone && (
                        <a
                          href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition text-xs"
                          title={`WhatsApp: ${user.phone}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {user.social && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-mono">
                          <Globe className="w-3 h-3 text-stone-400" />
                          {user.social}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(user.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
