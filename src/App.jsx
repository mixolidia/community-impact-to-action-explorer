import { useEffect, useState } from 'react';
import { api } from './api.js';
import ProjectHeader from './components/ProjectHeader.jsx';
import StartHere from './components/StartHere.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import ResourceBoard from './components/ResourceBoard.jsx';
import SkillsPanel from './components/SkillsPanel.jsx';

const ISSUE_QUESTIONS = {
  all:
    'How do data centers affect water use, noise, and air quality in Loudoun County? Explain the available evidence for each issue, potential mitigation measures and trade-offs, relevant decision-makers, and accountability questions. Also identify possible connections between the three issues and important information gaps.',
  water:
    'How does data center water use affect communities in Loudoun County? What mitigation measures and trade-offs should be considered, and what should residents ask decision-makers?',
  noise:
    'How does noise from data centers affect nearby communities in Loudoun County? What mitigation measures and trade-offs should be considered, and what should residents ask decision-makers?',
  air:
    'How might data centers affect air quality in Loudoun County? What mitigation measures and trade-offs should be considered, and what should residents ask decision-makers?',
};

export default function App() {
  const [health, setHealth] = useState(null);
  const [skills, setSkills] = useState([]);
  const [suggestedQuestion, setSuggestedQuestion] = useState('');

  useEffect(() => {
    api.health().then(setHealth).catch(() => setHealth({ ok: false }));
    api.skills().then((data) => setSkills(data.skills)).catch(() => setSkills([]));
  }, []);

  function selectIssue(issue) {
    setSuggestedQuestion(ISSUE_QUESTIONS[issue] ?? '');
  }

  return (
    <>
      <ProjectHeader health={health} />
      <main className="layout">
        <StartHere health={health} />
        <ChatPanel
          skills={skills}
          suggestedQuestion={suggestedQuestion}
        />
        <ResourceBoard onSelectIssue={selectIssue} />
        <SkillsPanel skills={skills} />
      </main>
      <footer className="footer">
        Built for the CodeSquad AI Community Sprint. Answers come from AI and can be wrong. Never share personal information.
      </footer>
    </>
  );
}
