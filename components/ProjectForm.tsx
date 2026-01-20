
import React, { useEffect, useState, useRef } from 'react';
import { ProjectData, FORMATIVE_FIELDS, DisciplineEntry } from '../types';
import { LENGUAJES_DB, DISCIPLINAS as DIS_LENGUAJES, GRADOS } from '../data/lenguajes';
import { SABERES_DB, DISCIPLINAS_SABERES as DIS_SABERES } from '../data/saberes';
import { ETICA_DB, DISCIPLINAS_ETICA as DIS_ETICA } from '../data/etica';
import { HUMANO_DB, DISCIPLINAS_HUMANO as DIS_HUMANO } from '../data/humano';

interface ProjectFormProps {
  data: ProjectData;
  updateData: (newData: Partial<ProjectData>) => void;
}

const EVALUATION_MAP: Record<string, string[]> = {
  "Observación": ["Guía de observación", "Registro anecdótico", "Diario de clase", "Diario de trabajo", "Escala de actitudes"],
  "Desempeño de los alumnos": ["Preguntas sobre el procedimiento", "Cuadernos de los alumnos", "Organizadores gráficos"],
  "Análisis del desempeño": ["Portafolio", "Rúbrica", "Lista de cotejo"],
  "Interrogatorio": ["Tipos textuales: debate y ensayo", "Tipos orales y escritos: pruebas escritas"]
};

const DB_MAP: Record<string, any> = {
  'Lenguajes': LENGUAJES_DB,
  'Saberes y Pensamiento Científico': SABERES_DB,
  'Ética, Naturaleza y Sociedades': ETICA_DB,
  'De lo Humano y lo Comunitario': HUMANO_DB
};

const DIS_MAP: Record<string, string[]> = {
  'Lenguajes': DIS_LENGUAJES,
  'Saberes y Pensamiento Científico': DIS_SABERES,
  'Ética, Naturaleza y Sociedades': DIS_ETICA,
  'De lo Humano y lo Comunitario': DIS_HUMANO
};

const MiniCalendar: React.FC<{ onSelect: (range: string) => void; onClose: () => void }> = ({ onSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!startDate) {
      setStartDate(selectedDate);
    } else {
      const start = startDate < selectedDate ? startDate : selectedDate;
      const end = startDate < selectedDate ? selectedDate : startDate;
      onSelect(`${start.toLocaleDateString('es-MX')} al ${end.toLocaleDateString('es-MX')}`);
      onClose();
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 z-[100] bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 w-72 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700">
          {currentMonth.toLocaleString('es-MX', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-1">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1 hover:bg-slate-100 rounded"><i className="fas fa-chevron-left text-xs"></i></button>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1 hover:bg-slate-100 rounded"><i className="fas fa-chevron-right text-xs"></i></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => <div key={i} />)}
        {Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => (
          <button 
            key={i} 
            onClick={() => handleDateClick(i + 1)} 
            className={`text-xs h-8 w-8 flex items-center justify-center rounded-lg hover:bg-indigo-50 ${startDate?.getDate() === i + 1 && startDate?.getMonth() === currentMonth.getMonth() ? 'bg-indigo-600 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProjectForm: React.FC<ProjectFormProps> = ({ data, updateData }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [manualMode, setManualMode] = useState<Record<string, boolean>>({});
  const calendarRef = useRef<HTMLDivElement>(null);

  const inputStyles = "px-4 py-3 border border-slate-200 rounded-2xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-600";
  const labelStyles = "text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1 ml-1";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setShowCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateDiscipline = (index: number, updates: Partial<DisciplineEntry>) => {
    const next = [...data.disciplines];
    next[index] = { ...next[index], ...updates };
    updateData({ disciplines: next });
    return next[index];
  };

  const getAvailablePDAs = (entry: DisciplineEntry) => {
    if (!entry.content || !data.grade || !entry.discipline) return [];
    const db = DB_MAP[entry.field];
    const match = db?.[entry.discipline]?.find((c: any) => c.content === entry.content);
    if (!match) return [];
    const gradeKey = data.grade.charAt(0) as "1" | "2" | "3";
    return (match.pda[gradeKey] || "").split('\n\n').filter((p: string) => p.trim() !== "");
  };

  const handlePDAToggle = (index: number, pda: string) => {
    const entry = data.disciplines[index];
    const currentPDAs = entry.pda ? entry.pda.split('\n\n').filter(p => p.trim() !== "") : [];
    
    let nextPDAs: string[];
    if (currentPDAs.includes(pda)) {
      nextPDAs = currentPDAs.filter(p => p !== pda);
    } else {
      nextPDAs = [...currentPDAs, pda];
    }
    
    const nextPDAStr = nextPDAs.join('\n\n');
    updateDiscipline(index, { pda: nextPDAStr });
  };

  const toggleManual = (idx: number, type: 'content' | 'pda') => {
    const key = `${idx}-${type}`;
    setManualMode(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 md:p-10 space-y-12">
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100"><i className="fas fa-school text-sm"></i></div>
          Identificación Institucional
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-6 mb-4">
          <div className="flex flex-col">
            <label className={labelStyles}>Escuela</label>
            <input type="text" value={data.schoolName} onChange={(e) => updateData({ schoolName: e.target.value })} className={inputStyles} placeholder="Nombre de la secundaria" />
          </div>
          <div className="flex flex-col">
            <label className={labelStyles}>1.1 Grado</label>
            <select value={data.grade} onChange={(e) => updateData({ grade: e.target.value, disciplines: data.disciplines.map(d => ({...d, pda: ''})) })} className={inputStyles}>
              <option value="">Seleccionar Grado</option>
              {GRADOS.map(g => <option key={g} value={`${g}° Grado`}>{g}° Grado</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className={labelStyles}>Trimestre</label>
            <select value={data.trimester} onChange={(e) => updateData({ trimester: e.target.value })} className={inputStyles}>
              <option value="">Seleccionar Trimestre</option>
              <option value="1er Trimestre">1. Primer trimestre</option>
              <option value="2do Trimestre">2. Segundo trimestre</option>
              <option value="3er Trimestre">3. Tercer trimestre</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className={labelStyles}>1.4 Situación Temática</label>
            <input type="text" value={data.thematicSituation} onChange={(e) => updateData({ thematicSituation: e.target.value })} placeholder="Contexto o problema central..." className={inputStyles} />
          </div>
          <div className="flex flex-col relative" ref={calendarRef}>
            <label className={labelStyles}>1.5 Temporalidad</label>
            <div className="relative">
              <input type="text" value={data.temporality} onChange={(e) => updateData({ temporality: e.target.value })} placeholder="Ej: Del 15 al 30 de Octubre..." className={`${inputStyles} w-full pr-12`} />
              <button onClick={() => setShowCalendar(!showCalendar)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors">
                <i className="fas fa-calendar-alt"></i>
              </button>
              {showCalendar && <MiniCalendar onSelect={(r) => updateData({ temporality: r })} onClose={() => setShowCalendar(false)} />}
            </div>
          </div>
          <div className="flex flex-col">
            <label className={labelStyles}>1.3 Nombre del Proyecto</label>
            <div className="flex gap-2 relative">
              <input type="text" value={data.projectName} onChange={(e) => updateData({ projectName: e.target.value })} placeholder="Ej: Guardianes del Planeta..." className={inputStyles} />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-10">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-white shadow-lg"><i className="fas fa-layer-group text-sm"></i></div>
          Proceso Interdisciplinario - Codiseño
        </h2>

        {data.disciplines.map((entry, idx) => {
          const selectedPDAs = entry.pda ? entry.pda.split('\n\n').filter(p => p.trim() !== "") : [];
          const isContentManual = manualMode[`${idx}-content`];
          const isPDAManual = manualMode[`${idx}-pda`];

          return (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group animate-fadeIn">
              {data.disciplines.length > 1 && (
                <button onClick={() => updateData({ disciplines: data.disciplines.filter((_, i) => i !== idx) })} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-slate-200 text-rose-500 shadow-md hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center z-10">
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className={labelStyles}>2.1 Campo Formativo</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                    {FORMATIVE_FIELDS.map(f => (
                      <button key={f.id} onClick={() => updateDiscipline(idx, { field: f.name, discipline: '', content: '', pda: '', evaluation: '', activityGeneralities: '' })} className={`px-4 py-3 rounded-2xl text-[10px] font-bold border-2 transition-all ${entry.field === f.name ? `${f.color} text-white border-transparent shadow-lg scale-[1.02]` : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100 hover:bg-slate-50'}`}>{f.name}</button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className={labelStyles}>2.2 Disciplina</label>
                  <select value={entry.discipline} onChange={(e) => updateDiscipline(idx, { discipline: e.target.value, content: '', pda: '', activityGeneralities: '' })} className={inputStyles}>
                    <option value="">Selecciona Disciplina</option>
                    {DIS_MAP[entry.field]?.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className={labelStyles}>2.3 Contenido</label>
                    {isContentManual && (
                      <button onClick={() => toggleManual(idx, 'content')} className="text-[9px] text-indigo-600 font-bold hover:underline mb-1">Regresar a lista</button>
                    )}
                  </div>
                  {isContentManual ? (
                    <textarea 
                      value={entry.content} 
                      onChange={(e) => updateDiscipline(idx, { content: e.target.value })} 
                      placeholder="Escribe el contenido manualmente..."
                      className={`${inputStyles} h-20 resize-none py-4`}
                    />
                  ) : (
                    <select 
                      value={entry.content} 
                      onChange={(e) => {
                        if (e.target.value === "__MANUAL__") {
                          toggleManual(idx, 'content');
                          updateDiscipline(idx, { content: '' });
                        } else {
                          updateDiscipline(idx, { content: e.target.value, pda: '', activityGeneralities: '' });
                        }
                      }} 
                      className={inputStyles}
                    >
                      <option value="">Selecciona Contenido</option>
                      {entry.discipline && DB_MAP[entry.field]?.[entry.discipline]?.map((c: any) => (
                        <option key={c.id} value={c.content}>{c.id}. {c.content.substring(0, 60)}...</option>
                      ))}
                      <option value="__MANUAL__" className="font-bold text-indigo-600 bg-indigo-50">✨ Agregar manualmente</option>
                    </select>
                  )}
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className={labelStyles}>2.4 Procesos de Desarrollo de Aprendizaje (PDA)</label>
                    {isPDAManual && (
                      <button onClick={() => toggleManual(idx, 'pda')} className="text-[9px] text-indigo-600 font-bold hover:underline">Regresar a lista</button>
                    )}
                  </div>
                  
                  {isPDAManual ? (
                    <textarea 
                      value={entry.pda} 
                      onChange={(e) => updateDiscipline(idx, { pda: e.target.value })} 
                      placeholder="Escribe el PDA manualmente..."
                      className={`${inputStyles} w-full h-32 resize-none py-4`}
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {getAvailablePDAs(entry).map((p, pidx) => {
                        const isSelected = selectedPDAs.includes(p);
                        return (
                          <div 
                            key={pidx} 
                            onClick={() => handlePDAToggle(idx, p)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 bg-white ${isSelected ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'}`}
                          >
                            <div className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-transparent'}`}>
                              <i className="fas fa-check text-[10px]"></i>
                            </div>
                            <span className={`text-sm leading-relaxed transition-colors ${isSelected ? 'text-indigo-900 font-semibold' : 'text-slate-500'}`}>{p}</span>
                          </div>
                        );
                      })}
                      
                      <button 
                        onClick={() => toggleManual(idx, 'pda')}
                        className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-plus-circle"></i> Agregar PDA manualmente
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-4 pt-6 mt-4 border-t border-slate-50">
                  <div className="flex flex-col gap-4">
                    <label className={labelStyles}>2.5 Orientaciones generales</label>
                    <textarea 
                      value={entry.activityGeneralities}
                      onChange={(e) => updateDiscipline(idx, { activityGeneralities: e.target.value })}
                      placeholder="Describe la secuencia didáctica, el rol del alumno y el vínculo disciplinar..."
                      className={`${inputStyles} w-full h-40 resize-none py-5 leading-relaxed`}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-slate-50">
                  <label className={labelStyles}>2.6 Evaluación Formativa</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-2 mb-1">Técnica</label>
                      <select 
                        value={entry.evaluation.split(':')[0].trim()}
                        onChange={(e) => updateDiscipline(idx, { evaluation: `${e.target.value}: ` })}
                        className={inputStyles}
                      >
                        <option value="">Elegir Técnica</option>
                        {Object.keys(EVALUATION_MAP).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-2 mb-1">Instrumento</label>
                      <select 
                        disabled={!entry.evaluation.includes(':')}
                        value={entry.evaluation.split(':')[1]?.trim() || ''}
                        onChange={(e) => {
                          const tech = entry.evaluation.split(':')[0];
                          updateDiscipline(idx, { evaluation: `${tech}: ${e.target.value}` });
                        }}
                        className={inputStyles}
                      >
                        <option value="">Elegir Instrumento</option>
                        {entry.evaluation.includes(':') && EVALUATION_MAP[entry.evaluation.split(':')[0].trim()]?.map(i => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex justify-center pt-8 pb-20">
          <button 
            onClick={() => updateData({ disciplines: [...data.disciplines, { field: 'Lenguajes', discipline: '', content: '', pda: '', evaluation: '', activityGeneralities: '' }] })}
            className="group flex flex-col items-center gap-4 p-10 bg-white border-2 border-dashed border-slate-100 text-slate-300 rounded-[3rem] hover:border-indigo-400 hover:bg-indigo-50/30 hover:text-indigo-600 transition-all shadow-sm hover:shadow-2xl active:scale-95 w-full max-w-lg"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
              <i className="fas fa-plus text-xl"></i>
            </div>
            <div className="text-center">
              <span className="font-black text-xs tracking-[0.2em] uppercase block mb-1">Nueva Disciplina</span>
              <span className="text-[10px] opacity-60 font-medium">Codiseño Interdisciplinario</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
