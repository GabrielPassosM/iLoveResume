import { useResume } from '../hooks/useResumeStore';
import { useAutoSave } from '../hooks/useAutoSave';
import HeaderEditor from './HeaderEditor';
import SectionEditor from './SectionEditor';
import AddSectionButton from './AddSectionButton';
import SaveIndicator from './SaveIndicator';
import './ResumeEditor.css';

export default function ResumeEditor() {
  const resume = useResume();

  // Auto-save to localStorage
  useAutoSave(resume);

  return (
    <main className="editor-container" id="editor-container">
      <SaveIndicator />
      <div className="resume-paper" id="resume-paper">
        <HeaderEditor />
        {resume.sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            totalSections={resume.sections.length}
          />
        ))}
        <AddSectionButton />
      </div>
    </main>
  );
}
