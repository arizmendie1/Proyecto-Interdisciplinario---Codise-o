
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { ProjectData } from '../types';

interface DocumentPreviewProps {
  data: ProjectData;
  updateData: (newData: Partial<ProjectData>) => void;
  onPrint?: () => void;
}

export interface DocumentPreviewHandle {
  finalizeForPrint: () => void;
}

const DocumentPreview = forwardRef<DocumentPreviewHandle, DocumentPreviewProps>(({ data, updateData, onPrint }, ref) => {
  const [isFinalized, setIsFinalized] = useState(false);

  useImperativeHandle(ref, () => ({
    finalizeForPrint: () => setIsFinalized(true)
  }));

  const cellClass = "border border-black p-2 text-left align-top leading-tight";
  const labelClass = "font-bold mr-1";
  const headerClass = "bg-[#002060] text-white font-bold p-1 text-center border border-black uppercase text-[12px] print:text-white print:bg-[#002060]";

  return (
    <div className="relative group animate-fadeIn bg-slate-900/10 p-4 md:p-12">
      {/* HUD de Control */}
      {!isFinalized && (
        <div className="no-print sticky top-4 z-40 flex justify-center gap-4 mb-12">
          <button 
            onClick={() => setIsFinalized(true)}
            className="bg-white text-slate-800 px-8 py-4 rounded-full shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 hover:bg-slate-50 border border-slate-100"
          >
            <i className="fas fa-check-circle text-emerald-500"></i> Finalizar Documento
          </button>
        </div>
      )}

      {/* Papel Digital */}
      <div id="printable-area" className="bg-white mx-auto shadow-2xl p-[1.5cm] md:p-[2cm] text-[10.5px] max-w-[21.59cm] min-h-[27.94cm] text-black transition-all print:shadow-none print:p-[1cm] flex flex-col">
        <div className="flex-grow">
          {/* Encabezado Institucional */}
          <div className="mb-6 flex justify-between items-start border-b-2 border-black pb-4">
            <div className="w-2/3 space-y-1">
              <p className="font-bold text-[14px] uppercase">{data.schoolName || 'Escuela Normal Superior Profr. Moisés Sáenz Garza'}</p>
              <p className="font-bold">Ciclo: <span className="font-normal">{data.schoolYear}</span></p>
              <p className="font-bold">Grado: <span className="font-normal">{data.grade || 'Pendiente'}</span></p>
            </div>
            <div className="w-1/3 text-right space-y-1">
              <p className="font-bold">Trimestre: <span className="font-normal uppercase">{data.trimester || 'No asignado'}</span></p>
              <p className="font-bold">Temporalidad: <span className="font-normal">{data.temporality || 'Pendiente'}</span></p>
            </div>
          </div>

          <div className="w-full mb-6">
            <div className={headerClass}>1. Proyecto interdisciplinario - Codiseño</div>
            <table className="w-full border-collapse border border-black">
              <tbody>
                <tr>
                  <td className={cellClass} colSpan={2}>
                    <span className={labelClass}>1.3 Nombre del proyecto:</span>
                    <span className="text-[12px] font-bold uppercase">{data.projectName || 'Sin nombre definido'}</span>
                  </td>
                </tr>
                <tr>
                  <td className={`${cellClass} w-1/2`}>
                    <span className={labelClass}>1.4 Situación temática:</span><br/>
                    <div className="mt-1">{data.thematicSituation || 'No especificada'}</div>
                  </td>
                  <td className={`${cellClass} w-1/2`}>
                    <span className={labelClass}>1.5 Temporalidad:</span><br/>
                    <div className="mt-1">{data.temporality}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-2 font-bold text-[12px] uppercase tracking-tighter border-b-2 border-black">
            Proceso Interdisciplinario - Codiseño
          </div>

          {data.disciplines.map((d, i) => (
            <div key={i} className="mb-6 break-inside-avoid">
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-1/2 p-2 text-left border border-black font-bold uppercase text-[9px]">2.1 Campo: {d.field}</th>
                    <th className="w-1/2 p-2 text-left border border-black font-bold uppercase text-[9px]">2.2 Disciplina: {d.discipline || 'Sin definir'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={cellClass}><span className={labelClass}>2.3 Contenido:</span><br/>{d.content || 'Sin selección'}</td>
                    <td className={cellClass}><span className={labelClass}>2.4 PDA:</span><br/><div className="italic">{d.pda || 'Sin selección'}</div></td>
                  </tr>
                  <tr>
                    <td colSpan={2} className={cellClass}>
                      <span className={labelClass}>2.5 Orientaciones generales:</span><br/>
                      <div className="mt-1 text-justify whitespace-pre-wrap">{d.activityGeneralities || 'Pendiente de desarrollo.'}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Firmas */}
        <div className="mt-12 mb-8 flex flex-col items-center">
          <div className="w-64 border-t border-black mb-1"></div>
          <p className="font-bold text-[10px] uppercase">Vo. Bo. Dirección Escolar</p>
        </div>

        <div className="text-[8.5px] text-gray-400 text-center italic border-t border-gray-100 pt-4 mt-auto">
          Documento de codiseño pedagógico - ENS.
        </div>
      </div>
    </div>
  );
});

export default DocumentPreview;
