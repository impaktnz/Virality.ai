
import { GoogleGenAI, Type } from "@google/genai";
import { 
  ContentAnalysis, 
  ViralResults, 
  ToneType, 
  ScriptType, 
  ContentLength, 
  ScriptResult, 
  TikTokSEO, 
  ThumbnailStyle, 
  ThumbnailVariant, 
  TikTokIdeasResult 
} from "../types";

export const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTikTokKeywords = async (files: { base64: string, mimeType: string }[], topic: string): Promise<TikTokSEO> => {
  const ai = getAIClient();
  const model = 'gemini-3-flash-preview';

  const imageParts = files.map(f => ({
    inlineData: { data: f.base64, mimeType: f.mimeType }
  }));

  const prompt = `Generate exactly 50 unique, search-optimized keywords and phrases for TikTok SEO for the topic: "${topic}".
  
  STRICT RULES:
  - DO NOT include any hashtags (#).
  - All keywords must be highly relevant to the topic.
  - Use a mix of single words, short phrases, and long-tail search queries.
  - Focus on terms that drive discoverability in 2025 algorithms.
  
  Output as a JSON object with a single 'keywords' array of 50 strings.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        ...imageParts,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["keywords"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateTikTokIdeas = async (files: { base64: string, mimeType: string }[], topic: string): Promise<TikTokIdeasResult> => {
  const ai = getAIClient();
  const model = 'gemini-3-flash-preview';

  const imageParts = files.map(f => ({
    inlineData: { data: f.base64, mimeType: f.mimeType }
  }));

  const prompt = `Generate 3 unique, viral TikTok post concepts based on this content. 
  Topic: "${topic}"
  For each idea, define:
  1. 'mode': A catchy strategy name (e.g., 'The Truth Hook', 'Day in the Life').
  2. 'hook': A scroll-stopping first line.
  3. 'story': A brief delivery plan.
  4. 'cta': High-conversion call to action.
  5. 'hashtags': 3-5 laser-targeted tags.
  
  Return ONLY JSON matching the requested schema.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        ...imageParts,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mode: { type: Type.STRING },
                hook: { type: Type.STRING },
                story: { type: Type.STRING },
                cta: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["mode", "hook", "story", "cta", "hashtags"]
            }
          }
        },
        required: ["ideas"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateScriptOnly = async (
  formula: ScriptType,
  length: ContentLength,
  tone: ToneType,
  customInput?: string,
  customDurationSeconds?: number,
  useBranding: boolean = false
): Promise<ScriptResult> => {
  const ai = getAIClient();
  const model = 'gemini-3-flash-preview';
  
  const durationText = customDurationSeconds 
    ? `${customDurationSeconds} seconds` 
    : (length === 'auto' ? '30 seconds' : length);

  const prompt = `Generate a PURE TEXT script for a video.
  
  STRICT RULES:
  - DO NOT include any app names, prefixes, signatures, or branding.
  - Output ONLY the clean script text.
  - ALGORITHM FORMULA: ${formula}
  - TARGET DURATION: ${durationText}
  - TONE: ${tone}
  - CONTEXT/TOPIC: ${customInput || 'Viral trending topic'}

  STRICT REQUIREMENTS:
  1. Provide the script as PURE TEXT only in the 'content' field.
  2. Provide 'shotIdeas' as an empty array [].
  3. Provide a 'viralScore' as 0 and 'viralJustification' as an empty string (legacy support).
  
  Return ONLY JSON matching the requested schema.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          formulaUsed: { type: Type.STRING },
          estimatedReadingTime: { type: Type.STRING },
          shotIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
          viralScore: { type: Type.INTEGER },
          viralJustification: { type: Type.STRING }
        },
        required: ["content", "formulaUsed", "estimatedReadingTime", "shotIdeas", "viralScore", "viralJustification"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeContent = async (files: { base64: string, mimeType: string }[], textContext?: string): Promise<ContentAnalysis> => {
  const ai = getAIClient();
  const model = 'gemini-3-flash-preview';
  
  const imageParts = files.map(f => ({
    inlineData: { data: f.base64, mimeType: f.mimeType }
  }));

  const prompt = `Analyze this visual content for a social media strategist. 
  Detect topic, tone, and key points.
  Context: ${textContext || 'No additional text provided.'}`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        ...imageParts,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          contentType: { type: Type.STRING },
          tone: { type: Type.STRING },
          topic: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["contentType", "tone", "topic", "keyPoints"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateViralVariants = async (
  analysis: ContentAnalysis | null, 
  selectedTone: ToneType, 
  customTone?: string,
  customRequest?: string,
  postContext?: string,
  useBranding: boolean = false
): Promise<ViralResults> => {
  const ai = getAIClient();
  const model = 'gemini-3-flash-preview';
  
  const targetTone = selectedTone === 'custom' ? (customTone || 'viral') : selectedTone;

  const prompt = `You are a viral social media strategist. Generate clean, high-performance content for multiple platforms.
  Context: ${postContext || (analysis?.topic) || 'None'}
  TARGET TONE: ${targetTone}
  
  STRICT PLATFORM RULES:
  - YOUTUBE SHORTS: Captions MUST BE under 100 characters. No exceptions. This applies to both the main 'caption' and all 'formula_variants'.
  - TIKTOK: Optimize for high keyword density and search discoverability. Captions can be up to 4,000 characters.
  - INSTAGRAM: Focus on storytelling and aesthetic engagement. Captions can be up to 2,200 characters.
  - FACEBOOK: Conversational and community-driven. Long-form is acceptable.

  STRICT GENERAL RULES:
  - DO NOT include any app names, signatures, or "Virality" branding.
  - DO NOT add emojis like 🧬.
  - Output ONLY the plain caption text.

  FOR EACH PLATFORM:
  1. Main 'caption'.
  2. 8 'formula_variants'.
  
  Return ONLY JSON matching the requested schema.`;

  const variantProps = {
    caption: { type: Type.STRING },
    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
    emoji_set: { type: Type.ARRAY, items: { type: Type.STRING } }
  };

  const platformProps = {
    ...variantProps,
    virality_score: { type: Type.NUMBER },
    cover_text: { type: Type.STRING },
    strategy: { type: Type.STRING },
    formula_variants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: variantProps,
        required: ["caption", "hashtags", "emoji_set"]
      }
    }
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tiktok: { type: Type.OBJECT, properties: platformProps, required: ["caption", "hashtags", "emoji_set", "virality_score", "cover_text", "strategy", "formula_variants"] },
          instagram: { type: Type.OBJECT, properties: platformProps, required: ["caption", "hashtags", "emoji_set", "virality_score", "cover_text", "strategy", "formula_variants"] },
          facebook: { type: Type.OBJECT, properties: platformProps, required: ["caption", "hashtags", "emoji_set", "virality_score", "cover_text", "strategy", "formula_variants"] },
          youtube_shorts: { type: Type.OBJECT, properties: platformProps, required: ["caption", "hashtags", "emoji_set", "virality_score", "cover_text", "strategy", "formula_variants"] },
          youtube_long: { 
            type: Type.OBJECT, 
            properties: {
              ...platformProps,
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            }, 
            required: ["caption", "hashtags", "emoji_set", "virality_score", "cover_text", "strategy", "title", "description", "formula_variants"] 
          }
        },
        required: ["tiktok", "instagram", "facebook", "youtube_shorts", "youtube_long"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateThumbnails = async (
  style: ThumbnailStyle,
  hooks: Record<string, string>,
  analysis?: ContentAnalysis
): Promise<ThumbnailVariant[]> => {
  const platforms = [
    { name: 'YouTube', ratio: '16:9' },
    { name: 'TikTok', ratio: '9:16' },
    { name: 'Instagram', ratio: '1:1' },
    { name: 'Facebook', ratio: '16:9' }
  ] as const;

  const results = await Promise.all(platforms.map(async (p) => {
    // Create a new instance right before the call to ensure up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Create a viral ${p.name} thumbnail image. 
    STYLE: ${style}
    OVERLAY TEXT: "${hooks[p.name as keyof typeof hooks]}"
    ${analysis ? `VISUAL CONTEXT: ${analysis.topic}` : ''}
    Optimize for high CTR and platform specific aesthetic. No text other than the overlay hook.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: p.ratio as any,
          imageSize: "1K"
        }
      }
    });

    let url = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        url = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    return {
      platform: p.name,
      url,
      aspectRatio: p.ratio
    };
  }));

  return results;
};
