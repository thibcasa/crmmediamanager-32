export const calculateAIEngagementScore = (interactions: any[]) => {
  if (!interactions?.length) return 0;
  return Math.round(interactions.reduce((acc, int) => {
    const baseScore = int.status === 'active' ? 1 : 0.5;
    const recencyBonus = isRecent(int.created_at) ? 0.3 : 0;
    return acc + baseScore + recencyBonus;
  }, 0) / interactions.length * 100);
};

export const calculateAIScore = (qualification: string, leads: any[]) => {
  if (!leads?.length) return 0;
  const qualifiedLeads = leads.filter(l => l.qualification === qualification);
  return Math.round((qualifiedLeads.length / leads.length) * 100);
};

export const generateAIRecommendations = (leads: any[]) => {
  if (!leads?.length) return [];
  
  const recommendations = [];
  
  const coldLeads = leads.filter(l => l.status === 'cold');
  if (coldLeads.length > 0) {
    recommendations.push({
      type: 'Réactivation',
      description: `${coldLeads.length} leads inactifs à recontacter`,
      priority: 'Haute'
    });
  }

  const qualifiedLeads = leads.filter(l => l.qualification === 'prospect' && l.score > 70);
  if (qualifiedLeads.length > 0) {
    recommendations.push({
      type: 'Conversion',
      description: `${qualifiedLeads.length} prospects hautement qualifiés`,
      priority: 'Urgente'
    });
  }

  return recommendations;
};

const isRecent = (date: string) => {
  const now = new Date();
  const interactionDate = new Date(date);
  const daysDiff = Math.floor((now.getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff <= 7;
};