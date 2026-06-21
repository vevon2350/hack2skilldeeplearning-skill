import { useState } from "react";
import { FileCode, FileText, Code2, Download, Copy, Check, Search, Calendar, FolderHeart } from "lucide-react";

interface Artifact {
  id: string;
  name: string;
  type: "code" | "document" | "data";
  language?: string;
  content: string;
  timestamp: string;
  size: string;
}

export default function ArtifactsPanel() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "code" | "document">("all");
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>("art-1");

  const artifacts: Artifact[] = [
    {
      id: "art-1",
      name: "express_server_blueprint.ts",
      type: "code",
      language: "typescript",
      size: "1.2 KB",
      timestamp: "June 21, 2026",
      content: `import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/summarize', async (req, res) => {
  const { docContent } = req.body;
  const result = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: \`Please provide a strict, bulleted summary of this topic: \${docContent}\`
  });
  res.json({ result: result.text });
});

app.listen(3000, () => {
  console.log('Server online.');
});`
    },
    {
      id: "art-2",
      name: "hiit_HIIT_training_study.md",
      type: "document",
      size: "2.4 KB",
      timestamp: "June 21, 2026",
      content: `# High-Intensity Interval Training (HIIT) Physiological Impact study
- **Research Lead**: PointAI Health Synthesis
- **Topic**: Cardiovascular HIIT benefits inside young adults

## Core Findings Summary:
1. **VO2 Max Acceleration**: Subjects saw an average of 14% improvement in peak volume oxygen uptake within 6 weeks of HIIT.
2. **EPOC Effect (Excess Post-exercise Oxygen Consumption)**: Elevated cellular respiration remained elevated up to 24 hours post-workout.
3. **Mitochondrial Biogenesis**: High muscle recruitment triggers high levels of mitochondrial transcription factors, improving local glucose metabolism.`
    },
    {
      id: "art-3",
      name: "stock_ NASDAQ_performers.json",
      type: "code",
      language: "json",
      size: "0.8 KB",
      timestamp: "June 21, 2026",
      content: `{
  "analyticsType": "NASDAQ tech sector review",
  "checkedTime": "2026-06-21T01:34:00Z",
  "stockIndexSummary": {
    "NDX": {
      "closingValue": 18450.2,
      "growthPercent": "+1.42%",
      "highestSecurities": [
        { "ticker": "NVDA", "gain": "+3.4%" },
        { "ticker": "MSFT", "gain": "+1.8%" },
        { "ticker": "GOOGL", "gain": "+2.1%" }
      ]
    }
  }
}`
    }
  ];

  const filteredArtifacts = filterType === "all" 
    ? artifacts 
    : artifacts.filter((a) => a.type === filterType);

  const activeArtifact = artifacts.find((a) => a.id === selectedArtifactId) || artifacts[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 pt-12 pb-16 text-left animate-fade-in">
      <div className="border-b border-slate-105 pb-5 mb-8">
        <h1 className="text-3xl font-sans font-light text-primary tracking-tight">Artifacts Hub</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Aggregated repositories of all code structures, scientific lists, and documents compiled during search workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Directory navigation */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Quick Filters */}
          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200/50">
            {(["all", "code", "document"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 text-[11px] font-bold uppercase tracking-wider py-1.5 rounded-md transition-all cursor-pointer ${
                  filterType === type 
                    ? "bg-white text-primary shadow-xs" 
                    : "text-slate-500 hover:text-primary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Directory node cards list */}
          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto custom-scrollbar">
            {filteredArtifacts.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArtifactId(art.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedArtifactId === art.id
                    ? "border-black bg-white shadow-xs"
                    : "border-slate-200/55 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {art.type === "code" ? (
                    <Code2 className="w-4 h-4 text-slate-700 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-slate-700 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-primary truncate max-w-[130px] font-mono">
                    {art.name}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {art.timestamp}
                  </span>
                  <span>{art.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: High-fidelity code editor / viewer */}
        <div className="md:col-span-2 border border-outline-variant bg-[#1c1b1b] rounded-2xl flex flex-col justify-between h-[420px] text-white font-mono text-[11px] overflow-hidden shadow-md">
          {/* Header toolbar */}
          <div className="bg-[#242323] p-3.5 px-4 flex items-center justify-between border-b border-slate-850">
            <div className="flex items-center gap-2 text-slate-300">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="truncate">{activeArtifact.name}</span>
            </div>
            
            <button
              onClick={() => handleCopy(activeArtifact.content, activeArtifact.id)}
              className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[10px] transition-all cursor-pointer border border-slate-700/60"
            >
              {copiedId === activeArtifact.id ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 shrink-0" />
                  <span>Copy Content</span>
                </>
              )}
            </button>
          </div>

          {/* Full content */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar text-left text-slate-100">
            <pre className="text-[11px] whitespace-pre select-all pr-1">
              {activeArtifact.content}
            </pre>
          </div>

          {/* Footer stats */}
          <div className="bg-[#242323] p-2 px-4 text-left text-[9px] text-slate-400 border-t border-slate-850 flex items-center justify-between">
            <span>Size: {activeArtifact.size}</span>
            <span className="font-bold flex items-center gap-1">
              <FolderHeart className="w-3 h-3" /> compiled sandbox artifact
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
