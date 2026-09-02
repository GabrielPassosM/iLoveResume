import { useRef } from 'react';
import { useResume, useResumeDispatch } from '../hooks/useResumeStore';
import { exportProject, importProject } from '../utils/exportImport';
import { exportPdf } from '../utils/exportPdf';
import { exportDocx } from '../utils/exportDocx';
import './Toolbar.css';

export default function Toolbar() {
  const resume = useResume();
  const dispatch = useResumeDispatch();
  const fileInputRef = useRef(null);

  const handleExportProject = () => {
    exportProject(resume);
  };

  const handleImportProject = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedResume = await importProject(file);
      dispatch({ type: 'LOAD_RESUME', resume: importedResume });
    } catch (err) {
      alert(err.message);
    }

    // Reset input so the same file can be imported again
    e.target.value = '';
  };

  const handleExportPdf = async () => {
    await exportPdf();
  };

  const handleExportDocx = async () => {
    await exportDocx(resume);
  };

  return (
    <header className="toolbar" id="main-toolbar">
      <div className="toolbar-left">
        <div className="toolbar-logo">
          <span className="toolbar-logo-icon">📄</span>
          <span className="toolbar-logo-text">iLoveResume</span>
        </div>
      </div>

      <div className="toolbar-right">
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="import-file-input"
        />

        <button
          className="toolbar-btn toolbar-btn--secondary"
          onClick={handleImportProject}
          id="btn-import-project"
          title="Importar Projeto (.json)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Importar</span>
        </button>

        <button
          className="toolbar-btn toolbar-btn--secondary"
          onClick={handleExportProject}
          id="btn-export-project"
          title="Exportar Projeto (.json)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Exportar</span>
        </button>

        <div className="toolbar-separator" />

        <button
          className="toolbar-btn toolbar-btn--primary"
          onClick={handleExportPdf}
          id="btn-export-pdf"
          title="Baixar como PDF"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>PDF</span>
        </button>

        <button
          className="toolbar-btn toolbar-btn--primary"
          onClick={handleExportDocx}
          id="btn-export-docx"
          title="Baixar como DOCX"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>DOCX</span>
        </button>
      </div>
    </header>
  );
}
