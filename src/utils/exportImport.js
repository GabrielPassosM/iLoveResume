import { saveAs } from 'file-saver';

export function exportProject(resume) {
  const json = JSON.stringify(resume, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const fileName = `curriculo_${resume.header.name.replace(/\s+/g, '_').toLowerCase() || 'projeto'}.json`;
  saveAs(blob, fileName);
}

export function importProject(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const resume = JSON.parse(e.target.result);
        if (!resume.header || !resume.sections) {
          reject(new Error('Formato de arquivo inválido.'));
          return;
        }
        resolve(resume);
      } catch (err) {
        reject(new Error('Erro ao ler o arquivo JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    reader.readAsText(file);
  });
}
