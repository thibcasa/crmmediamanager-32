import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogueFlow } from "@/types/marketing";

interface ConversationFlowProps {
  dialogue: DialogueFlow[];
}

export const ConversationFlow = ({ dialogue }: ConversationFlowProps) => {
  return (
    <ScrollArea className="h-[300px] mt-4">
      <div className="space-y-4">
        {dialogue.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'assistant'
                ? 'bg-primary/10 ml-4'
                : 'bg-secondary/10 mr-4'
            }`}
          >
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};