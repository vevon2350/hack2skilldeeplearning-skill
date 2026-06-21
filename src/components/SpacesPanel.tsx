import { useState } from "react";
import { FolderPlus, BookOpen, CreditCard, Code, HelpCircle, Lock, Users, Sparkles, Check } from "lucide-react";
import { Space } from "../types";

interface SpacesPanelProps {
  spaces: Space[];
  selectedSpaceId: string | null;
  onSelectSpace: (spaceId: string | null) => void;
  onCreateSpace: (name: string, description: string, icon: string) => void;
}

export default function SpacesPanel({
  spaces,
  selectedSpaceId,
  onSelectSpace,
  onCreateSpace,
}: SpacesPanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [spaceIcon, setSpaceIcon] = useState("🔬");
  const [spaceDesc, setSpaceDesc] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (spaceName.trim()) {
      onCreateSpace(spaceName.trim(), spaceDesc.trim(), spaceIcon);
      setSpaceName("");
      setSpaceDesc("");
      setIsCreating(false);
    }
  };

  const iconsSet = ["🔬", "💰", "📁", "💻", "🎨", "🏥", "📚", "✈️", "🏋️"];

  return (
    <div className="max-w-[800px] mx-auto px-4 pt-12 pb-16 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-sans font-light text-primary tracking-tight">Spaces</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Build specialized domains, thematic contexts, or focus nodes with customized guidelines.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-black hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <FolderPlus className="w-4 h-4" />
          Create Space
        </button>
      </div>

      {/* Creation Overlay Form inside board */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white border border-outline-variant p-5 rounded-2xl mb-8 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4">Provision New Knowledge Space</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Space Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Advanced AI Study"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Select Aesthetic Icon</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {iconsSet.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setSpaceIcon(ic)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm border transition-all ${
                      spaceIcon === ic ? "border-black bg-slate-100 scale-110" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Description / Instruction guidelines</label>
              <textarea
                placeholder="Instruct the model on what perspective or papers to prefer inside this workspace folder folder."
                value={spaceDesc}
                onChange={(e) => setSpaceDesc(e.target.value)}
                rows={2}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-slate-300 outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-5 border-t border-slate-50 pt-4">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-600 font-semibold px-3 py-1.5 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-slate-900 text-white font-semibold text-xs rounded-lg px-4 py-2 hover:bg-black"
            >
              Assemble Space
            </button>
          </div>
        </form>
      )}

      {/* Grid List of Spaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Global default card */}
        <div
          onClick={() => onSelectSpace(null)}
          className={`cursor-pointer rounded-xl p-5 border transition-all relative flex flex-col justify-between h-44 ${
            selectedSpaceId === null
              ? "border-black bg-white shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
              : "border-outline-variant bg-surface-container-low hover:border-slate-300"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl bg-white p-2.5 rounded-lg shadow-xs">🌍</span>
              {selectedSpaceId === null && (
                <span className="bg-black text-white text-[9px] font-bold uppercase py-0.5 px-1.5 rounded flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Active Space
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-primary">Global Search Engine</h3>
            <p className="text-xs text-on-surface-variant pr-4 mt-1.5 line-clamp-2">
              The default search mode with no filter constraints. Standard search powered by Google Grounding.
            </p>
          </div>
          
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            <span>Public Access</span>
            <Users className="w-3.5 h-3.5 opacity-60" />
          </div>
        </div>

        {spaces.map((sp) => (
          <div
            key={sp.id}
            onClick={() => onSelectSpace(sp.id)}
            className={`cursor-pointer rounded-xl p-5 border transition-all relative flex flex-col justify-between h-44 ${
              selectedSpaceId === sp.id
                ? "border-black bg-white shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
                : "border-outline-variant bg-surface-container-low hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl bg-white p-2.5 rounded-lg shadow-xs">{sp.icon}</span>
                {selectedSpaceId === sp.id ? (
                  <span className="bg-black text-white text-[9px] font-bold uppercase py-0.5 px-1.5 rounded flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> Active Space
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-600 text-[9px] font-bold uppercase py-0.5 px-1.5 rounded flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-primary">{sp.name}</h3>
              <p className="text-xs text-on-surface-variant pr-4 mt-1.5 line-clamp-2">
                {sp.description || "No specific configuration supplied. Operating with smart directory heuristics."}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <span>Secure Folder context</span>
              <Sparkles className="w-3.5 h-3.5 opacity-60 text-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
