
import React, { useState, useRef, useEffect } from 'react';
import { ProjectData, INITIAL_DATA } from './types';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import DocumentPreview, { DocumentPreviewHandle } from './components/DocumentPreview';

// Declaración para evitar errores de TS con la librería global
declare var html2pdf: any;

const App: React.FC = () => {
  const [data, setData] = useState<ProjectData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isPreparingPDF, setIsPreparingPDF] = useState(false);
  const previewRef = useRef<DocumentPreviewHandle>(null);

  useEffect(() => {
    if (data.projectName) {
      document.title = `Planeacion_NEM_${data.projectName.replace(/\s+/g, '_')}`;
    } else {
      document.title = 'DIGITAL_ENS_Planificación';
    }
  }, [data.projectName]);

  const updateData = (newData: Partial<ProjectData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-area');
    if (!element) return;

    setIsPreparingPDF(true);
    
    // Aseguramos que la vista previa esté activa
    if (activeTab !== 'preview') {
      setActiveTab('preview');
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const fileName = `Planeacion_NEM_${(data.projectName || 'Proyecto').replace(/\s+/g, '_')}.pdf`;

    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     fileName,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      // Fallback a impresión de sistema si falla la librería
      window.print();
    } finally {
      setIsPreparingPDF(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 relative">
      {/* Overlay de descarga PDF */}
      {isPreparingPDF && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 no-print">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center max-w-sm animate-fadeIn border border-slate-100">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative">
              <div className="loader-spin"></div>
              <i className="fas fa-file-pdf absolute text-indigo-600 text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Generando Archivo</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 text-center">
              Ensamblando la arquitectura educativa para la Escuela Normal Superior...
            </p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full animate-[progress_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      )}

      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onPrint={handleDownloadPDF}
      />
      
      <main className={`flex-grow p-4 md:p-8 ${activeTab === 'preview' ? 'print:p-0 pb-32' : 'pb-24'}`}>
        <div className="max-w-5xl mx-auto print:max-w-none print:w-full print:m-0">
          <div className={`bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 transition-all ${activeTab === 'preview' ? 'print:border-none print:shadow-none print:bg-white print:rounded-none' : ''}`}>
            {activeTab === 'edit' ? (
              <ProjectForm data={data} updateData={updateData} />
            ) : (
              <DocumentPreview 
                ref={previewRef} 
                data={data} 
                updateData={updateData} 
                onPrint={handleDownloadPDF} 
              />
            )}
          </div>
        </div>
      </main>

      {/* Botón Flotante de Descarga (Solo visible en Vista Previa y cuando no está cargando) */}
      {activeTab === 'preview' && !isPreparingPDF && (
        <button
          onClick={handleDownloadPDF}
          className="no-print fixed bottom-8 right-8 z-[60] group flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-indigo-200 hover:scale-110 active:scale-95 transition-all animate-bounce-subtle"
          title="Descargar Planeación en PDF"
        >
          <div className="flex flex-col items-end mr-1">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Listo para entregar</span>
            <span className="text-sm font-bold">Descargar PDF</span>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i className="fas fa-download"></i>
          </div>
        </button>
      )}

      <footer className="no-print bg-white border-t border-slate-200 text-slate-400 py-6 px-8 text-[10px] text-center">
        <p className="font-bold text-slate-500 uppercase tracking-wide">
          <i className="fas fa-laptop-code mr-2 text-indigo-400"></i>
          DIGITAL ENS &copy; 2025 | Escuela Normal Superior "Profr. Moisés Sáenz Garza"
        </p>
      </footer>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
