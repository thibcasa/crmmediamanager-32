import { getRequiredToken } from '../config.ts';

export async function postToFacebook(content: string, schedule: any) {
  const accessToken = getRequiredToken('facebook');

  const response = await fetch(`https://graph.facebook.com/v18.0/me/feed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: content,
      access_token: accessToken,
      scheduled_publish_time: schedule ? new Date(schedule.times[0]).getTime() / 1000 : undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur Facebook: ${JSON.stringify(error)}`);
  }

  return await response.json();
}