import { ResumeProvider } from './hooks/useResumeStore';
import { loadSavedResume } from './hooks/useAutoSave';
import Toolbar from './components/Toolbar';
import ResumeEditor from './components/ResumeEditor';

const savedData = loadSavedResume();

function App() {
  return (
    <ResumeProvider initialData={savedData}>
      <Toolbar />
      <ResumeEditor />
    </ResumeProvider>
  );
}

export default App;
