
import React from 'react';

interface HeaderProps {
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
  onPrint: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onPrint }) => {
  return (
    <header className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <i className="fas fa-microchip text-xl animate-pulse"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            DIGITAL ENS
          </h1>
          <p className="text-[10px] md:text-xs text-slate-500 font-bold tracking-tight uppercase">
            Escuela Normal Superior "Profr. Moisés Sáenz Garza"
          </p>
        </div>
      </div>

      <nav className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'edit' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fas fa-layer-group mr-2"></i> Editor
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'preview' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fas fa-file-signature mr-2"></i> Vista Previa
        </button>
      </nav>

      <div className="flex items-center gap-3">
        {activeTab === 'preview' ? (
          <button 
            onClick={onPrint}
            className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <i className="fas fa-file-pdf"></i> Exportar
          </button>
        ) : (
          <div className="w-24 hidden md:block"></div>
        )}
      </div>
    </header>
  );
};

export default Header;
