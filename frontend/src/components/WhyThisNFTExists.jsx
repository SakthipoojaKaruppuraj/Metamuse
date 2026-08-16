import React from 'react';
import { Eye, FileText, Info } from 'lucide-react';

/**
 * Renders the editorial report explaining why the NFT exists.
 * Replaces bracketed footnotes like [1] with active links that scroll to evidence cards.
 */
export function WhyThisNFTExists({ explanation, sourcesCount }) {
  if (!explanation) return null;

  // Split description by paragraph
  const paragraphs = explanation.split('\n\n').filter(Boolean);

  const handleFootnoteClick = (e, index) => {
    e.preventDefault();
    const targetElement = document.getElementById(`evidence-card-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetElement.classList.add('highlight-glow');
      setTimeout(() => {
        targetElement.classList.remove('highlight-glow');
      }, 2000);
    } else {
      const section = document.getElementById('evidence-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to render text with interactive footnotes
  const renderParagraphText = (text) => {
    const parts = [];
    const regex = /\[(\d+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const footnoteIndex = match[1];
      const matchIndex = match.index;

      // Add preceding plain text
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      // Add interactive footnote link
      parts.push(
        <a
          key={matchIndex}
          href={`#evidence-${footnoteIndex}`}
          onClick={(e) => handleFootnoteClick(e, footnoteIndex)}
          className="inline-flex items-center justify-center w-5 h-5 mx-0.5 rounded bg-violet-50 hover:bg-violet-100 text-[10px] font-bold text-violet-600 transition-colors border border-violet-100 hover:border-violet-200 cursor-pointer"
        >
          {footnoteIndex}
        </a>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm relative overflow-hidden">
      {/* Editorial Watermark/Background Accent */}
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 text-slate-900 select-none pointer-events-none font-black text-9xl">
        WHY
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] tracking-wider uppercase font-bold text-violet-500 bg-violet-50 px-2.5 py-1 rounded-md">
            Core Assessment
          </span>
          <h3 className="font-serif text-2xl font-bold text-slate-800 mt-2">
            Why This NFT Exists
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Backed by {sourcesCount} audited sources</span>
        </div>
      </div>

      <div className="space-y-5">
        {paragraphs.map((p, index) => (
          <p key={index} className="text-slate-600 text-base leading-relaxed font-sans">
            {renderParagraphText(p)}
          </p>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3 bg-violet-50/40 p-4 rounded-xl border border-violet-50/50">
        <Info className="w-5 h-5 text-violet-500 flex-shrink-0" />
        <p className="text-slate-500 text-xs leading-normal">
          This explanation is generated based on structural verification checks. 
          Numbers correspond to citations verified in the <span className="font-semibold text-slate-700">Evidence Registry</span> below. Click any citation to inspect its validator logs.
        </p>
      </div>
    </div>
  );
}
