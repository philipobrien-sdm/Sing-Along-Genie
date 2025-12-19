import React, { useState, useRef, useMemo } from 'react';
import { SONG_PRESETS } from './constants';
import { GeneratedSong, GenerationState, SongPreset, SongPart } from './types';
import { generateSong } from './services/geminiService';
import SongPartCard from './components/SongPartCard';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SONG_PRESETS[3].id);
  const [state, setState] = useState<GenerationState>(GenerationState.IDLE);
  const [song, setSong] = useState<GeneratedSong | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refinementFeedback, setRefinementFeedback] = useState('');
  const [showContextPane, setShowContextPane] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPreset = useMemo(() => 
    SONG_PRESETS.find(p => p.id === selectedPresetId) || SONG_PRESETS[0]
  , [selectedPresetId]);

  // Explicitly type groupedPresets to prevent 'unknown' issues in Object.entries mapping.
  const groupedPresets = useMemo<Record<string, SongPreset[]>>(() => {
    const groups: Record<string, SongPreset[]> = {};
    SONG_PRESETS.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, []);

  const handleGenerate = async (feedback?: string) => {
    if (!prompt.trim() && !song) return;
    
    setState(GenerationState.LOADING);
    setError(null);
    
    try {
      const result = await generateSong(
        prompt, 
        selectedPreset, 
        song || undefined, 
        feedback, 
        additionalContext
      );
      setSong(result);
      setState(GenerationState.SUCCESS);
      setRefinementFeedback('');
      
      if (!feedback) {
        setTimeout(() => {
          document.getElementById('song-result')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState(GenerationState.ERROR);
    }
  };

  const handleReset = () => {
    setState(GenerationState.IDLE);
    setSong(null);
    setPrompt('');
    setAdditionalContext('');
    setError(null);
    setRefinementFeedback('');
    setShowContextPane(false);
  };

  // Use functional updates to prevent narrowing issues in state transitions.
  const updateSongPart = (index: number, updatedPart: SongPart) => {
    setSong(prev => {
      if (!prev) return null;
      const newParts = [...prev.parts];
      newParts[index] = updatedPart;
      return { ...prev, parts: newParts };
    });
  };

  const addPart = () => {
    setSong(prev => {
      if (!prev) return null;
      return {
        ...prev,
        parts: [...prev.parts, { type: 'Verse', lines: ['', '', '', ''] }]
      };
    });
  };

  const handleExportJson = () => {
    if (!song) return;
    const blob = new Blob([JSON.stringify(song, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.title.replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportHtml = () => {
    // Narrow song for safe access in template literals.
    const currentSong = song;
    if (!currentSong) return;
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${currentSong.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600&family=Outfit:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; line-height: 1.6; color: #334155; max-width: 800px; margin: 40px auto; padding: 20px; background: #f8fafc; }
        .song-container { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        h1 { font-family: 'Fredoka', sans-serif; font-size: 48px; text-align: center; color: #0f172a; margin-bottom: 10px; }
        .meta { text-align: center; margin-bottom: 40px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px; }
        .meta span { margin: 0 10px; padding: 4px 12px; background: #f1f5f9; border-radius: 9999px; }
        .part { margin-bottom: 30px; padding: 20px; border-radius: 16px; }
        .part-type { font-weight: 800; text-transform: uppercase; font-size: 12px; color: #94a3b8; margin-bottom: 12px; display: block; }
        .part-Chorus { background: #fffbeb; border: 1px solid #fde68a; }
        .part-Chorus .part-type { color: #d97706; }
        .line { font-size: 20px; margin-bottom: 8px; color: #1e293b; }
        .part-Chorus .line { font-weight: 600; color: #92400e; }
        @media print { body { background: white; margin: 0; padding: 0; } .song-container { box-shadow: none; padding: 0; } }
    </style>
</head>
<body>
    <div class="song-container">
        <h1>${currentSong.title}</h1>
        <div class="meta">
            <span>Mood: ${currentSong.mood}</span>
            <span>Tempo: ${currentSong.tempo}</span>
        </div>
        
        ${currentSong.parts.map(part => `
            <div class="part part-${part.type}">
                <span class="part-type">${part.type}</span>
                ${part.lines.map(line => `<div class="line">${line}</div>`).join('')}
            </div>
        `).join('')}
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSong.title.replace(/\s+/g, '_')}_lyrics.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as GeneratedSong;
        if (imported.title && imported.parts) {
          setSong(imported);
          setState(GenerationState.SUCCESS);
          setPrompt('');
        } else {
          throw new Error("Missing title or parts");
        }
      } catch (err) {
        alert("Failed to load song: " + (err instanceof Error ? err.message : "Invalid JSON format"));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        accept=".json" 
        className="hidden" 
      />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={handleReset}>
            <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-microphone-lines text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block font-heading">Sing-Along Genie</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm font-semibold flex items-center gap-2"
              title="Import JSON"
            >
              <i className="fa-solid fa-file-import"></i>
              <span className="hidden md:inline">Load</span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button 
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-sm font-medium"
            >
              New
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        {/* State: IDLE - Initial Form */}
        {(state === GenerationState.IDLE || state === GenerationState.ERROR) && !song && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-heading leading-tight">
                Turn your world into a <span className="text-indigo-600">Sing-Along!</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Write a story, describe a mood, or paste a messy poem. We'll turn it into a catchy, easy-to-sing hit.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 mb-10 border border-slate-100 overflow-hidden">
              <div className="space-y-8">
                {/* Story Prompt */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                    1. What's the story?
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what happens, or paste a rough idea. Genie will do the rhyming and rhythm!"
                    className="w-full h-40 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none text-lg text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                {/* Additional Context Toggle */}
                <div>
                  <button 
                    onClick={() => setShowContextPane(!showContextPane)}
                    className="text-indigo-600 text-sm font-bold flex items-center gap-2 hover:underline"
                  >
                    <i className={`fa-solid ${showContextPane ? 'fa-chevron-up' : 'fa-plus'}`}></i>
                    {showContextPane ? 'Hide Details' : 'Add Background Context & In-Jokes (Optional)'}
                  </button>
                  
                  {showContextPane && (
                    <div className="mt-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                        Details & Background
                      </label>
                      <textarea
                        value={additionalContext}
                        onChange={(e) => setAdditionalContext(e.target.value)}
                        placeholder="e.g. Include the name 'Grandma Sally', mention the burnt turkey incident of 1998, keep the humor silly..."
                        className="w-full h-24 p-4 bg-white border border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all outline-none text-slate-800 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Genre Selection Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                    2. Choose the Style
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPresetId}
                      onChange={(e) => setSelectedPresetId(e.target.value)}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none text-lg text-slate-800 appearance-none cursor-pointer pr-12 font-semibold"
                    >
                      {/* Fix: Explicitly cast Object.entries result to resolve 'unknown' type inference on the map function */}
                      {(Object.entries(groupedPresets) as [string, SongPreset[]][]).map(([category, presets]) => (
                        <optgroup key={category} label={category}>
                          {presets.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>
                  </div>
                  
                  {/* Selected Preset Info Display */}
                  <div className="mt-4 flex items-start gap-4 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                      <i className={`fa-solid ${selectedPreset.icon} text-xl`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{selectedPreset.name}</h4>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{selectedPreset.description}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-white px-2 py-0.5 rounded border border-indigo-50">Rhythm: {selectedPreset.rhythmStyle.split(',')[0]}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-white px-2 py-0.5 rounded border border-indigo-50">Rhyme: {selectedPreset.rhymeScheme}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={() => handleGenerate()}
                    disabled={state === GenerationState.LOADING || !prompt.trim()}
                    className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] ${
                      !prompt.trim()
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 shadow-indigo-100'
                    }`}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    Write My Song
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Global Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {state === GenerationState.LOADING && (
          <div className="text-center py-20 animate-pulse">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full text-indigo-600">
              <i className="fa-solid fa-music text-4xl animate-bounce-subtle"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-heading">The Genie is composing...</h3>
            <p className="text-slate-500 italic max-w-sm mx-auto">
              "Polishing rhymes and setting the rhythm for your hit..."
            </p>
          </div>
        )}

        {/* Success State */}
        {song && state !== GenerationState.LOADING && (
          <div id="song-result" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Song Metadata Editor */}
            <div className="text-center mb-12">
              <input 
                type="text"
                value={song.title}
                onChange={(e) => setSong(prev => prev ? {...prev, title: e.target.value} : null)}
                className="w-full text-4xl md:text-6xl font-black text-slate-900 mb-6 font-heading leading-tight tracking-tight text-center bg-transparent border-none focus:ring-0 outline-none hover:bg-slate-100 transition-colors rounded-xl p-2"
                placeholder="Song Title"
              />
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 group">
                  <i className="fa-solid fa-face-smile"></i>
                  <input 
                    className="bg-transparent border-none p-0 focus:ring-0 w-24 text-center"
                    value={song.mood} 
                    onChange={(e) => setSong(prev => prev ? {...prev, mood: e.target.value} : null)}
                  />
                </div>
                <div className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                  <i className="fa-solid fa-gauge-high"></i>
                  <input 
                    className="bg-transparent border-none p-0 focus:ring-0 w-28 text-center"
                    value={song.tempo} 
                    onChange={(e) => setSong(prev => prev ? {...prev, tempo: e.target.value} : null)}
                  />
                </div>
                <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                  <i className={`fa-solid ${selectedPreset.icon}`}></i> {selectedPreset.name}
                </span>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              {song.parts.map((part, idx) => (
                <div key={idx} className="song-part-card">
                  <SongPartCard 
                    part={part} 
                    index={idx} 
                    onUpdatePart={(p) => updateSongPart(idx, p)} 
                  />
                </div>
              ))}
              
              <button 
                onClick={addPart}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> Add a New Verse
              </button>
            </div>

            {/* AI Refinement Box */}
            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 md:p-8 mb-12 shadow-xl shadow-indigo-50/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Polish with AI Genie</h3>
                  <p className="text-sm text-slate-500">Fix my edits or rewrite sections with AI!</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <textarea
                  value={refinementFeedback}
                  onChange={(e) => setRefinementFeedback(e.target.value)}
                  placeholder="Tell the Genie: 'Make this verse funnier', 'Improve the chorus', etc..."
                  className="w-full h-28 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-slate-800"
                />
                <button
                  onClick={() => handleGenerate(refinementFeedback)}
                  disabled={state === GenerationState.LOADING}
                  className={`py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-lg ${
                    state === GenerationState.LOADING
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100'
                  }`}
                >
                  <i className="fa-solid fa-sparkles"></i>
                  Apply Genie Refinement
                </button>
              </div>
            </div>

            {/* Singer Tips */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 mb-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-slate-800 opacity-50">
                <i className="fa-solid fa-lightbulb text-9xl -mr-12 -mt-12"></i>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-bullhorn text-amber-400"></i>
                  Performance Guide
                </h3>
                <textarea 
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-300 text-lg leading-relaxed h-auto min-h-[6rem] resize-none"
                  value={song.tips}
                  onChange={(e) => setSong(prev => prev ? {...prev, tips: e.target.value} : null)}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 border-t border-slate-200 pt-10">
              <button 
                onClick={handleExportJson}
                className="px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <i className="fa-solid fa-file-code"></i>
                Save Data (JSON)
              </button>
              <button 
                onClick={handleExportHtml}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                <i className="fa-solid fa-file-export"></i>
                Export Lyrics (HTML)
              </button>
              <button 
                onClick={handleReset}
                className="px-10 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-rotate"></i>
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Background Decor */}
      <div className="fixed -bottom-20 -left-20 text-slate-100 pointer-events-none -z-10 hidden xl:block select-none opacity-50">
         <i className="fa-solid fa-music text-[20rem] animate-bounce-subtle"></i>
      </div>
    </div>
  );
};

export default App;