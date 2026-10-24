import React, { useState } from 'react';
import { WORKSHOP_STEPS, WorkshopStep } from '../types';
import { Check, Clock, ChevronRight } from 'lucide-react';

export const WorkshopRoute: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  return (
    <section id="ruta" className="py-10 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#5e48d5]">
            Metodología viva
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            La ruta de la mañana
          </h2>
          <p className="text-sm sm:text-base text-[#6e6b66] mt-1 max-w-xl">
            Una conversación que se transforma en posibilidades concretas a través de 4 momentos estructurados.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#6e6b66]">
          <span>Momento activo:</span>
          <span className="px-2.5 py-1 bg-[#111111] text-[#f8c300] rounded-full font-bold">
            {WORKSHOP_STEPS[activeStepIndex].title}
          </span>
        </div>
      </div>

      {/* Grid of 4 steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WORKSHOP_STEPS.map((step: WorkshopStep, index: number) => {
          const isActive = index === activeStepIndex;
          return (
            <div
              key={step.num}
              onClick={() => setActiveStepIndex(index)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative text-left ${
                isActive
                  ? 'bg-white border-[#7656ff] shadow-md ring-2 ring-[#7656ff]/20 -translate-y-1'
                  : 'bg-white/80 hover:bg-white border-[#dedbd3] hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                    isActive ? 'bg-[#7656ff] text-white' : 'bg-stone-100 text-[#5e48d5]'
                  }`}
                >
                  {step.num}
                </span>
                <span className="text-xs font-semibold text-[#6e6b66] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {step.time}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#111111] mb-1 flex items-center justify-between">
                <span>{step.title}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-[#7656ff]" />}
              </h3>

              <p className="text-xs sm:text-sm text-[#45423d] leading-snug mb-3">
                {step.desc}
              </p>

              <div className="pt-2.5 border-t border-stone-100 text-[11px] font-medium text-stone-500">
                <span className="font-semibold text-stone-700">Objetivo: </span>
                {step.objective}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between flex-wrap gap-2 text-xs text-[#6e6b66]">
        <p>💡 La agenda es una propuesta ajustable al ritmo y las necesidades del grupo participante.</p>
        <span className="italic">Haz clic en cada momento para destacarlo durante la facilitación.</span>
      </div>
    </section>
  );
};
