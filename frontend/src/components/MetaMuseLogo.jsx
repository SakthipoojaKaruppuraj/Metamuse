import React from 'react';

/**
 * MetaMuse Logo Icon + Wordmark
 * Combines metadata, provenance node links, and artistic inspiration in an abstract vector.
 */
export function MetaMuseLogo({ showText = true, className = "", size = 32 }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Abstract SVG Icon */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform hover:rotate-12 duration-300"
      >
        {/* Connection paths */}
        <path d="M8 12L16 6L24 12" stroke="#B38CE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 20L16 26L24 20" stroke="#B38CE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6V26" stroke="#996FD6" strokeWidth="2" strokeDasharray="2,2" />
        
        {/* Data points / Metadata Nodes */}
        <circle cx="16" cy="6" r="3" fill="#996FD6" />
        <circle cx="8" cy="12" r="3" fill="#996FD6" />
        <circle cx="24" cy="12" r="3" fill="#996FD6" />
        
        {/* Core Art muse sphere */}
        <circle cx="16" cy="16" r="4.5" fill="#996FD6" stroke="#FFFFFF" strokeWidth="1.5" />
        
        <circle cx="8" cy="20" r="3" fill="#996FD6" />
        <circle cx="24" cy="20" r="3" fill="#996FD6" />
        <circle cx="16" cy="26" r="3" fill="#996FD6" />
      </svg>

      {showText && (
        <span className="font-serif text-xl font-extrabold text-slate-800 tracking-tight select-none">
          MetaMuse
        </span>
      )}
    </div>
  );
}
