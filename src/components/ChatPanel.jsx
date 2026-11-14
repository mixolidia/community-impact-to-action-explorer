import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { project } from '../../shared/project.config.js';
import ReactMarkdown from 'react-markdown';

export default function ChatPanel({ skills, issue, question, onQuestionChange }) {
  const [messages, setMessages] = useState([]);
  const [skill, setSkill] = useState('auto');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const logRef = useRef(null);
  const latestMessageRef = useRef(null);

  useEffect(() => {
    const log = logRef.current;
    if (busy) log.scrollTop = log.scrollHeight;
    else if (latestMessageRef.current) log.scrollTop = latestMessageRef.current.offsetTop;
  }, [messages, busy]);

  const choosable = skills.filter((s) => !['safety-guardrail', 'intent-router'].includes(s.name));

  async function send(event) {
    event.preventDefault();
    const text = question.trim();
    if (!text || busy) return;
    setError('');
    onQuestionChange('');
    const history = messages.slice(-6).map((m) => ({ role: m.role, text: m.text.slice(0, 4000) }));
    const previousSkill = messages.at(-1)?.meta?.skill;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setBusy(true);
    try {
      const data = await api.chat({ message: text, skill, issue, previousSkill, history });
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply, meta: data }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.slice(0, -1));
      onQuestionChange((draft) => draft || text);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card chat" aria-labelledby="chat-title">
      <div className="card-head">
        <h2 id="chat-title">Ask {project.agent.name}</h2>
        <label className="skill-pick">
          Skill
          <select value={skill} onChange={(e) => setSkill(e.target.value)}>
            <option value="auto">Auto (intent-router picks)</option>
            {choosable.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>

      <ul className="chat-log" ref={logRef} aria-live="polite">
        {messages.length === 0 && (
          <li className="empty"> Select an environmental issue to prepare a question, or ask your own question about data centers in Loudoun County.</li>
        )}
        {messages.map((m, i) => (
          <li key={i} className={`bubble ${m.role}`} ref={i === messages.length - 1 ? latestMessageRef : null}>
            {m.role === 'assistant' ? (
              <div className="markdown-content">
                <ReactMarkdown
                  components={m.meta.skill === 'impact-to-action-brief' ? {
                    a: ({ href, children }) => m.meta.sources?.some((source) => source.url === href)
                      ? <a href={href} target="_blank" rel="noreferrer">{children}</a>
                      : <>{children}</>,
                  } : undefined}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
            ) : (
              <p>{m.text}</p>
            )}
            {m.meta && (
              <small>
                skill: <b>{m.meta.skill}</b> · picked by {m.meta.routedBy}
                {m.meta.flags?.length ? ` · flags: ${m.meta.flags.join(', ')}` : ''}
              </small>
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
          rows={4}
        />
        <button type="submit" disabled={busy}>Send</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  );
}
