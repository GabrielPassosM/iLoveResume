import { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ResumeContext = createContext(null);
const ResumeDispatchContext = createContext(null);

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

    case 'UPDATE_LINK':
      return {
        ...state,
        header: {
          ...state.header,
          links: state.header.links.map((link) =>
            link.id === action.id ? { ...link, [action.field]: action.value } : link
          ),
        },
      };

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

    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.id
            ? { ...section, [action.field]: action.value }
            : section
        ),
      };

    case 'REMOVE_SECTION':
      return {
        ...state,
        sections: state.sections.filter((section) => section.id !== action.id),
      };

    case 'REORDER_SECTIONS': {
      const { fromIndex, toIndex } = action;
      const newSections = [...state.sections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);
      return { ...state, sections: newSections };
    }

    case 'LOAD_RESUME':
      return action.resume;

    default:
      return state;
  }
}

export function ResumeProvider({ children, initialData }) {
  const [resume, dispatch] = useReducer(
    resumeReducer,
    initialData || DEFAULT_RESUME
  );

  return (
    <ResumeContext.Provider value={resume}>
      <ResumeDispatchContext.Provider value={dispatch}>
        {children}
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
