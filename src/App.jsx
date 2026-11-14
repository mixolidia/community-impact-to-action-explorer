import { useEffect, useState } from 'react';
import { api } from './api.js';
import ProjectHeader from './components/ProjectHeader.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import ResourceBoard from './components/ResourceBoard.jsx';
import SkillsPanel from './components/SkillsPanel.jsx';

export default function App() {
  const [health, setHealth] = useState(null);
  const [skills, setSkills] = useState([]);
  const [question, setQuestion] = useState('');
  const [selectedIssue, setSelectedIssue] = useState();

  useEffect(() => {
    api.health().then(setHealth).catch(() => setHealth({ ok: false }));
    api.skills().then((data) => setSkills(data.skills)).catch(() => setSkills([]));
  }, []);

  function selectIssue(issue) {
    setSelectedIssue(issue.id);
    setQuestion(issue.question);
  }

  return (
    <>
      <ProjectHeader health={health} />
      <main className="layout">
        <ResourceBoard selectedIssue={selectedIssue} onSelectIssue={selectIssue} />
        <ChatPanel
          skills={skills}
          issue={selectedIssue}
          question={question}
          onQuestionChange={setQuestion}
        />
        <details className="about-skills">
          <summary>How the agent works</summary>
          <SkillsPanel skills={skills} />
        </details>
      </main>
      <footer className="footer">
        Built for the CodeSquad AI Community Sprint. Check AI answers against the linked sources. Keep personal information out of the chat.
      </footer>
    </>
  );
}
