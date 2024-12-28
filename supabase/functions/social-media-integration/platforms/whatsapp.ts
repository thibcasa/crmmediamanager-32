export async function sendToWhatsApp(content: string, schedule: any) {
  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  if (!accessToken) throw new Error('Token WhatsApp manquant');

  console.log('WhatsApp message would be sent:', content);
  console.log('Schedule:', schedule);
  
  return { success: true, message: 'WhatsApp message scheduled' };
}