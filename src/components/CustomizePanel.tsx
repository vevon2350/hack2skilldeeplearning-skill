import { useState } from "react";
import { User, Shield, Info, Sliders, RefreshCw, Trash2, Check, Sparkles } from "lucide-react";
import { UserProfile } from "../types";

interface CustomizePanelProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClearAllThreads: () => void;
}

export default function CustomizePanel({
  userProfile,
  onUpdateProfile,
  onClearAllThreads,
}: CustomizePanelProps) {
  const [profile, setProfile] = useState<UserProfile>({ ...userProfile });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 pt-12 pb-16 text-left animate-fade-in">
      <div className="border-b border-slate-100 pb-5 mb-8">
        <h1 className="text-3xl font-sans font-light text-primary tracking-tight">Customize</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Tune AI response preferences, save instruction parameters, and clear stored indexes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-6">
          {/* User profile segment */}
          <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-xs">
            <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-slate-800" />
              AI profile constraints
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Your Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Guest Research Partner"
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Self Profile Context (How to address you)</label>
                <textarea
                  value={profile.aiProfile}
                  onChange={(e) => setProfile({ ...profile, aiProfile: e.target.value })}
                  placeholder="e.g. A computer science researcher. Tailor explanations with technical details, and prefer solid research citations."
                  rows={3}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-slate-300 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Model configurations mapping */}
          <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-xs">
            <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-slate-800" />
              Answer Style Preference
            </h3>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, searchPreference: "detailed" })}
                className={`flex-1 border p-4 rounded-xl text-left transition-all ${
                  profile.searchPreference === "detailed"
                    ? "border-black bg-slate-50"
                    : "border-slate-200 hover:bg-slate-50/50"
                }`}
              >
                <span className="text-xs font-bold text-primary block">Comprehensive</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">
                  Detailed overviews, multiple sections, and extensive source coverage.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, searchPreference: "concise" })}
                className={`flex-1 border p-4 rounded-xl text-left transition-all ${
                  profile.searchPreference === "concise"
                    ? "border-black bg-slate-50"
                    : "border-slate-200 hover:bg-slate-50/50"
                }`}
              >
                <span className="text-xs font-bold text-primary block">Concise</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">
                  Direct answers, quick bullet points, focused summaries. Minimum latency.
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-600" /> Stored securely in client storage
            </span>
            
            <button
              type="submit"
              className="bg-black hover:bg-slate-800 text-white rounded-lg px-6 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Successfully Saved
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </form>

        {/* Side Controls panel (Flush database tools) */}
        <div className="flex flex-col gap-6">
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-red-950 mb-2 flex items-center gap-2">
              <Trash2 className="w-4.5 h-4.5 text-red-700" />
              Destructive Operations
            </h3>
            <p className="text-xs text-red-800 leading-relaxed opacity-90 mb-4">
              Instantly delete your entire thread research history, reset spaces, and purge memory. This is irreversible.
            </p>

            <button
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to delete all saved searches? This will permanently wipe your sidebar."
                );
                if (confirmed) {
                  onClearAllThreads();
                }
              }}
              className="w-full bg-red-650 hover:bg-red-700 text-white text-xs font-semibold rounded-lg py-2.5 transition-all text-center flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Wipe Research History
            </button>
          </div>

          <div className="bg-slate-100 border border-slate-200/50 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-800 uppercase mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-700" /> Grounding Mechanics
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed opacity-95">
              Your queries are sent directly through our Gemini custom API engine, combined with a Google Search tool connection. Real-time index databases are crawled on-demand, generating summaries which are then footnoted and formatted for readability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
