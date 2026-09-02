import { useState, useEffect, useRef } from 'react';
import { useResume } from '../hooks/useResumeStore';
import './SaveIndicator.css';

export default function SaveIndicator() {
  const resume = useResume();
  const [status, setStatus] = useState('saved'); // 'saving' | 'saved'
  const timerRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setStatus('saving');

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setStatus('saved');
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resume]);

  return (
    <div className={`save-indicator no-print ${status === 'saving' ? 'save-indicator--saving' : ''}`}>
      {status === 'saving' ? (
        <>
          <span className="save-dot save-dot--saving" />
          <span>Salvando...</span>
        </>
      ) : (
        <>
          <span className="save-dot save-dot--saved" />
          <span>Salvo</span>
        </>
      )}
    </div>
  );
}
