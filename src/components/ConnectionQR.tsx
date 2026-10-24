import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Globe,
  ExternalLink,
  MessageCircle,
  Sparkles,
  ArrowDown,
  Smartphone,
  Radio,
  Wifi
} from 'lucide-react';
import {
  OFFICIAL_WORKSHOP_URL,
  OFFICIAL_QR_ASSET_PATH,
  OFFICIAL_WHATSAPP_GROUP_URL,
  OFFICIAL_WHATSAPP_QR_ASSET_PATH
} from '../types';

interface ConnectionQRProps {
  onScrollToForm?: () => void;
}

export const ConnectionQR: React.FC<ConnectionQRProps> = ({ onScrollToForm }) => {
  const [currentAppUrl, setCurrentAppUrl] = useState('');
  const [liveQrDataUrl, setLiveQrDataUrl] = useState<string>('');
  const [useLiveSyncQr, setUseLiveSyncQr] = useState(true);
  const [isCopiedWeb, setIsCopiedWeb] = useState(false);
  const [isCopiedWa, setIsCopiedWa] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const liveUrl = window.location.href;
      setCurrentAppUrl(liveUrl);
      QRCode.toDataURL(liveUrl, {
        width: 380,
        margin: 2,
        color: { dark: '#111111', light: '#ffffff' }
      }).then(setLiveQrDataUrl).catch(() => {});
    }
  }, []);

  const handleCopy = async (url: string, isWa: boolean) => {
    try {
      await navigator.clipboard.writeText(url);
      if (isWa) {
        setIsCopiedWa(true);
        setTimeout(() => setIsCopiedWa(false), 2500);
      } else {
        setIsCopiedWeb(true);
        setTimeout(() => setIsCopiedWeb(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleDownload = (path: string, filename: string) => {
    const a = document.createElement('a');
    a.href = path;
    a.download = filename;
    a.click();
  };

  const activeWebUrl = useLiveSyncQr ? currentAppUrl : OFFICIAL_WORKSHOP_URL;
  const activeWebQrImage = useLiveSyncQr ? (liveQrDataUrl || OFFICIAL_QR_ASSET_PATH) : OFFICIAL_QR_ASSET_PATH;

  return (
    <section id="conexion" className="py-8 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] text-[#f8c300] text-xs font-black uppercase tracking-wider mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Punto de Inicio · Escanea para Participar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#111111]">
            Antes de llenar tus datos: escanea y conéctate
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-2xl">
            Abre la cámara de tu celular y enfoca el código para abrir la ficha en tu móvil o unirte al grupo de WhatsApp del laboratorio.
          </p>
        </div>

        {onScrollToForm && (
          <button
            onClick={onScrollToForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-xs sm:text-sm transition shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <span>Ir directo al formulario ↓</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* DUAL QR DISPLAY SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* CARD 1: PLATAFORMA WEB CON SINCRONIZACIÓN EN VIVO */}
        <div className="bg-white border-2 border-[#111111] rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#f8c300]/15 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#f8c300] text-[#111111] flex items-center gap-1">
                <Wifi className="w-3 h-3 text-[#111111]" />
                <span>01 · PLATAFORMA WEB MÓVIL</span>
              </span>

              {/* Selector entre QR sincronizado y Vercel */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setUseLiveSyncQr(true)}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    useLiveSyncQr ? 'bg-[#111111] text-[#f8c300]' : 'text-stone-600'
                  }`}
                  title="Abre esta misma pantalla en el celular para que tus datos se vean de inmediato en el computador"
                >
                  En vivo (Sincronizado)
                </button>
                <button
                  type="button"
                  onClick={() => setUseLiveSyncQr(false)}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    !useLiveSyncQr ? 'bg-[#111111] text-[#f8c300]' : 'text-stone-600'
                  }`}
                  title="Abre lab-colores.vercel.app"
                >
                  lab-colores
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-[#111111] leading-tight mb-2">
              Abrir ficha en el celular
            </h3>

            <p className="text-xs sm:text-sm text-[#45423d] leading-relaxed mb-3">
              {useLiveSyncQr
                ? '⚡ Escanea para abrir la app conectada en vivo: lo que llenes en tu móvil se reflejará al instante en esta pantalla y en el proyector.'
                : 'Escanea para abrir la plataforma en lab-colores.vercel.app.'}
            </p>

            {/* QR Image */}
            <div className="bg-[#faf9f6] p-4 rounded-2xl border-2 border-stone-200 text-center max-w-[240px] mx-auto mb-4 shadow-inner">
              <img
                src={activeWebQrImage}
                alt="QR para abrir plataforma web"
                className="w-48 h-48 object-contain block mx-auto rounded-lg"
              />
              <span className="block text-[10px] font-mono text-stone-500 mt-2 font-bold truncate">
                {useLiveSyncQr ? 'Sincronizado con esta pantalla' : 'https://lab-colores.vercel.app/'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <a
              href={activeWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-xs transition shadow-xs cursor-pointer text-center"
            >
              <span>Abrir en móvil / pestaña</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => handleDownload(activeWebQrImage, 'qr-web-taller.png')}
              className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              title="Descargar imagen QR Web"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCopy(activeWebUrl, false)}
              className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              title="Copiar enlace web"
            >
              {isCopiedWeb ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* CARD 2: GRUPO DE WHATSAPP OFICIAL */}
        <div className="bg-white border-2 border-[#25D366] rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#25D366]/15 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#25D366] text-white">
                02 · GRUPO DE WHATSAPP
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                Canal Oficial
              </span>
            </div>

            <h3 className="text-xl font-black text-[#111111] leading-tight mb-2">
              Taller laboratorio de medios digitales e IA
            </h3>

            <p className="text-xs sm:text-sm text-[#45423d] leading-relaxed mb-3">
              Escanea para entrar al chat oficial de la sesión: comparte imágenes generadas, prompts, enlaces y mantén contacto con el grupo.
            </p>

            {/* WhatsApp QR Image Card */}
            <div className="bg-[#128C7E] p-3 rounded-2xl text-center max-w-[240px] mx-auto mb-4 shadow-sm">
              <div className="bg-white rounded-xl p-2.5 overflow-hidden">
                <img
                  src={OFFICIAL_WHATSAPP_QR_ASSET_PATH}
                  alt="QR para unirse al Grupo de WhatsApp"
                  className="w-44 h-44 object-cover block mx-auto rounded-md"
                />
              </div>
              <span className="block text-[10px] text-white/90 mt-1.5 font-bold">
                Escanea con la cámara de WhatsApp
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <a
              href={OFFICIAL_WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-black rounded-full text-xs transition shadow-xs cursor-pointer text-center"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Unirme al WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => handleDownload(OFFICIAL_WHATSAPP_QR_ASSET_PATH, 'qr-whatsapp-laboratorio.jpeg')}
              className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              title="Descargar imagen QR WhatsApp"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCopy(OFFICIAL_WHATSAPP_GROUP_URL, true)}
              className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              title="Copiar enlace del grupo"
            >
              {isCopiedWa ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Guide Banner before filling data */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#fff9db] border-l-4 border-[#f8c300] text-xs text-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <strong className="text-stone-900 font-bold block text-sm mb-0.5">
            ¿Ya escaneaste o estás navegando desde tu dispositivo?
          </strong>
          <span>Avanza al <strong>Paso 01</strong> aquí abajo para ingresar tu nombre, datos de contacto y lenguajes artísticos.</span>
        </div>

        {onScrollToForm && (
          <button
            onClick={onScrollToForm}
            className="inline-flex items-center gap-1 px-4 py-2 bg-[#111111] hover:bg-stone-800 text-white font-bold rounded-full text-xs shrink-0 transition cursor-pointer"
          >
            <span>Llenar mis datos ahora ↓</span>
          </button>
        )}
      </div>
    </section>
  );
};
