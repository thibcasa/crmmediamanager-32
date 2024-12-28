import { Textarea } from "@/components/ui/textarea";

interface MessageTemplateFormProps {
  messageTemplate: string;
  onMessageTemplateChange: (template: string) => void;
}

export const MessageTemplateForm = ({ messageTemplate, onMessageTemplateChange }: MessageTemplateFormProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Template de message</label>
      <Textarea
        value={messageTemplate}
        onChange={(e) => onMessageTemplateChange(e.target.value)}
        placeholder="Bonjour {first_name}, je vois que vous êtes propriétaire..."
        className="min-h-[200px]"
      />
    </div>
  );
};