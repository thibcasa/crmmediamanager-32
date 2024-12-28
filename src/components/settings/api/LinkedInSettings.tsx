import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Linkedin } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  clientId: z.string().min(1, "Le Client ID est requis"),
  clientSecret: z.string().min(1, "Le Client Secret est requis"),
});

export const LinkedInSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-social-api-key', {
        body: { 
          platform: 'linkedin',
          key: JSON.stringify(values)
        }
      });

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "Les paramètres de LinkedIn ont été mis à jour avec succès."
      });
      
      form.reset();
    } catch (error) {
      console.error('Error updating LinkedIn API key:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration de LinkedIn.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Linkedin className="w-5 h-5" />
        <h3 className="text-lg font-medium">Configuration LinkedIn</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Configurez vos identifiants LinkedIn pour automatiser vos campagnes de prospection immobilière.
        Ces identifiants sont nécessaires pour publier et gérer automatiquement vos annonces sur LinkedIn.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre Client ID LinkedIn"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Secret</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre Client Secret LinkedIn"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4" />
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Comment obtenir vos identifiants LinkedIn ?</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Connectez-vous à LinkedIn Developers</li>
          <li>Créez une nouvelle application</li>
          <li>Dans les paramètres de l'application, trouvez vos identifiants</li>
          <li>Copiez le Client ID et le Client Secret</li>
        </ol>
      </div>
    </div>
  );
};