import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Globe,
  ExternalLink,
  MessageCircle,
  Share2,
  Sparkles,
  Server
} from 'lucide-react';
import {
  OFFICIAL_WORKSHOP_URL,
  OFFICIAL_QR_ASSET_PATH,
  OFFICIAL_WHATSAPP_GROUP_URL,
  OFFICIAL_WHATSAPP_QR_ASSET_PATH
} from '../types';

export const ConnectionQR: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'web'>('whatsapp');
  const [publicUrl, setPublicUrl] = useState<string>(OFFICIAL_WORKSHOP_URL);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isCopiedWa, setIsCopiedWa] = useState<boolean>(false);

  const handleCopyUrl = async (url: string, isWa: boolean) => {
    try {
      await navigator.clipboard.writeText(url);
      if (isWa) {
        setIsCopiedWa(true);
        setTimeout(() => setIsCopiedWa(false), 2500);
      } else {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleDownloadImage = (path: string, filename: string) => {
    const a = document.createElement('a');
    a.href = path;
    a.download = filename;
    a.click();
  };

  return (
    <section id="conexion" className="py-10 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#5e48d5]">
            Paso 04 · Conexión Grupal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            04. Códigos QR & Grupo de WhatsApp
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-xl">
            Dos vías directas para conectar a la comunidad: el grupo de WhatsApp del laboratorio y la plataforma web participativa.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-stone-200 p-1.5 rounded-full text-xs font-black self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-[#25D366] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Grupo de WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition cursor-pointer ${
              activeTab === 'web'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#f8c300]" />
            <span>Plataforma Web (lab-colores)</span>
          </button>
        </div>
      </div>

      {activeTab === 'whatsapp' ? (
        /* WHATSAPP GROUP DISPLAY */
        <div className="bg-white border-2 border-[#25D366]/40 rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black uppercase tracking-wider">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Canal Oficial de Comunicación</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#111111] leading-tight">
                Taller laboratorio de medios digitales e IA
              </h3>

              <p className="text-sm text-[#45423d] leading-relaxed">
                Únete al grupo de WhatsApp oficial de Núcleo Colectivo para compartir enlaces de herramientas de IA, imágenes generadas, referencias sonoras y coordinar los proyectos colectivos.
              </p>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-stone-500 uppercase block">
                    Enlace de invitación directa:
                  </span>
                  <a
                    href={OFFICIAL_WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[#25D366] hover:underline font-bold truncate block"
                  >
                    {OFFICIAL_WHATSAPP_GROUP_URL}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(OFFICIAL_WHATSAPP_GROUP_URL, true)}
                    className="px-3 py-1.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    {isCopiedWa ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{isCopiedWa ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={OFFICIAL_WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-black rounded-full text-sm transition shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Unirme al Grupo de WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadImage(
                      OFFICIAL_WHATSAPP_QR_ASSET_PATH,
                      'qr-whatsapp-laboratorio-ia.jpeg'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-[#111111] border border-stone-300 font-bold rounded-full text-xs sm:text-sm transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Tarjeta QR de WhatsApp</span>
                </button>
              </div>

              <p className="text-xs text-stone-500">
                💬 Puedes proyectar esta tarjeta o imprimirla para que los participantes escaneen desde la app de WhatsApp.
              </p>
            </div>

            {/* Official WhatsApp QR Image Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-[#128C7E] p-3 rounded-3xl shadow-lg max-w-[290px] w-full text-center">
                <div className="bg-white rounded-2xl p-4 overflow-hidden shadow-inner">
                  <img
                    src={OFFICIAL_WHATSAPP_QR_ASSET_PATH}
                    alt="QR del Grupo de WhatsApp: Taller laboratorio de medios digitales e IA"
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </div>
                <div className="py-2.5 text-white">
                  <strong className="text-xs font-bold block">
                    Escanea con la cámara de WhatsApp
                  </strong>
                  <span className="text-[11px] text-white/80">
                    Comunidad viva de experimentación
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* WEB APP DISPLAY */
        <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff1a8] text-[#8a6800] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plataforma Web Móvil</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#111111] leading-tight">
                Participar en <span className="text-[#7656ff]">lab-colores.vercel.app</span>
              </h3>

              <p className="text-sm text-[#45423d] leading-relaxed">
                Escanea este código QR con la cámara de cualquier teléfono para completar la ficha de intereses, seleccionar hasta 3 lenguajes creativos y visualizar el mapa colectivo en tiempo real.
              </p>

              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-stone-700">
                  Dirección web oficial:
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    readOnly
                    value={OFFICIAL_WORKSHOP_URL}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#c9c5bc] rounded-xl text-xs sm:text-sm text-[#111111] bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <a
                  href={OFFICIAL_WORKSHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-xs sm:text-sm transition cursor-pointer"
                >
                  <span>Abrir Web en Nueva Pestaña</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadImage(
                      OFFICIAL_QR_ASSET_PATH,
                      'qr-lab-colores-nucleo.png'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#111111] border border-stone-300 font-bold rounded-full text-xs sm:text-sm transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar QR Web</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyUrl(OFFICIAL_WORKSHOP_URL, false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#111111] border border-stone-300 font-bold rounded-full text-xs sm:text-sm transition cursor-pointer"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{isCopied ? 'URL Copiada' : 'Copiar URL'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-[#faf9f6] border-2 border-[#111111] rounded-3xl p-6 text-center max-w-[300px] w-full shadow-md flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl border border-stone-300 shadow-sm mb-3.5">
                  <img
                    src={OFFICIAL_QR_ASSET_PATH}
                    alt="Código QR para https://lab-colores.vercel.app/"
                    className="w-52 h-52 object-contain block mx-auto rounded-lg"
                  />
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#111111] text-[#f8c300] text-[10px] font-mono font-bold uppercase mb-1">
                  <span>lab-colores.vercel.app</span>
                </div>

                <strong className="text-sm font-black text-[#111111] block">
                  Escanea para participar
                </strong>
                <p className="text-[11px] text-[#6e6b66] leading-tight mt-0.5">
                  Apunta con la cámara de tu celular para abrir la ficha participativa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection & Network Instructions */}
      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-black text-[#111111] flex items-center gap-2">
          <Server className="w-5 h-5 text-[#7656ff]" />
          <span>Ecosistema de Conexión del Laboratorio</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs mb-2">
              1
            </span>
            <strong className="text-stone-900 block font-bold text-sm mb-1">
              Grupo de WhatsApp
            </strong>
            Canal de conversación instantánea, avisos de las sesiones y envío de fotos/archivos.
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="w-6 h-6 rounded-full bg-[#f8c300] text-[#111111] flex items-center justify-center font-bold text-xs mb-2">
              2
            </span>
            <strong className="text-stone-900 block font-bold text-sm mb-1">
              Plataforma Web (lab-colores)
            </strong>
            Lugar donde cada persona diligencia sus lenguajes artísticos, memorias y temas de interés.
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="w-6 h-6 rounded-full bg-[#111111] text-[#f8c300] flex items-center justify-center font-bold text-xs mb-2">
              3
            </span>
            <strong className="text-stone-900 block font-bold text-sm mb-1">
              Mapa Colectivo & Cruces
            </strong>
            Visualización proyectada en pared para detonar proyectos conjuntos entre saberes tradicionales y tecnología.
          </div>
        </div>
      </div>
    </section>
  );
};
