import ReactMarkdown from 'react-markdown';

export default function BriefMarkdown({ text, sources }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={sources ? {
          a: ({ href, children }) => sources.some((source) => source.url === href)
            ? <a href={href} target="_blank" rel="noreferrer">{children}</a>
            : <>{children}</>,
        } : undefined}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
