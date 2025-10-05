import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AIActionsProps {
  ticketId: string;
  ticketTitle: string;
  ticketDescription: string;
  comments: Array<{ content: string; profiles: { full_name: string } }>;
}

export function AIActions({ ticketTitle, ticketDescription, comments }: AIActionsProps) {
  const { toast } = useToast();
  const [summary, setSummary] = useState("");
  const [suggestedReply, setSuggestedReply] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  const generateSummary = async () => {
    setLoadingSummary(true);
    
    // Mock AI summary generation
    setTimeout(() => {
      const mockSummary = `Summary: ${ticketTitle} - ${ticketDescription.substring(0, 100)}... ${comments.length} comment(s) received. Status requires attention.`;
      setSummary(mockSummary);
      setLoadingSummary(false);
      toast({
        title: "Summary Generated",
        description: "AI summary created successfully",
      });
    }, 1500);
  };

  const generateReply = async () => {
    setLoadingReply(true);
    
    // Mock AI reply suggestion
    setTimeout(() => {
      const mockReply = `Thank you for contacting us regarding "${ticketTitle}". We've reviewed your issue and are working on a solution. We'll keep you updated on the progress. Is there anything else we can help you with?`;
      setSuggestedReply(mockReply);
      setLoadingReply(false);
      toast({
        title: "Reply Suggested",
        description: "AI-generated response ready",
      });
    }, 1500);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        AI Actions
      </h3>
      
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={generateSummary} 
          disabled={loadingSummary}
          size="sm"
          variant="outline"
          className="hover-scale"
        >
          <Sparkles className="mr-2 h-3 w-3" />
          {loadingSummary ? "Generating..." : "Summarize Ticket"}
        </Button>
        
        <Button 
          onClick={generateReply} 
          disabled={loadingReply}
          size="sm"
          variant="outline"
          className="hover-scale"
        >
          <MessageSquare className="mr-2 h-3 w-3" />
          {loadingReply ? "Generating..." : "Suggest Reply"}
        </Button>
      </div>

      {loadingSummary && (
        <Card className="p-3">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </Card>
      )}

      {summary && !loadingSummary && (
        <Card className="p-3 bg-accent/10 animate-fade-in">
          <p className="text-sm">{summary}</p>
        </Card>
      )}

      {loadingReply && (
        <Card className="p-3">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </Card>
      )}

      {suggestedReply && !loadingReply && (
        <Card className="p-3 bg-primary/5 animate-fade-in">
          <p className="text-sm font-medium mb-1">Suggested Reply:</p>
          <p className="text-sm">{suggestedReply}</p>
        </Card>
      )}
    </div>
  );
}
