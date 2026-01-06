
export type ToneType = 
  | 'energetic' 
  | 'calm-authority' 
  | 'excited-storyteller' 
  | 'sarcastic-humor' 
  | 'motivational-coach' 
  | 'mysterious-tease' 
  | 'urgent-cta' 
  | 'relatable-friend'
  | 'funny' 
  | 'professional' 
  | 'educational' 
  | 'relatable' 
  | 'custom';

export type ScriptType = 'viral-hook' | 'value-stack' | 'story-arc' | 'deep-authority' | 'tutorial-flow' | 'epic-journey' | 'custom';
export type ContentLength = '15s' | '30s' | '60s' | '90s' | '3min' | '5min+' | 'custom' | 'auto';

export interface TikTokSEO {
  keywords: string[];
}

export interface ContentAnalysis {
  contentType: string;
  tone: string;
  topic: string;
  keyPoints: string[];
}

export interface PlatformVariant {
  caption: string;
  hashtags: string[];
  emoji_set: string[];
}

export interface PlatformContent {
  caption: string;
  hashtags: string[];
  emoji_set: string[];
  hook?: string;
  title?: string;
  description?: string;
  cover_text: string;
  strategy: string;
  virality_score: number;
  formula_variants: PlatformVariant[];
}

export interface ViralResults {
  tiktok: PlatformContent;
  instagram: PlatformContent;
  facebook: PlatformContent;
  youtube_shorts: PlatformContent;
  youtube_long: PlatformContent;
}

export interface ScriptResult {
  content: string;
  formulaUsed: string;
  estimatedReadingTime: string;
  shotIdeas: string[];
  viralScore: number;
  viralJustification: string;
  keywords?: TikTokSEO;
}

export enum Platform {
  TikTok = 'tiktok',
  Instagram = 'instagram',
  Facebook = 'facebook',
  YouTubeShorts = 'youtube_shorts',
  YouTubeLong = 'youtube_long'
}

export interface UploadedFile {
  file: File;
  previewUrl: string;
  type: 'image' | 'text';
  base64?: string;
}

export type ThumbnailStyle = 'neon-edition' | 'minimalist-flat' | 'cinematic-spotlight' | 'gradient-burst';

export interface ThumbnailVariant {
  platform: string;
  url: string;
  aspectRatio: string;
}

export interface PostTemplate {
  id: string;
  name: string;
  tone: ToneType;
  customTone: string;
  platforms: Platform[];
}

export interface ScriptTemplate {
  id: string;
  name: string;
  formula: ScriptType;
  length: ContentLength;
  autoLength: boolean;
}

export interface CoverTemplate {
  id: string;
  name: string;
  style: ThumbnailStyle;
  hooks: Record<string, string>;
}

export interface TikTokIdea {
  mode: string;
  hook: string;
  story: string;
  cta: string;
  hashtags: string[];
}

export interface TikTokIdeasResult {
  ideas: TikTokIdea[];
}
