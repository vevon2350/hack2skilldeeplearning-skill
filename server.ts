import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Initialize official @google/genai SDK
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // REST API Route for PointAI AI Search queries with real Google Search grounding
  app.post("/api/search", async (req, res) => {
    try {
      const { query, history = [], focus = "all", selectedModel = "moonshotai/kimi-k2.6" } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const isGeminiModel = selectedModel === "Gemini 3.5 Flash" || selectedModel === "Gemini 3.1 Pro";

      if (!isGeminiModel || selectedModel === "openai/gpt-oss-120b" || selectedModel === "openai/gpt-oss-20b" || selectedModel === "deepseek-ai/deepseek-v4-pro" || selectedModel === "qwen/qwen3-next-80b-a3b-instruct" || selectedModel === "moonshotai/kimi-k2.6") {
        let nvidiaKey = process.env.NVIDIA_API_KEY;
        const fallbackKey = "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";
        
        const isValidNvidiaKey = nvidiaKey && nvidiaKey.trim().startsWith("nvapi-");
        
        if (!isValidNvidiaKey) {
          nvidiaKey = fallbackKey;
        }

        // Configure system instruction based on search focus lenses
        let targetSystemInstruction = 
          "You are an expert research and discovery assistant like PointAI. " +
          "You MUST provide 100% accurate, complete, highly reliable answers written with a professional, engaging human touch. " +
          "CRITICAL RULES:\n" +
          "1. NO AI CLICHÉS OR FILLER TEXT: Completely avoid robotic introductions or transitions like 'Certainly! I can help...', 'Here is the summary...', or 'Based on the context retrieved...'. Start directly with the answer.\n" +
          "2. PRISTINE LAYOUT: Use beautiful, elegant, and standard markdown (bold titles, clean bullet points, bullet list spacing, or comparative markdown tables where helpful). Keep paragraphs short and highly readable.\n" +
          "3. NO FAULTY OR LOOSE TEXT: Make sure every sentence is highly objective, factual, concise, and carries a high-quality human editorial touch.\n" +
          "4. For long lists or facts, structure them beautifully. At the end of your response, add a very short, elegant summary sentence or key insight.";

        if (focus === "academic") {
          targetSystemInstruction += " Adopt an authoritative, scientific, and peer-reviewed style. List logical, well-structured sections. Prioritize formal academic citations and references in your output text.";
        } else if (focus === "writing") {
          targetSystemInstruction += " Focus purely on pristine tone, grammar editing, descriptive composition, and premium styling. Ignore web grounding constraints and deliver beautiful, engaging copy, prose, or code.";
        }

        // Map chat history for OpenAI-compatible client
        const messages = [
          { role: "system", content: targetSystemInstruction },
          ...history.map((msg: any) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content
          })),
          { role: "user", content: query }
        ];

        const isDeepSeek = selectedModel === "deepseek-ai/deepseek-v4-pro";
        const isQwen = selectedModel === "qwen/qwen3-next-80b-a3b-instruct";
        const isKimi = selectedModel === "moonshotai/kimi-k2.6";
        const isGemma = selectedModel === "google/gemma-4-31b-it";
        const requestPayload = {
          model: selectedModel,
          messages,
          temperature: isQwen ? 0.6 : 1.00,
          top_p: isQwen ? 0.7 : (isDeepSeek ? 0.95 : (isGemma ? 0.95 : 1)),
          max_tokens: isDeepSeek || isKimi || isGemma ? 16384 : 4096,
          ...(isDeepSeek ? { chat_template_kwargs: { thinking: false } } : {}),
          ...(isGemma ? { chat_template_kwargs: { enable_thinking: true } } : {}),
          stream: false
        };

        // Call NVIDIA completions API
        console.log(`Calling NVIDIA open-source reasoning model API: ${selectedModel}...`);
        let response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${nvidiaKey}`
          },
          body: JSON.stringify(requestPayload)
        });

        // Fallback retry mechanism: if unauthorized (401) with configured key, retry with the verified fallback key
        if (response.status === 401 && nvidiaKey !== fallbackKey) {
          console.log("NVIDIA credential rotation: switching to active fallback credential...");
          response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${fallbackKey}`
            },
            body: JSON.stringify(requestPayload)
          });
        }

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`NVIDIA API returned error: ${response.status} - ${errText}`);
        }

        const json: any = await response.json();
        const choice = json.choices?.[0];
        const text = choice?.message?.content || "";
        const reasoning = choice?.message?.reasoning_content || choice?.message?.reasoning || "";

        let formattedAnswer = text;
        if (reasoning) {
          formattedAnswer = `<details class="gemma-thinking-container group border border-slate-200/50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl p-3.5 mb-5 cursor-pointer select-none transition-all hover:bg-slate-50 dark:hover:bg-slate-900/20 font-sans text-xs">\n<summary class="flex items-center justify-between text-slate-500 font-semibold text-xs list-none cursor-pointer">\n  <span class="flex items-center gap-2">\n    <span>🧠 Deep Thinking & Analysis Process</span>\n  </span>\n  <span class="text-[10px] text-slate-400">▼</span>\n</summary>\n<div class="mt-3 py-3 border-t border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 leading-relaxed max-h-[220px] overflow-y-auto custom-scrollbar font-mono text-[11px] whitespace-pre-wrap">\n${reasoning.trim()}\n</div>\n</details>\n\n${text}`;
        }

        // Generate 3 contextual follow-up questions
        const suggestedFollowUps = [
          `What are more specific details on ${query}?`,
          `Are there more details on how this works?`,
          `Can you provide alternative examples?`
        ];

        return res.json({
          answer: formattedAnswer,
          sources: [], // No standard web search grounding sources in NVIDIA's direct completions
          suggestedFollowUps,
        });
      }

      const hasApiKey = !!process.env.GEMINI_API_KEY;
      if (!hasApiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured. Please add it to your secrets panel in Settings > Secrets.",
        });
      }

      // Configure prompt instructions based on search focus lenses
      let systemInstruction = 
        "You are an expert research and discovery assistant like PointAI. " +
        "You MUST provide 100% accurate, complete, highly reliable answers written with a professional, engaging human touch. " +
        "CRITICAL RULES:\n" +
        "1. NO AI CLICHÉS OR FILLER TEXT: Completely avoid robotic introductions or transitions like 'Certainly! I can help...', 'Here is the summary...', or 'Based on the context retrieved...'. Start directly with the answer.\n" +
        "2. PRISTINE LAYOUT: Use beautiful, elegant, and standard markdown (bold titles, clean bullet points, bullet list spacing, or comparative markdown tables where helpful). Keep paragraphs short and highly readable.\n" +
        "3. NO FAULTY OR LOOSE TEXT: Make sure every sentence is highly objective, factual, concise, and carries a high-quality human editorial touch.\n" +
        "4. For long lists or facts, structure them beautifully. At the end of your response, add a very short, elegant summary sentence or key insight.";

      if (focus === "academic") {
        systemInstruction += " Adopt an authoritative, scientific, and peer-reviewed style. List logical, well-structured sections. Prioritize formal academic citations and references in your output text.";
      } else if (focus === "writing") {
        systemInstruction += " Focus purely on pristine tone, grammar editing, descriptive composition, and premium styling. Ignore web grounding constraints and deliver beautiful, engaging copy, prose, or code.";
      }

      // Build context including chat history for conversational follow-ups
      const contents: any[] = [];
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      }
      contents.push({
        role: "user",
        parts: [{ text: query }]
      });

      // Configure tools: activate Google Search grounding unless search lens is set to 'writing'
      const tools: any[] = [];
      if (focus !== "writing") {
        tools.push({ googleSearch: {} });
      }

      // Query Gemini
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          tools: tools.length > 0 ? tools : undefined,
        },
      });

      const text = response.text || "";

      // Extract real grounding sources with titles and URLs
      const sources: { title: string; url: string }[] = [];
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata && groundingMetadata.groundingChunks) {
        for (const chunk of groundingMetadata.groundingChunks) {
          if (chunk.web && chunk.web.uri) {
            sources.push({
              title: chunk.web.title || chunk.web.uri,
              url: chunk.web.uri,
            });
          }
        }
      }

      // Generate 3 contextual follow-up search prompts
      let suggestedFollowUps: string[] = [];
      try {
        const followUpResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Given the user question: "${query}" and response text: "${text.substring(0, 200)}", write exactly 3 brief, engaging follow-up search questions. Return them ONLY as 3 lines with nothing else, no numbers, or symbols.`,
        });
        const lines = followUpResponse.text || "";
        suggestedFollowUps = lines
          .split("\n")
          .map(line => line.replace(/^[\s-*•\d.]+/g, "").trim())
          .filter(line => line.length > 6)
          .slice(0, 3);
      } catch (e) {
        console.error("Failed to generate follow-up questions", e);
      }

      if (suggestedFollowUps.length === 0) {
        suggestedFollowUps = [
          `What are more specific details on ${query}?`,
          `Are there alternative views on this topic?`,
          `How did this develop over time?`
        ];
      }

      res.json({
        answer: text,
        sources: sources.slice(0, 8), // Keep a clean list of top sources
        suggestedFollowUps,
      });

    } catch (error: any) {
      console.error("Gemini search integration failed:", error);

      let clientErrorMessage = "Internal GenAI service error";
      let statusCode = 500;

      // Detect Quota Exceeded / Rate Limit errors
      const errStr = typeof error === "string" ? error : (error.message || error.stack || JSON.stringify(error) || "");
      const isQuota = 
        error?.status === 429 || 
        error?.status === "RESOURCE_EXHAUSTED" || 
        error?.code === 429 || 
        error?.statusCode === 429 ||
        errStr.toLowerCase().includes("429") ||
        errStr.toLowerCase().includes("quota") ||
        errStr.toLowerCase().includes("resource_exhausted") ||
        errStr.toLowerCase().includes("rate limit") ||
        errStr.toLowerCase().includes("exceeded your current quota");

      const isNvidiaUnauthorized = 
        errStr.toLowerCase().includes("nvidia") && 
        (errStr.toLowerCase().includes("401") || errStr.toLowerCase().includes("unauthorized") || errStr.toLowerCase().includes("authentication failed"));

      if (isNvidiaUnauthorized) {
        statusCode = 401;
        clientErrorMessage = "NVIDIA API Key Authentication Failed (401).\n\nYour NVIDIA API key appears to be invalid or unauthorized. Please verify your NVIDIA_API_KEY value under **Settings > Secrets** in the AI Studio UI.\n\nIn the meantime, you can switch back to the default 'Moonshot Kimi K2.6' model from the home screen dropdown to continue chatting immediately without an external API key.";
      } else if (isQuota) {
        statusCode = 429;
        clientErrorMessage = "You have reached the free-tier rate limits (Quota Exceeded).\n\n**Please try again in 1-2 minutes.** If you are developing this application, please review your API parameters or configure your billing options.";
      } else if (errStr.toLowerCase().includes("nvidia")) {
        clientErrorMessage = `NVIDIA Model Integration Error:\n\n${error?.message || "Please check your NVIDIA_API_KEY configuration or switch back to the default Moonshot Kimi model."}`;
      } else {
        clientErrorMessage = error?.message || "Internal GenAI service error";
      }

      res.status(statusCode).json({ error: clientErrorMessage });
    }
  });

  // Mount Vite development middlewares or serve build outputs
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server connected.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving build files in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PointAI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server startup crash:", err);
});
