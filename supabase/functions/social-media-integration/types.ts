export interface SocialMediaRequest {
  platform: string;
  content: string;
  schedule: any;
  targetingCriteria: any;
}

export interface SocialMediaResponse {
  success: boolean;
  data?: any;
  error?: string;
}