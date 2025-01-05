import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Wand2, Share2 } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SubjectModule() {
  const [objective, setObjective] = useState('');
  const [domain, setDomain] = useState('luxury_real_estate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSubjects, setGeneratedSubjects] = useState<any[]>([]);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadGeneratedContent();
  }, []);

  const loadGeneratedContent = async () => {
    try {
      const { data: subjects } = await supabase
        .from('generated_titles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (subjects) {
        setGeneratedSubjects(subjects);
      }

      const { data: posts } = await supabase
        .from('social_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (posts) {
        setGeneratedPosts(posts);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleGenerateContent = async () => {
    try {
      setIsGenerating(true);
      console.log('Generating content with input:', { objective, domain });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate content using the workflow generator
      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          action: 'generate_workflow',
          objective,
          domain,
          target_audience: "propriétaires immobiliers Alpes-Maritimes",
          platforms: ["linkedin", "facebook", "instagram"]
        }
      });

      if (error) throw error;

      // Create social campaign with generated content
      if (data?.content) {
        await supabase.from('social_campaigns').insert({
          user_id: user.id,
          name: `Campagne ${domain} - ${new Date().toLocaleDateString()}`,
          platform: 'linkedin',
          status: 'draft',
          message_template: data.content,
          targeting_criteria: {
            location: "Alpes-Maritimes",
            interests: ["immobilier", "luxe", "investissement"]
          },
          content_strategy: {
            post_types: ["image", "carousel"],
            posting_frequency: "daily",
            best_times: ["09:00", "12:00", "17:00"]
          }
        });
      }

      await loadGeneratedContent();
      
      toast({
        title: "Contenu généré avec succès",
        description: "Votre campagne a été créée et est prête à être publiée",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishPost = async (post: any) => {
    try {
      const { error } = await supabase.functions.invoke('social-media-share', {
        body: {
          platform: post.platform,
          content: post.message_template,
        }
      });

      if (error) throw error;

      toast({
        title: "Publication réussie",
        description: "Votre contenu a été publié sur " + post.platform,
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier le contenu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Module Sujet</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Domaine</label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un domaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury_real_estate">Immobilier de luxe</SelectItem>
                <SelectItem value="investment_property">Investissement immobilier</SelectItem>
                <SelectItem value="property_management">Gestion locative</SelectItem>
                <SelectItem value="real_estate_development">Promotion immobilière</SelectItem>
                <SelectItem value="commercial_real_estate">Immobilier commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Objectif</label>
            <Textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Ex: Créer une série de posts LinkedIn pour attirer des propriétaires de biens de luxe à Cannes..."
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleGenerateContent}
            disabled={isGenerating || !objective}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Générer du contenu
              </>
            )}
          </Button>
        </div>

        {(generatedSubjects.length > 0 || generatedPosts.length > 0) && (
          <div className="mt-8 space-y-6">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <h3 className="text-lg font-medium mb-4">Contenu généré</h3>
              
              {generatedPosts.map((post, index) => (
                <Card key={index} className="p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{post.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {post.message_template?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-sage-100 text-sage-800 px-2 py-1 rounded">
                          {post.platform}
                        </span>
                        <span className="text-xs bg-sage-100 text-sage-800 px-2 py-1 rounded">
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishPost(post)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Publier
                    </Button>
                  </div>
                </Card>
              ))}
            </ScrollArea>
          </div>
        )}
      </Card>
    </div>
  );
}