import { useState } from 'react';
import { environmentalIssues } from '../../shared/environmental-issues.js';
import { loudounSources } from '../../shared/loudoun-sources.js';

export default function ResourceBoard({ selectedIssue, onSelectIssue }) {
  const [showSources, setShowSources] = useState(false);
  const sources = loudounSources.filter(({ issues }) =>
    !selectedIssue || selectedIssue === 'all' || issues.includes(selectedIssue)
  );

  return (
    <section className="card resources" aria-labelledby="issues-title">
      <div className="card-head">
        <h2 id="issues-title">Choose an issue</h2>
      </div>

      <p className="card-intro">Choose a topic to prepare a question and see the relevant sources.</p>

      <div className="issue-options" role="group" aria-label="Environmental issues">
        {[...environmentalIssues.slice(1), environmentalIssues[0]].map((issue) => (
          <button
            key={issue.id}
            type="button"
            className={`issue-option ${selectedIssue === issue.id ? 'selected' : ''}`}
            aria-pressed={selectedIssue === issue.id}
            onClick={() => {
              onSelectIssue(issue);
              setShowSources(true);
            }}
          >
            <strong>{issue.title}</strong>
            <span>{issue.description}</span>
          </button>
        ))}
      </div>

      {selectedIssue && (
        <p className="notice ok" role="status">
          Question ready in Ask Impact Explorer. Edit it or select Send.
        </p>
      )}

      <details className="issue-sources" open={showSources} onToggle={(event) => setShowSources(event.currentTarget.open)}>
        <summary>Source links and notes</summary>
        <ul className="resource-list">
          {sources.map(({ id, name, url, description }) => (
            <li key={id}>
              <a href={url} target="_blank" rel="noreferrer">{name}</a>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
