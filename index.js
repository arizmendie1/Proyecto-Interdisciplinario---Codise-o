
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { createRoot } from 'react-dom/client';

// --- CONFIGURACIÓN Y CONSTANTES ---
const FORMATIVE_FIELDS = [
  { id: 'lenguajes', name: 'Lenguajes', color: 'bg-indigo-600', lightColor: 'bg-indigo-50' },
  { id: 'saberes', name: 'Saberes y Pensamiento Científico', color: 'bg-emerald-600', lightColor: 'bg-emerald-50' },
  { id: 'etica', name: 'Ética, Naturaleza y Sociedades', color: 'bg-amber-600', lightColor: 'bg-amber-50' },
  { id: 'humano', name: 'De lo Humano y lo Comunitario', color: 'bg-rose-600', lightColor: 'bg-rose-50' }
];

const INITIAL_DATA = {
  schoolName: '',
  schoolYear: '2025 – 2026',
  grade: '',
  trimester: '',
  projectName: '',
  thematicSituation: '',
  temporality: '',
  totalSessions: '',
  disciplines: [{ field: 'Lenguajes', discipline: '', content: '', pda: '', evaluation: '', activityGeneralities: '' }],
  teachers: []
};

// --- COMPONENTE: HEADER ---
const Header = ({ activeTab, setActiveTab, onPrint }) => (
  <header className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center text-white shadow-lg">
        <i className="fas fa-microchip text-xl"></i>
      </div>
      <div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">DIGITAL ENS</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Normal Superior "Profr. Moisés Sáenz Garza"</p>
      </div>
    </div>
    <nav className="flex bg-slate-100 p-1 rounded-xl">
      <button onClick={() => setActiveTab('edit')} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}>Editor</button>
      <button onClick={() => setActiveTab('preview')} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}>Vista Previa</button>
    </nav>
    <button onClick={onPrint} className="hidden md:block bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xl">Exportar PDF</button>
  </header>
);

// --- COMPONENTE: VISTA PREVIA ---
const DocumentPreview = forwardRef(({ data }, ref) => {
  const cellClass = "border border-black p-2 text-left align-top leading-tight";
  const labelClass = "font-bold mr-1";
  const headerClass = "bg-[#002060] text-white font-bold p-1 text-center border border-black uppercase text-[12px]";

  return (
    <div id="printable-area" className="bg-white mx-auto p-[2cm] text-[10.5px] max-w-[21.59cm] min-h-[27.94cm] text-black transition-all flex flex-col">
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
              <td className={cellClass} colSpan="2">
                <span className={labelClass}>1.3 Nombre del proyecto:</span>
                <span className="text-[12px] font-bold uppercase">{data.projectName || 'Sin nombre'}</span>
              </td>
            </tr>
            <tr>
              <td className={cellClass}>
                <span className={labelClass}>1.4 Situación temática:</span><br/>{data.thematicSituation}
              </td>
              <td className={cellClass}>
                <span className={labelClass}>1.5 Temporalidad:</span><br/>{data.temporality}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {data.disciplines.map((d, i) => (
        <div key={i} className="mb-6 break-inside-avoid">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-gray-50 text-[9px]">
                <th className="w-1/2 p-2 text-left border border-black font-bold uppercase">2.1 Campo: {d.field}</th>
                <th className="w-1/2 p-2 text-left border border-black font-bold uppercase">2.2 Disciplina: {d.discipline}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={cellClass}><span className={labelClass}>2.3 Contenido:</span><br/>{d.content}</td>
                <td className={cellClass}><span className={labelClass}>2.4 PDA:</span><br/>{d.pda}</td>
              </tr>
              <tr>
                <td colSpan="2" className={cellClass}>
                  <span className={labelClass}>2.5 Orientaciones generales:</span><br/>
                  <div className="whitespace-pre-wrap">{d.activityGeneralities}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      <div className="mt-auto pt-12 flex flex-col items-center">
        <div className="w-64 border-t border-black mb-1"></div>
        <p className="font-bold text-[10px] uppercase">Vo. Bo. Dirección Escolar</p>
      </div>
    </div>
  );
});

// --- COMPONENTE: FORMULARIO ---
const ProjectForm = ({ data, updateData }) => {
  const inputStyles = "px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none";
  const labelStyles = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1";

  const addDiscipline = () => {
    updateData({ disciplines: [...data.disciplines, { field: 'Lenguajes', discipline: '', content: '', pda: '', activityGeneralities: '' }] });
  };

  const updateDisc = (idx, updates) => {
    const next = [...data.disciplines];
    next[idx] = { ...next[idx], ...updates };
    updateData({ disciplines: next });
  };

  return (
    <div className="p-6 md:p-10 space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl">
        <div className="flex flex-col"><label className={labelStyles}>Nombre Escuela</label><input className={inputStyles} value={data.schoolName} onChange={e => updateData({ schoolName: e.target.value })} /></div>
        <div className="flex flex-col"><label className={labelStyles}>Nombre del Proyecto</label><input className={inputStyles} value={data.projectName} onChange={e => updateData({ projectName: e.target.value })} /></div>
        <div className="flex flex-col"><label className={labelStyles}>Grado</label><input className={inputStyles} value={data.grade} onChange={e => updateData({ grade: e.target.value })} /></div>
        <div className="flex flex-col"><label className={labelStyles}>Temporalidad</label><input className={inputStyles} value={data.temporality} onChange={e => updateData({ temporality: e.target.value })} /></div>
      </section>

      {data.disciplines.map((d, idx) => (
        <div key={idx} className="border border-slate-200 p-6 rounded-3xl relative">
          <div className="grid grid-cols-1 gap-4">
             <div className="flex flex-col"><label className={labelStyles}>Campo Formativo</label>
               <select className={inputStyles} value={d.field} onChange={e => updateDisc(idx, { field: e.target.value })}>
                 {FORMATIVE_FIELDS.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
               </select>
             </div>
             <div className="flex flex-col"><label className={labelStyles}>Disciplina</label><input className={inputStyles} value={d.discipline} onChange={e => updateDisc(idx, { discipline: e.target.value })} /></div>
             <div className="flex flex-col"><label className={labelStyles}>Contenido</label><textarea className={inputStyles} value={d.content} onChange={e => updateDisc(idx, { content: e.target.value })} /></div>
             <div className="flex flex-col"><label className={labelStyles}>PDA</label><textarea className={inputStyles} value={d.pda} onChange={e => updateDisc(idx, { pda: e.target.value })} /></div>
             <div className="flex flex-col"><label className={labelStyles}>Orientaciones</label><textarea className={`${inputStyles} h-32`} value={d.activityGeneralities} onChange={e => updateDisc(idx, { activityGeneralities: e.target.value })} /></div>
          </div>
        </div>
      ))}
      <button onClick={addDiscipline} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-3xl text-slate-400 font-bold hover:bg-indigo-50 transition-all">+ Nueva Disciplina</button>
    </div>
  );
};

// --- COMPONENTE: APP PRINCIPAL ---
const App = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState('edit');
  const [isPreparingPDF, setIsPreparingPDF] = useState(false);

  const updateData = (newData) => setData(prev => ({ ...prev, ...newData }));

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-area');
    if (!element) return;
    setIsPreparingPDF(true);
    if (activeTab !== 'preview') {
      setActiveTab('preview');
      await new Promise(r => setTimeout(r, 500));
    }
    const opt = { margin: 10, filename: 'planeacion.pdf', jsPDF: { unit: 'mm', format: 'letter' } };
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      window.print();
    } finally {
      setIsPreparingPDF(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isPreparingPDF && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/90 flex flex-col items-center justify-center text-white">
          <div className="loader-spin mb-4"></div>
          <p className="font-bold text-lg">Preparando Documento...</p>
        </div>
      )}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onPrint={handleDownloadPDF} />
      <main className="flex-grow p-4 md:p-12">
        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
          {activeTab === 'edit' ? <ProjectForm data={data} updateData={updateData} /> : <DocumentPreview data={data} />}
        </div>
      </main>
      <footer className="py-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        DIGITAL ENS © 2025 | Escuela Normal Superior
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
