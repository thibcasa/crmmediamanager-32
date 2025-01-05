export interface StructuredContent {
  text?: string;
  platform?: string;
  targetAudience?: string;
  location?: string;
  propertyType?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string | StructuredContent;
}