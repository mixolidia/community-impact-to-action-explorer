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
        <h2 id="issues-title">Explore Environmental Impacts</h2>
      </div>

      <p>
        Explore how data centers may affect communities in Loudoun County,
        Virginia. Choose an issue to prepare a research question for Impact Explorer.
      </p>

      <div className="issue-options" role="group" aria-label="Environmental issues">
        {environmentalIssues.map((issue) => (
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
          Question prepared. Review or edit it in Ask Impact Explorer, then click Send.
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
