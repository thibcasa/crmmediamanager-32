import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  MessageCircle, 
  Search,
  Youtube,
  Camera,
  MessageSquare,
  Share2,
  Send,
  Hash,
  Globe,
  BookOpen,
  Github
} from 'lucide-react';
import { LinkedInSettings } from './api/LinkedInSettings';
import { FacebookSettings } from './api/FacebookSettings';
import { InstagramSettings } from './api/InstagramSettings';
import { WhatsAppSettings } from './api/WhatsAppSettings';
import { TwitterSettings } from './api/TwitterSettings';
import { YoutubeSettings } from './api/YoutubeSettings';
import { PinterestSettings } from './api/PinterestSettings';
import { TikTokSettings } from './api/TikTokSettings';
import { SnapchatSettings } from './api/SnapchatSettings';
import { RedditSettings } from './api/RedditSettings';
import { TelegramSettings } from './api/TelegramSettings';
import { DiscordSettings } from './api/DiscordSettings';
import { WeChatSettings } from './api/WeChatSettings';
import { TumblrSettings } from './api/TumblrSettings';
import { GithubSettings } from './api/GithubSettings';
import { ApiKeyForm } from '@/components/lead-scraper/ApiKeyForm';

export const SocialApiSettings = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Configuration des API</h2>
      
      <Tabs defaultValue="firecrawl" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-2">
          <TabsTrigger value="firecrawl" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Firecrawl
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="w-4 h-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="w-4 h-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Youtube className="w-4 h-4" />
            YouTube
          </TabsTrigger>
          <TabsTrigger value="pinterest" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Pinterest
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            TikTok
          </TabsTrigger>
          <TabsTrigger value="snapchat" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Snapchat
          </TabsTrigger>
          <TabsTrigger value="reddit" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Reddit
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="discord" className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Discord
          </TabsTrigger>
          <TabsTrigger value="wechat" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            WeChat
          </TabsTrigger>
          <TabsTrigger value="tumblr" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Tumblr
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub
          </TabsTrigger>
        </TabsList>

        <TabsContent value="firecrawl" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Configuration de l'API Firecrawl</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Configurez votre clé API Firecrawl pour activer la recherche et l'analyse de sites web.
            </p>
            <ApiKeyForm />
          </Card>
        </TabsContent>

        <TabsContent value="linkedin">
          <LinkedInSettings />
        </TabsContent>

        <TabsContent value="facebook">
          <FacebookSettings />
        </TabsContent>

        <TabsContent value="instagram">
          <InstagramSettings />
        </TabsContent>

        <TabsContent value="twitter">
          <TwitterSettings />
        </TabsContent>

        <TabsContent value="youtube">
          <YoutubeSettings />
        </TabsContent>

        <TabsContent value="pinterest">
          <PinterestSettings />
        </TabsContent>

        <TabsContent value="tiktok">
          <TikTokSettings />
        </TabsContent>

        <TabsContent value="snapchat">
          <SnapchatSettings />
        </TabsContent>

        <TabsContent value="reddit">
          <RedditSettings />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppSettings />
        </TabsContent>

        <TabsContent value="telegram">
          <TelegramSettings />
        </TabsContent>

        <TabsContent value="discord">
          <DiscordSettings />
        </TabsContent>

        <TabsContent value="wechat">
          <WeChatSettings />
        </TabsContent>

        <TabsContent value="tumblr">
          <TumblrSettings />
        </TabsContent>

        <TabsContent value="github">
          <GithubSettings />
        </TabsContent>
      </Tabs>
    </Card>
  );
};