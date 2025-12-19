
import React from 'react';
import { SongPart } from '../types';

interface SongPartCardProps {
  part: SongPart;
  index: number;
  onUpdatePart: (updatedPart: SongPart) => void;
}

const SongPartCard: React.FC<SongPartCardProps> = ({ part, index, onUpdatePart }) => {
  const isChorus = part.type === 'Chorus';

  const handleLineChange = (lineIdx: number, newValue: string) => {
    const newLines = [...part.lines];
    newLines[lineIdx] = newValue;
    onUpdatePart({ ...part, lines: newLines });
  };

  return (
    <div 
      className={`p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${
        isChorus 
          ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-100' 
          : 'bg-white border-slate-100'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <select 
            value={part.type}
            onChange={(e) => onUpdatePart({ ...part, type: e.target.value as any })}
            className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${
              isChorus ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <option value="Verse">Verse</option>
            <option value="Chorus">Chorus</option>
            <option value="Bridge">Bridge</option>
            <option value="Outro">Outro</option>
          </select>
          <span className="text-slate-400 text-xs font-bold">
            #{Math.ceil((index + 1) / 2)}
          </span>
        </div>
        {isChorus && (
          <span className="text-amber-500 text-xs italic font-medium">
            <i className="fa-solid fa-repeat mr-1"></i> Repeatable Hook
          </span>
        )}
      </div>
      <div className="space-y-2">
        {part.lines.map((line, idx) => (
          <input
            key={idx}
            type="text"
            value={line}
            onChange={(e) => handleLineChange(idx, e.target.value)}
            placeholder="Type a line..."
            className={`w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-400 focus:ring-0 transition-all text-lg md:text-xl outline-none ${
              isChorus ? 'font-semibold text-amber-900 placeholder:text-amber-200' : 'text-slate-700 placeholder:text-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SongPartCard;
