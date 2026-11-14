import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { api } from '../api.js';
import { project } from '../../shared/project.config.js';
import { environmentalIssues } from '../../shared/environmental-issues.js';
import BriefMarkdown from './BriefMarkdown.jsx';

export default function ChatPanel({ skills, issue, question, onQuestionChange }) {
  const [messages, setMessages] = useState([]);
  const [skill, setSkill] = useState('auto');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [printBrief, setPrintBrief] = useState(null);
  const logRef = useRef(null);
  const latestMessageRef = useRef(null);

  useEffect(() => {
    const log = logRef.current;
    if (busy) log.scrollTop = log.scrollHeight;
    else if (latestMessageRef.current) log.scrollTop = latestMessageRef.current.offsetTop;
  }, [messages, busy]);

  useEffect(() => {
    const resetPrint = () => setPrintBrief(null);
    window.addEventListener('afterprint', resetPrint);
    return () => window.removeEventListener('afterprint', resetPrint);
  }, []);

  function print(message) {
    flushSync(() => setPrintBrief(message));
    window.print();
  }

  const latestBrief = messages.findLast((message) =>
    message.meta?.skill === 'impact-to-action-brief' && /^### 7\. Sources$/m.test(message.text)
  );
  const choosable = skills.filter((s) => !['safety-guardrail', 'intent-router'].includes(s.name));

  async function send(event) {
    event.preventDefault();
    const text = question.trim();
    if (!text || busy) return;
    setError('');
    onQuestionChange('');
    const history = messages.slice(-6).map((m) => ({ role: m.role, text: m.text.slice(0, 4000) }));
    const previousSkill = messages.at(-1)?.meta?.skill;
    const topic = environmentalIssues.find(({ question }) => question === text)?.title;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setBusy(true);
    try {
      const data = await api.chat({ message: text, skill, issue, previousSkill, history });
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: data.reply,
        meta: data,
        topic,
      }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.slice(0, -1));
      onQuestionChange((draft) => draft || text);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="card chat" aria-labelledby="chat-title">
        <div className="card-head">
          <h2 id="chat-title">Ask {project.agent.name}</h2>
          {latestBrief && (
            <button
              className="print-button"
              type="button"
              title={latestBrief.topic ? `Print the ${latestBrief.topic.toLowerCase()} brief` : 'Print the latest brief'}
              onClick={() => print(latestBrief)}
            >
              Print / Save PDF
            </button>
          )}
          <label className="skill-pick">
            Response mode
            <select value={skill} onChange={(e) => setSkill(e.target.value)}>
              <option value="auto">Automatic</option>
              {choosable.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </label>
        </div>

        <ul className="chat-log" ref={logRef} aria-live="polite">
          {messages.length === 0 && (
            <li className="empty">Choose an issue to start a brief, or ask your own question about data centers in Loudoun County.</li>
          )}
          {messages.map((m, i) => (
            <li key={i} className={`bubble ${m.role}`} ref={i === messages.length - 1 ? latestMessageRef : null}>
              {m.role === 'assistant' ? (
                <BriefMarkdown text={m.text} sources={m.meta.skill === 'impact-to-action-brief' ? m.meta.sources : undefined} />
              ) : (
                <p>{m.text}</p>
              )}
            </li>
          ))}
          {busy && <li className="bubble assistant thinking">{project.agent.name} is thinking...</li>}
        </ul>

        <form className="chat-form" onSubmit={send}>
          <label htmlFor="chat-input" className="sr-only">Your question</label>
          <textarea
            id="chat-input"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="Ask about water use, noise, or air quality..."
            maxLength={2000}
            rows={3}
          />
          <button type="submit" disabled={busy}>Send</button>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
      </section>
      {printBrief && (
        <article className="print-brief">
          <header>
            <p>Insight to Impact · Loudoun County, Virginia</p>
            <h1>{printBrief.topic ? `Data Center Impact Brief: ${printBrief.topic}` : 'Data Center Impact Brief'}</h1>
          </header>
          <BriefMarkdown text={printBrief.text} sources={printBrief.meta.sources} />
          <h2>Source URLs</h2>
          <ul>
            {printBrief.meta.sources.map(({ id, url }) => <li key={id}><a href={url}>{url}</a></li>)}
          </ul>
        </article>
      )}
    </>
  );
}
