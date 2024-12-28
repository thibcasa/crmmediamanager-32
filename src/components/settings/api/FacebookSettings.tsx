import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook } from 'lucide-react';
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
  apiKey: z.string().min(1, "La clé API est requise"),
});

export const FacebookSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-social-api-key', {
        body: { platform: 'facebook', key: values.apiKey }
      });

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "Les paramètres de Facebook ont été mis à jour avec succès."
      });
      
      form.reset();
    } catch (error) {
      console.error('Error updating Facebook API key:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration de Facebook.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Facebook className="w-5 h-5" />
        <h3 className="text-lg font-medium">Configuration Facebook</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Configurez votre clé API Facebook pour gérer vos campagnes publicitaires immobilières.
        Cette clé est nécessaire pour publier et gérer automatiquement vos annonces sur Facebook.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clé API Facebook</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre clé API Facebook"
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
              <Facebook className="w-4 h-4" />
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Comment obtenir votre clé API Facebook ?</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Connectez-vous à votre compte Facebook Developers</li>
          <li>Créez ou sélectionnez une application</li>
          <li>Accédez aux paramètres de l'application</li>
          <li>Générez une nouvelle clé API dans la section "Clés et jetons d'accès"</li>
        </ol>
      </div>
    </div>
  );
};