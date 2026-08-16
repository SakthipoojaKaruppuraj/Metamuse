import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, User, FileCode, CheckSquare, Image, Award, Database } from 'lucide-react';
import { formatAddress } from '../utils/formatAddress';

/**
 * Pure SVG Provenance Node Graph
 * Renders nodes in an editorial workflow layout:
 * Creator -> (Collection & Mint) -> NFT -> (Artwork & Owner)
 */
export function ProvenanceGraph({ graphData }) {
  const { nodes, links } = graphData;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Default coordinate mapping for standard 6-node layout
  const nodePositions = {
    creator: { x: 80, y: 150, icon: <User className="w-4 h-4" /> },
    collection: { x: 300, y: 70, icon: <FileCode className="w-4 h-4" /> },
    mint: { x: 300, y: 230, icon: <CheckSquare className="w-4 h-4" /> },
    nft: { x: 520, y: 150, icon: <Award className="w-4 h-4" /> },
    artwork: { x: 740, y: 70, icon: <Image className="w-4 h-4" /> },
    owner: { x: 740, y: 230, icon: <Database className="w-4 h-4" /> }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  // Helper to construct curved bezier links between columns
  const getBezierPath = (sourcePos, targetPos) => {
    const dx = Math.abs(targetPos.x - sourcePos.x);
    const xMid = sourcePos.x + dx / 2;
    return `M ${sourcePos.x} ${sourcePos.y} C ${xMid} ${sourcePos.y}, ${xMid} ${targetPos.y}, ${targetPos.x} ${targetPos.y}`;
  };

  return (
    <div className="bg-slate-50/30 rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Provenance Graph
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Cryptographic relational custody graph mapping Creator to current asset owner.
          </p>
        </div>

        {/* Control toolbar */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
          <button 
            onClick={handleZoomIn} 
            className="p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={handleZoomOut} 
            className="p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-slate-100" />
          <button 
            onClick={handleReset} 
            className="p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative border border-slate-100 bg-white rounded-xl h-[320px] overflow-hidden select-none shadow-inner">
        
        {/* Helper guide */}
        <div className="absolute left-4 top-4 text-[10px] text-slate-400 pointer-events-none">
          Click nodes to inspect attributes
        </div>

        <svg 
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ overflow: 'visible' }}
        >
          {/* Main Pan & Zoom Group */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}>
            
            {/* Draw Links (Paths) first so they sit behind nodes */}
            {links.map((link, idx) => {
              const sourcePos = nodePositions[link.source];
              const targetPos = nodePositions[link.target];
              if (!sourcePos || !targetPos) return null;

              const isHighlighted = 
                hoveredNode === link.source || 
                hoveredNode === link.target ||
                selectedNode?.id === link.source ||
                selectedNode?.id === link.target;

              return (
                <g key={idx}>
                  {/* Background thicker transparent path for easier hover */}
                  <path 
                    d={getBezierPath(sourcePos, targetPos)}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="10"
                  />
                  {/* Visible path */}
                  <path 
                    d={getBezierPath(sourcePos, targetPos)}
                    fill="none"
                    stroke={isHighlighted ? '#996FD6' : '#E2E8F0'}
                    strokeWidth={isHighlighted ? '2' : '1.5'}
                    strokeDasharray={isHighlighted ? '4,4' : 'none'}
                    className="transition-all duration-200"
                  />
                  {/* Text label on line */}
                  <text 
                    x={(sourcePos.x + targetPos.x) / 2} 
                    y={(sourcePos.y + targetPos.y) / 2 - 6}
                    textAnchor="middle"
                    fill={isHighlighted ? '#996FD6' : '#94A3B8'}
                    className="text-[9px] font-bold tracking-wider uppercase transition-colors duration-200"
                  >
                    {link.label}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isHovered = hoveredNode === node.id;
              const isSelected = selectedNode?.id === node.id;

              return (
                <g 
                  key={node.id}
                  transform={`translate(${pos.x - 75}, ${pos.y - 30})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Node Rect */}
                  <rect
                    width="150"
                    height="60"
                    rx="12"
                    fill="#FFFFFF"
                    stroke={isSelected ? '#996FD6' : isHovered ? '#B38CE3' : '#E2E8F0'}
                    strokeWidth={isSelected ? '2' : '1.5'}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.02))"
                    className="transition-all duration-200"
                  />

                  {/* Header/Type Tag */}
                  <rect
                    width="150"
                    height="18"
                    rx="0"
                    fill={isSelected ? '#F5F0FB' : '#FAF9FC'}
                    className="transition-colors duration-200"
                    clipPath="inset(0px 0px 0px 0px round 12px 12px 0px 0px)"
                  />

                  {/* Icon Placeholder */}
                  <g transform="translate(10, 10)">
                    <foreignObject width="16" height="16">
                      <div className={isSelected ? 'text-violet-600' : 'text-slate-400'}>
                        {pos.icon}
                      </div>
                    </foreignObject>
                  </g>

                  {/* Header Type Text */}
                  <text 
                    x="30" 
                    y="13" 
                    fill={isSelected ? '#996FD6' : '#94A3B8'} 
                    className="text-[8px] font-bold tracking-wider uppercase"
                  >
                    {node.type}
                  </text>

                  {/* Node Title */}
                  <text 
                    x="10" 
                    y="36" 
                    fill="#1E293B" 
                    className="text-[10px] font-bold"
                  >
                    {node.label.length > 22 ? `${node.label.substring(0, 20)}...` : node.label}
                  </text>

                  {/* Node Subtitle */}
                  <text 
                    x="10" 
                    y="49" 
                    fill="#64748B" 
                    className="text-[8px]"
                  >
                    {node.subtitle ? formatAddress(node.subtitle, 6) : ""}
                  </text>
                </g>
              );
            })}

          </g>
        </svg>

        {/* Interactive Info Panel Overlay */}
        {selectedNode && (
          <div className="absolute right-4 bottom-4 left-4 md:left-auto md:w-80 bg-white/95 backdrop-blur border border-slate-100 p-4 rounded-xl shadow-lg transition-all duration-200 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
              <span className="text-[9px] uppercase font-bold text-violet-500 tracking-wider">
                Audited entity: {selectedNode.type}
              </span>
              <button 
                onClick={() => setSelectedNode(null)} 
                className="text-[10px] text-slate-400 hover:text-slate-600 font-bold px-1.5 py-0.5 rounded hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <h4 className="font-bold text-slate-800 text-xs">
              {selectedNode.label}
            </h4>
            <p className="text-[10px] text-slate-500 font-mono break-all mt-1 bg-slate-50 p-2 rounded border border-slate-100/40">
              {selectedNode.value}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
