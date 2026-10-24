import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-white border-t border-stone-800 py-12 px-4 sm:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded bg-[#f8c300] text-[#111111] font-black text-sm flex items-center justify-center">
              ✦
            </span>
            <span className="font-black text-lg tracking-wider">
              NÚCLEO <span className="text-[#f8c300]">COLECTIVO</span>
            </span>
          </div>
          <p className="text-stone-400 text-sm max-w-md leading-relaxed">
            Crear con lo que tenemos. Imaginar lo que podemos ser.
          </p>
          <div className="mt-3 text-xs font-mono text-stone-500">
            Plataforma cultural, artística y comunitaria · Laboratorio de Procesos Creativos
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-[#f8c300] uppercase tracking-wider block">
              Sesión 1 · Escuchar y enfocar
            </span>
            <span className="text-xs text-stone-400 block mt-0.5">
              Arte + Tecnología + IA + Comunidad + Educación
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition cursor-pointer self-start sm:self-auto"
            title="Volver arriba"
            aria-label="Volver arriba"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
