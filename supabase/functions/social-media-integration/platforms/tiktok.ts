import { getRequiredToken } from '../config.ts';

export async function postToTikTok(content: string, schedule: any) {
  const accessToken = getRequiredToken('tiktok');

  const response = await fetch('https://open-api.tiktok.com/v2/post/publish/content/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: content,
      schedule_time: schedule ? new Date(schedule.times[0]).getTime() / 1000 : undefined
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur TikTok: ${JSON.stringify(error)}`);
  }

  return await response.json();
}