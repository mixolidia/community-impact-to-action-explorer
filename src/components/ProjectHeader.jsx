import { project, isTodo } from '../../shared/project.config.js';

// Shows your team and problem statement. Edit shared/project.config.js to change it.
function Field({ value, className = '' }) {
  return <span className={`${className} ${isTodo(value) ? 'todo' : ''}`}>{value}</span>;
}

export default function ProjectHeader({ health }) {
  return (
    <header className="hero">
      <div className="hero-inner">
        <p className="eyebrow">
          <Field value={project.teamName} /> · <Field value={project.community} />
        </p>
        <h1>{project.appName}</h1>
        <p className="tagline">{project.tagline}</p>
        <div className="problem">
          <h2>The problem we're solving</h2>
          <p><Field value={project.problemStatement} /></p>
          <p className="for"><strong>For:</strong> <Field value={project.targetUser} /></p>
        </div>
        <div className="pills" aria-label="AI status">
          <StatusPill health={health} />
        </div>
      </div>
    </header>
  );
}

function StatusPill({ health }) {
  const live = health?.ai === 'live';
  const state = !health ? 'loading' : live ? 'ok' : 'warn';
  const status = !health ? 'checking…' : health.ok === false ? 'unavailable' : live ? 'Gemini live' : 'Mock mode';
  return (
    <span className={`pill ${state}`}>
      <span className="dot" aria-hidden="true" /> AI: {status}
    </span>
  );
}
