import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'iloveresume_data';
const DEBOUNCE_MS = 500;

export function useAutoSave(resume) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resume]);
}

export function loadSavedResume() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Erro ao carregar do localStorage:', e);
  }
  return null;
}
