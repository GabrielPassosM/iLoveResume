import { useRef } from 'react';
import { useResumeDispatch } from '../hooks/useResumeStore';
import './SectionEditor.css';

export default function SectionEditor({ section, index, totalSections }) {
  const dispatch = useResumeDispatch();
  const contentRef = useRef(null);

  const handleTitleChange = (e) => {
    dispatch({
      type: 'UPDATE_SECTION',
      id: section.id,
      field: 'title',
      value: e.currentTarget.textContent,
    });
  };

  const handleContentChange = (e) => {
    dispatch({
      type: 'UPDATE_SECTION',
      id: section.id,
      field: 'content',
      value: e.currentTarget.innerText,
    });
  };

  const handleRemove = () => {
    if (window.confirm('Remover esta seção?')) {
      dispatch({ type: 'REMOVE_SECTION', id: section.id });
    }
  };

  const handleMoveUp = () => {
    if (index > 0) {
      dispatch({
        type: 'REORDER_SECTIONS',
        fromIndex: index,
        toIndex: index - 1,
      });
    }
  };

  const handleMoveDown = () => {
    if (index < totalSections - 1) {
      dispatch({
        type: 'REORDER_SECTIONS',
        fromIndex: index,
        toIndex: index + 1,
      });
    }
  };

  return (
    <div className="section-editor" id={`section-${section.id}`}>
      {/* Section controls (visible on hover) */}
      <div className="section-controls no-print">
        <button
          className="section-control-btn"
          onClick={handleMoveUp}
          disabled={index === 0}
          title="Mover para cima"
          aria-label="Mover seção para cima"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <button
          className="section-control-btn"
          onClick={handleMoveDown}
          disabled={index === totalSections - 1}
          title="Mover para baixo"
          aria-label="Mover seção para baixo"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <button
          className="section-control-btn section-control-btn--danger"
          onClick={handleRemove}
          title="Remover seção"
          aria-label="Remover seção"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* Section Title */}
      <div
        className="section-title"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTitleChange}
      >
        {section.title}
      </div>

      {/* Divider */}
      <hr className="section-divider" />

      {/* Section Content */}
      <div
        ref={contentRef}
        className="section-content"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }}
      />
    </div>
  );
}
