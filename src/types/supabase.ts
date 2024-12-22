export interface SecretKeys {
  GOOGLE_CALENDAR_API_KEY?: string;
  SENDGRID_API_KEY?: string;
}

export type GetSecretsResponse = {
  data: SecretKeys;
}