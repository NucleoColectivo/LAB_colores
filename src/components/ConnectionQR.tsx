import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Globe,
  ExternalLink,
  ShieldCheck,
  Server,
  Smartphone,
  Eye
} from 'lucide-react';

export const ConnectionQR: React.FC = () => {
  const [publicUrl, setPublicUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrStatus, setQrStatus] = useState<string>('Código QR listo para escanear y proyectar.');
  const [isCopied, setIsCopied] = useState(false);

  // Auto-detect current window URL on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const current = window.location.href;
      setPublicUrl(current);
      generateQr(current);
    }
  }, []);

  const generateQr = async (urlToEncode: string) => {
    if (!urlToEncode || !/^https?:\/\/.+/i.test(urlToEncode.trim())) {
      setQrStatus('Ingresa una URL válida que comience con http:// o https://');
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(urlToEncode.trim(), {
        width: 380,
        margin: 2,
        color: {
          dark: '#111111',
          light: '#ffffff'
        }
      });
      setQrDataUrl(dataUrl);
      setQrStatus('QR generado para esta dirección. Pruébalo con la cámara de tu celular antes de proyectarlo.');
    } catch (err) {
      setQrStatus('Error al generar el código QR.');
    }
  };

  const handleMakeQr = () => {
    generateQr(publicUrl);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) {
      setQrStatus('Primero genera el código QR.');
      return;
    }
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qr-taller-nucleo-colectivo.png';
    a.click();
    setQrStatus('Descargando imagen del código QR en alta resolución.');
  };

  const handleCopyUrl = async () => {
    if (!publicUrl.trim()) return;
    try {
      await navigator.clipboard.writeText(publicUrl.trim());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      setQrStatus('URL copiada al portapapeles.');
    } catch {
      setQrStatus('Selecciona y copia la URL manualmente.');
    }
  };

  return (
    <section id="conexion" className="py-10 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#5e48d5]">
            Paso 04
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            04. Conectar al grupo & Proyección
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-xl">
            Prepara el acceso por QR para que las y los participantes abran la ficha desde sus propios teléfonos móviles.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-black text-[#111111] flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#f8c300]" />
              <span>Acceso directo por Código QR</span>
            </h3>

            <p className="text-sm text-[#45423d] leading-relaxed">
              Pega aquí la URL pública de la aplicación. Al escanear el código QR con la cámara del celular, los participantes accederán directamente a la ficha sin instalar ninguna aplicación.
            </p>

            <div>
              <label htmlFor="public-url-input" className="block text-xs font-bold text-stone-700 mb-1.5">
                Dirección web pública del taller (URL)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="public-url-input"
                  type="url"
                  value={publicUrl}
                  onChange={(e) => setPublicUrl(e.target.value)}
                  placeholder="https://tu-taller.nucleocolectivo.org"
                  className="w-full pl-10 pr-4 py-3 border border-[#c9c5bc] focus:border-[#7656ff] focus:ring-2 focus:ring-[#7656ff]/20 rounded-xl text-xs sm:text-sm text-[#111111] bg-white transition outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleMakeQr}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#f8c300] hover:bg-[#e5b300] text-[#111111] font-black rounded-full text-xs sm:text-sm transition cursor-pointer active:scale-98 shadow-sm"
              >
                <span>Generar / Actualizar QR</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#111111] border border-stone-300 font-bold rounded-full text-xs sm:text-sm transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PNG</span>
              </button>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#111111] border border-stone-300 font-bold rounded-full text-xs sm:text-sm transition cursor-pointer"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{isCopied ? 'Copiada' : 'Copiar URL'}</span>
              </button>
            </div>

            <p className="text-xs text-[#6e6b66] pt-1" aria-live="polite">
              {qrStatus}
            </p>
          </div>

          {/* QR Display Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-[#faf9f6] border-2 border-dashed border-stone-300 rounded-3xl p-6 text-center max-w-[280px] w-full shadow-xs flex flex-col items-center">
              {qrDataUrl ? (
                <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm mb-3">
                  <img
                    src={qrDataUrl}
                    alt="Código QR para abrir la web del taller"
                    className="w-48 h-48 block mx-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-stone-100 rounded-2xl flex items-center justify-center text-xs text-stone-400 mb-3">
                  Cargando QR...
                </div>
              )}

              <strong className="text-sm font-black text-[#111111] block mb-1">
                Escanea para participar
              </strong>
              <p className="text-[11px] text-[#6e6b66] leading-tight">
                Abre la cámara de tu teléfono y enfoca este código para sumar tu voz al mapa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guide for Facilitators */}
      <div className="bg-white border border-[#dedbd3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-black text-[#111111] flex items-center gap-2">
          <Server className="w-5 h-5 text-[#7656ff]" />
          <span>Guía para facilitadores: ¿Cómo habilitar sincronización comunitaria en vivo?</span>
        </h3>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-700">
          <li className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <strong className="text-stone-900 block font-bold text-sm mb-1">
              1. Publicar la URL
            </strong>
            Alojar la web en una plataforma pública accesible para celulares (como Vercel, Netlify o GitHub Pages).
          </li>
          <li className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <strong className="text-stone-900 block font-bold text-sm mb-1">
              2. Conectar base de datos
            </strong>
            Vincular Firestore o Supabase con credenciales seguras para sincronizar las respuestas de todos los participantes.
          </li>
          <li className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <strong className="text-stone-900 block font-bold text-sm mb-1">
              3. Probar el QR
            </strong>
            Escanear el código desde 2 celulares con diferentes conexiones antes de iniciar el taller.
          </li>
          <li className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <strong className="text-stone-900 block font-bold text-sm mb-1">
              4. Proyectar en muro
            </strong>
            Usar el botón "Modo Proyector" para mostrar el mapa en gran formato mientras el grupo va respondiendo.
          </li>
        </ol>

        <div className="p-4 rounded-2xl bg-[#fff9db] border-l-4 border-[#f8c300] text-xs text-stone-800 leading-relaxed">
          <strong>Aviso transparente sobre el modo local:</strong> En su versión predeterminada sin base de datos en nube configurada, las respuestas quedan almacenadas en el navegador del dispositivo que las envía. Si en el taller cada participante usa su celular, pueden usar el botón "Exportar / Importar JSON" para consolidar los aportes en la laptop del facilitador, o activar Firebase/Supabase para sincronización automática en tiempo real.
        </div>
      </div>
    </section>
  );
};
