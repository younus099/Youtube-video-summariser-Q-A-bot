import { MarkdownHooks as ReactMarkdown } from 'react-markdown';
/**
 * SummaryView — Displays the AI-generated video summary.
 *
 * Props:
 *   summary — string
 */
function SummaryView({ summary }) {
  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-muted">
        <div className="text-4xl mb-3 opacity-40">📋</div>
        <p className="text-sm">No summary available yet</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Summary Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-brass rounded-full" />
        <h3 className="font-heading text-base font-semibold text-text-primary">
          Video Summary
        </h3>
      </div>

      {/* Summary Body */}
      <div className="text-sm text-text-secondary leading-7 whitespace-pre-wrap break-words">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
}

export default SummaryView;
