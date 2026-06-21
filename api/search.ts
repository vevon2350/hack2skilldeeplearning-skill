import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Check if search endpoint was hit
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

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
        "Provide thorough, high-quality, precise, and objectively written answers based on latest information. " +
        "Always use clean markdown formatting (bold headers, bullet points, structured lists, and markdown tables if relevant). " +
        "At the end of your response, add a very short summary sentence or insight.";

      if (focus === "academic") {
        targetSystemInstruction += " Adopt an authoritative, scientific, and peer-reviewed style. List logical sections or arguments. Prioritize formal references in your output text.";
      } else if (focus === "writing") {
        targetSystemInstruction += " Focus purely on tone, grammar editing, creative composition, and styling. Ignore web grounding constraints and deliver beautiful, flowy prose, copy, or code.";
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
        formattedAnswer = `> 🧠 **Thinking Process:**\n> \n> ${reasoning.split('\n').join('\n> ')}\n\n${text}`;
      }

      // Generate 3 contextual follow-up questions
      const suggestedFollowUps = [
        `What are more specific details on ${query}?`,
        `Are there more details on how this works?`,
        `Can you provide alternative examples?`
      ];

      return res.status(200).json({
        answer: formattedAnswer,
        sources: [],
        suggestedFollowUps,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured. Please add it to your secrets panel in Settings > Secrets.",
      });
    }

    // Initialize official @google/genai SDK
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Configure prompt instructions based on search focus lenses
    let systemInstruction = 
      "You are an expert research and discovery assistant like PointAI. " +
      "Provide thorough, high-quality, precise, and objectively written answers based on latest information. " +
      "Always use clean markdown formatting (bold headers, bullet points, structured lists, and markdown tables if relevant). " +
      "Avoid meta-references like 'Based on the search results'. Just formulate a beautiful response directly. " +
      "At the end of your response, add a very short summary sentence or insight.";

    if (focus === "academic") {
      systemInstruction += " Adopt an authoritative, scientific, and peer-reviewed style. List logical sections or arguments. Prioritize formal references in your output text.";
    } else if (focus === "writing") {
      systemInstruction += " Focus purely on tone, grammar editing, creative composition, and styling. Ignore web grounding constraints and deliver beautiful, flowy prose, copy, or code.";
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

    return res.status(200).json({
      answer: text,
      sources,
      suggestedFollowUps,
    });

  } catch (error: any) {
    console.error("Search API failed inside Vercel serverless worker:", error);
    let clientErrorMessage = "Internal GenAI service error";
    let statusCode = 500;

    const errStr = String(error?.stack || error?.message || error);
    const isQuota = errStr.includes("429") || errStr.toLowerCase().includes("quota") || errStr.toLowerCase().includes("rate limit");
    const isNvidiaUnauthorized = errStr.includes("401");

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

    return res.status(statusCode).json({ error: clientErrorMessage });
  }
}
