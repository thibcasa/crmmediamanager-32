import { getRequiredToken } from '../config.ts';

export async function postToInstagram(content: string, schedule: any) {
  const accessToken = getRequiredToken('instagram');

  const createContainer = await fetch(`https://graph.facebook.com/v18.0/me/media`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      caption: content,
      access_token: accessToken,
      scheduled_publish_time: schedule ? new Date(schedule.times[0]).getTime() / 1000 : undefined,
    }),
  });

  if (!createContainer.ok) {
    const error = await createContainer.json();
    throw new Error(`Erreur Instagram: ${JSON.stringify(error)}`);
  }

  const { id } = await createContainer.json();

  const publishResponse = await fetch(`https://graph.facebook.com/v18.0/me/media_publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      creation_id: id,
      access_token: accessToken,
    }),
  });

  if (!publishResponse.ok) {
    const error = await publishResponse.json();
    throw new Error(`Erreur lors de la publication Instagram: ${JSON.stringify(error)}`);
  }

  return await publishResponse.json();
}