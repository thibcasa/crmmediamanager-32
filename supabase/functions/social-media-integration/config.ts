export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const getRequiredToken = (platform: string): string => {
  const token = Deno.env.get(`${platform.toUpperCase()}_ACCESS_TOKEN`);
  if (!token) throw new Error(`Token ${platform} manquant`);
  return token;
};