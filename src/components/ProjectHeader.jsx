import { project } from '../../shared/project.config.js';

export default function ProjectHeader({ health }) {
  const status = !health ? 'Checking AI…' : health.ok === false ? 'AI unavailable'
    : health.ai === 'live' ? 'Gemini live' : 'AI preview mode';

  return (
    <header className="site-header">
      <div className="masthead">
        <a href="./" className="brand">
          <span className="brand-mark" aria-hidden="true">i2i</span>
          <span>Insight to Impact</span>
        </a>
        <span className="ai-status" data-live={health?.ai === 'live'} role="status">{status}</span>
      </div>
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Loudoun County, Virginia</p>
          <h1>{project.appName}</h1>
          <p className="tagline">Explore how data centers affect local water, noise, and air quality. Read the evidence and find out what to ask decision-makers.</p>
          <a className="hero-link" href="#issues-title">Explore the issues <span aria-hidden="true">↓</span></a>
        </div>
        <figure className="hero-photo">
          <img src="/purcellville-neighborhood.jpg" alt="Aerial view of a neighborhood among autumn trees in Purcellville, Virginia" width="1500" height="1000" fetchPriority="high" />
          <figcaption>
            <a href="https://www.travelandleisure.com/guide-to-loudoun-county-virginia-11766291" target="_blank" rel="noreferrer">Purcellville, Virginia · Gerville/Getty Images</a>
          </figcaption>
        </figure>
      </div>
    </header>
  );
}
