
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- CONFIGURACIÓN ---
const FORMATIVE_FIELDS = [
  { id: 'lenguajes', name: 'Lenguajes', color: 'bg-indigo-600' },
  { id: 'saberes', name: 'Saberes y Pensamiento Científico', color: 'bg-emerald-600' },
  { id: 'etica', name: 'Ética, Naturaleza y Sociedades', color: 'bg-amber-600' },
  { id: 'humano', name: 'De lo Humano y lo Comunitario', color: 'bg-rose-600' }
];

// --- COMPONENTES ---

const Header = ({ activeTab, setActiveTab, onPrint }) => (
  <header className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
        <i className="fas fa-microchip"></i>
      </div>
      <div>
        <h1 className="text-lg font-bold text-slate-800">DIGITAL ENS</h1>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Normal Superior "Moisés Sáenz Garza"</p>
      </div>
    </div>
    <nav className="flex bg-slate-100 p-1 rounded-xl">
      <button onClick={() => setActiveTab('edit')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>EDITOR</button>
      <button onClick={() => setActiveTab('preview')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>VISTA PREVIA</button>
    </nav>
    <button onClick={onPrint} className="bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all">EXPORTAR PDF</button>
  </header>
);

const ProjectForm = ({ data, setData }) => {
  const updateDisc = (idx, fields) => {
    const next = [...data.disciplines];
    next[idx] = { ...next[idx], ...fields };
    setData({ ...data, disciplines: next });
  };

  const addDisc = () => setData({
    ...data, 
    disciplines: [...data.disciplines, { field: 'Lenguajes', discipline: '', content: '', pda: '', evaluation: '', activityGeneralities: '' }]
  });

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all";
  const labelClass = "text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1";

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl">
        <div><label className={labelClass}>Nombre de la Escuela</label><input className={inputClass} value={data.schoolName} onChange={e => setData({...data, schoolName: e.target.value})} placeholder="Ej. Secundaria #1" /></div>
        <div><label className={labelClass}>Nombre del Proyecto</label><input className={inputClass} value={data.projectName} onChange={e => setData({...data, projectName: e.target.value})} placeholder="Ej. Huerto Escolar" /></div>
        <div><label className={labelClass}>Grado</label><input className={inputClass} value={data.grade} onChange={e => setData({...data, grade: e.target.value})} placeholder="Ej. 1° Grado" /></div>
        <div><label className={labelClass}>Temporalidad</label><input className={inputClass} value={data.temporality} onChange={e => setData({...data, temporality: e.target.value})} placeholder="Ej. 2 semanas" /></div>
      </div>

      <div className="space-y-6">
        {data.disciplines.map((d, i) => (
          <div key={i} className="border border-slate-100 p-6 rounded-3xl bg-white shadow-sm relative group">
            <button onClick={() => setData({...data, disciplines: data.disciplines.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><i className="fas fa-trash-alt"></i></button>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelClass}>Campo Formativo</label>
                <select className={inputClass} value={d.field} onChange={e => updateDisc(i, { field: e.target.value })}>
                  {FORMATIVE_FIELDS.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Disciplina</label><input className={inputClass} value={d.discipline} onChange={e => updateDisc(i, { discipline: e.target.value })} /></div>
              <div><label className={labelClass}>Contenido</label><textarea className={inputClass} value={d.content} onChange={e => updateDisc(i, { content: e.target.value })} /></div>
              <div><label className={labelClass}>PDA (Procesos de Desarrollo)</label><textarea className={inputClass} value={d.pda} onChange={e => updateDisc(i, { pda: e.target.value })} /></div>
              <div><label className={labelClass}>Orientaciones y Actividades</label><textarea className={`${inputClass} h-32`} value={d.activityGeneralities} onChange={e => updateDisc(i, { activityGeneralities: e.target.value })} /></div>
            </div>
          </div>
        ))}
        <button onClick={addDisc} className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:bg-indigo-50 transition-all hover:text-indigo-600 hover:border-indigo-200">+ AGREGAR DISCIPLINA</button>
      </div>
    </div>
  );
};

const DocumentPreview = forwardRef(({ data }, ref) => {
  const cellClass = "border border-black p-2 text-left align-top text-[10px]";
  const headerClass = "bg-[#002060] text-white font-bold p-1 text-center border border-black uppercase text-[11px]";

  return (
    <div id="printable-area" className="bg-white mx-auto p-[1.5cm] md:p-[2cm] max-w-[21.59cm] min-h-[27.94cm] text-black shadow-inner">
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div className="w-2/3">
          <p className="font-bold text-[14px] uppercase">{data.schoolName || 'Escuela Normal Superior'}</p>
          <p className="text-[10px] font-bold">Ciclo: <span className="font-normal">{data.schoolYear}</span></p>
          <p className="text-[10px] font-bold">Grado: <span className="font-normal">{data.grade || '___'}</span></p>
        </div>
        <div className="w-1/3 text-right">
          <p className="text-[10px] font-bold uppercase">Planeación Codiseño</p>
          <p className="text-[10px] font-bold">Temporalidad: <span className="font-normal">{data.temporality || '___'}</span></p>
        </div>
      </div>

      <div className="mb-6">
        <div className={headerClass}>1. Proyecto Interdisciplinario</div>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className={cellClass} colSpan="2">
                <span className="font-bold">Nombre del Proyecto:</span> {data.projectName || 'Sin definir'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {data.disciplines.map((d, i) => (
        <div key={i} className="mb-6 break-inside-avoid">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className={`${cellClass} font-bold`}>Campo: {d.field}</th>
                <th className={`${cellClass} font-bold`}>Disciplina: {d.discipline}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={cellClass}><span className="font-bold">Contenido:</span><br/>{d.content}</td>
                <td className={cellClass}><span className="font-bold">PDA:</span><br/>{d.pda}</td>
              </tr>
              <tr>
                <td className={cellClass} colSpan="2">
                  <span className="font-bold">Orientaciones Generales:</span><br/>
                  <div className="whitespace-pre-wrap mt-1">{d.activityGeneralities}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-20 flex flex-col items-center">
        <div className="w-48 border-t border-black mb-1"></div>
        <p className="text-[9px] font-bold uppercase">Vo. Bo. Dirección Escolar</p>
      </div>
    </div>
  );
});

// --- APP PRINCIPAL ---
const App = () => {
  const [data, setData] = useState({
    schoolName: '',
    schoolYear: '2025-2026',
    grade: '',
    projectName: '',
    temporality: '',
    disciplines: [{ field: 'Lenguajes', discipline: '', content: '', pda: '', activityGeneralities: '' }]
  });
  const [activeTab, setActiveTab] = useState('edit');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const element = document.getElementById('printable-area');
    const opt = { 
      margin: 10, 
      filename: 'Planeacion_ENS.pdf', 
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };
    try {
      if (activeTab !== 'preview') {
        setActiveTab('preview');
        await new Promise(r => setTimeout(r, 600));
      }
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      window.print();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/90 flex flex-col items-center justify-center animate-pulse">
          <div className="loader-spin mb-4"></div>
          <p className="text-xs font-bold text-slate-800 tracking-widest uppercase">Generando PDF...</p>
        </div>
      )}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onPrint={handleExport} />
      <main className="flex-grow p-4 md:p-10">
        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
          {activeTab === 'edit' ? <ProjectForm data={data} setData={setData} /> : <DocumentPreview data={data} />}
        </div>
      </main>
      <footer className="py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Digital ENS © 2025 | Escuela Normal Superior "Moisés Sáenz Garza"
      </footer>
    </div>
  );
};

// Renderizado
const root = createRoot(document.getElementById('root'));
root.render(<App />);
