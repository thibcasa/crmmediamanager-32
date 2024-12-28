import { getRequiredToken } from '../config.ts';

export async function postToLinkedIn(content: string, schedule: any) {
  const accessToken = getRequiredToken('linkedin');

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: `urn:li:person:${accessToken}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      },
      distribution: {
        scheduledTime: schedule ? new Date(schedule.times[0]).getTime() : undefined
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur LinkedIn: ${JSON.stringify(error)}`);
  }

  return await response.json();
}