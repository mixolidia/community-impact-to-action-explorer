import { useState } from 'react';

const ISSUES = [
  {
    id: 'all',
    title: 'All three issues',
    description: 'Explore water use, noise, and air quality together, including possible connections and trade-offs.',
  },
  {
    id: 'water',
    title: 'Water use',
    description: 'Explore cooling-related water demand, potential impacts, and ways to reduce consumption.',
  },
  {
    id: 'noise',
    title: 'Noise',
    description: 'Explore noise from cooling equipment, generators, and other data center operations.',
  },
  {
    id: 'air',
    title: 'Air quality',
    description: 'Explore potential air pollution from backup generators and other data center activities.',
  },
];

export default function ResourceBoard({ onSelectIssue }) {
  const [selectedIssue, setSelectedIssue] = useState('');

  function handleSelect(issue) {
    setSelectedIssue(issue);
    onSelectIssue(issue);
  }

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
        {ISSUES.map((issue) => (
          <button
            key={issue.id}
            type="button"
            className={`issue-option ${selectedIssue === issue.id ? 'selected' : ''}`}
            aria-pressed={selectedIssue === issue.id}
            onClick={() => handleSelect(issue.id)}
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
    </section>
  );
}
