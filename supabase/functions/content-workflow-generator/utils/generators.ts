import { callOpenAI } from './openai.ts';

export async function generateSubjects(objective: string): Promise<string[]> {
  console.log('Generating subjects for objective:', objective);
  
  const data = await callOpenAI('chat/completions', {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Vous êtes un expert en immobilier de luxe sur la Côte d'Azur." },
      { role: "user", content: `En tant qu'expert immobilier sur la Côte d'Azur, générez 3 sujets pertinents pour : ${objective}` }
    ]
  });

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response format from OpenAI API');
  }

  const subjects = data.choices[0].message.content
    .split('\n')
    .filter(Boolean)
    .map(subject => subject.trim())
    .filter(subject => subject.length > 0);

  if (subjects.length === 0) {
    throw new Error('No valid subjects were generated');
  }

  console.log('Generated subjects:', subjects);
  return subjects;
}

export async function generateTitle(subject: string): Promise<string> {
  console.log('Generating title for subject:', subject);
  
  const data = await callOpenAI('chat/completions', {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Vous êtes un expert SEO immobilier." },
      { role: "user", content: `Créez un titre SEO optimisé pour ce sujet immobilier : ${subject}` }
    ]
  });

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response format from OpenAI API');
  }

  const title = data.choices[0].message.content.trim();
  console.log('Generated title:', title);
  return title;
}

export async function generateContent(title: string): Promise<string> {
  console.log('Generating content for title:', title);
  
  const data = await callOpenAI('chat/completions', {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Vous êtes un rédacteur web spécialisé en immobilier." },
      { role: "user", content: `Rédigez un article immobilier optimisé SEO pour ce titre : ${title}` }
    ]
  });

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response format from OpenAI API');
  }

  const content = data.choices[0].message.content.trim();
  console.log('Generated content length:', content.length);
  return content;
}

export async function generateVisual(content: string): Promise<string> {
  console.log('Generating visual for content');
  
  const data = await callOpenAI('images/generations', {
    model: "dall-e-3",
    prompt: `Une image professionnelle pour illustrer ce contenu immobilier : ${content.substring(0, 300)}`,
    n: 1,
    size: "1024x1024"
  });

  if (!data.data?.[0]?.url) {
    throw new Error('Invalid response format from OpenAI API');
  }

  console.log('Generated visual URL');
  return data.data[0].url;
}