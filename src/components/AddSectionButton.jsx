import { useResumeDispatch } from '../hooks/useResumeStore';
import './AddSectionButton.css';

export default function AddSectionButton() {
  const dispatch = useResumeDispatch();

  const handleAdd = () => {
    dispatch({ type: 'ADD_SECTION' });
  };

  return (
    <button
      className="add-section-btn no-print"
      onClick={handleAdd}
      id="btn-add-section"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span>Adicionar Seção</span>
    </button>
  );
}
