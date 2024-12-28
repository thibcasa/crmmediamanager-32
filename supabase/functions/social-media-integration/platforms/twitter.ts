import { getRequiredToken } from '../config.ts';

export async function postToTwitter(content: string, schedule: any) {
  const accessToken = getRequiredToken('twitter');

  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: content,
      scheduled_time: schedule ? new Date(schedule.times[0]).toISOString() : undefined
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur Twitter: ${JSON.stringify(error)}`);
  }

  return await response.json();
}