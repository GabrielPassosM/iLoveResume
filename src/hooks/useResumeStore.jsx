import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ResumeContext = createContext(null);
const ResumeDispatchContext = createContext(null);
const ResumeHistoryContext = createContext({
  canUndo: false,
  canRedo: false,
  undo: () => {},
  redo: () => {},
});

const MAX_HISTORY = 50;

export const DEFAULT_RESUME = {
  header: {
    name: 'Seu Nome',
    jobTitle: 'Seu Cargo',
    location: 'Cidade, Estado, País',
    email: 'email@exemplo.com',
    phone: '(00) 00000-0000',
    links: [],
  },
  sections: [
    {
      id: uuidv4(),
      title: 'Resumo Profissional',
      content: 'Escreva aqui um resumo das suas qualificações e objetivos profissionais.',
    },
    {
      id: uuidv4(),
      title: 'Experiência Profissional',
      content:
        '<b>Cargo, Empresa</b>\nMês Ano – Mês Ano\nDescrição das responsabilidades e conquistas.\n• Conquista ou número relevante',
    },
    {
      id: uuidv4(),
      title: 'Formação Acadêmica',
      content:
        '<b>Universidade</b>\nGrau em Curso, Mês Ano – Mês Ano',
    },
  ],
};

function resumeReducer(state, action) {
  switch (action.type) {
    case 'SET_HEADER_FIELD':
      if (state.header[action.field] === action.value) return state;
      return {
        ...state,
        header: {
          ...state.header,
          [action.field]: action.value,
        },
      };

    case 'ADD_LINK':
      return {
        ...state,
        header: {
          ...state.header,
          links: [
            ...state.header.links,
            { id: uuidv4(), label: 'Link', url: 'https://' },
          ],
        },
      };

    case 'UPDATE_LINK': {
      const targetLink = state.header.links.find((link) => link.id === action.id);
      if (targetLink && targetLink[action.field] === action.value) return state;
      return {
        ...state,
        header: {
          ...state.header,
          links: state.header.links.map((link) =>
            link.id === action.id ? { ...link, [action.field]: action.value } : link
          ),
        },
      };
    }

    case 'REMOVE_LINK':
      return {
        ...state,
        header: {
          ...state.header,
          links: state.header.links.filter((link) => link.id !== action.id),
        },
      };

    case 'ADD_SECTION':
      return {
        ...state,
        sections: [
          ...state.sections,
          {
            id: uuidv4(),
            title: 'Nova Seção',
            content: 'Edite o conteúdo desta seção.',
          },
        ],
      };

    case 'UPDATE_SECTION': {
      const targetSection = state.sections.find((section) => section.id === action.id);
      if (targetSection && targetSection[action.field] === action.value) return state;
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.id
            ? { ...section, [action.field]: action.value }
            : section
        ),
      };
    }

    case 'REMOVE_SECTION':
      return {
        ...state,
        sections: state.sections.filter((section) => section.id !== action.id),
      };

    case 'REORDER_SECTIONS': {
      const { fromIndex, toIndex } = action;
      if (fromIndex === toIndex) return state;
      const newSections = [...state.sections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);
      return { ...state, sections: newSections };
    }

    case 'LOAD_RESUME':
      if (JSON.stringify(state) === JSON.stringify(action.resume)) return state;
      return action.resume;

    default:
      return state;
  }
}

function historyReducer(state, action) {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO': {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }

    case 'REDO': {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }

    default: {
      const newPresent = resumeReducer(present, action);
      if (newPresent === present) {
        return state;
      }
      return {
        past: [...past.slice(-(MAX_HISTORY - 1)), present],
        present: newPresent,
        future: [],
      };
    }
  }
}

export function ResumeProvider({ children, initialData }) {
  const [historyState, dispatch] = useReducer(
    historyReducer,
    {
      past: [],
      present: initialData || DEFAULT_RESUME,
      future: [],
    }
  );

  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!isCmdOrCtrl) return;

      const key = e.key.toLowerCase();
      const isUndo = key === 'z' && !e.shiftKey;
      const isRedo = (key === 'z' && e.shiftKey) || key === 'y';

      if (!isUndo && !isRedo) return;

      const activeEl = document.activeElement;
      const tag = activeEl?.tagName?.toLowerCase();
      const isFormInput = tag === 'input' || tag === 'textarea';

      if (isFormInput) {
        return;
      }

      if (activeEl?.isContentEditable) {
        activeEl.blur();
      }

      e.preventDefault();
      if (isUndo) {
        undo();
      } else if (isRedo) {
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const historyValue = useMemo(() => ({
    canUndo,
    canRedo,
    undo,
    redo,
  }), [canUndo, canRedo, undo, redo]);

  return (
    <ResumeContext.Provider value={historyState.present}>
      <ResumeDispatchContext.Provider value={dispatch}>
        <ResumeHistoryContext.Provider value={historyValue}>
          {children}
        </ResumeHistoryContext.Provider>
      </ResumeDispatchContext.Provider>
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}

export function useResumeDispatch() {
  return useContext(ResumeDispatchContext);
}

export function useResumeHistory() {
  return useContext(ResumeHistoryContext);
}

