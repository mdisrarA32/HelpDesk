import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import TicketDetailDialog from "@/components/TicketDetailDialog";
import { SLAProgressBar } from "@/components/SLAProgressBar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    created_at: string;
    sla_deadline: string;
    is_sla_breached: boolean;
  };
  userRole: string;
  onUpdate: () => void;
}

const TicketCard = ({ ticket, userRole, onUpdate }: TicketCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "open":
        return "outline";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "default";
      case "closed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "default";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-destructive border-destructive";
      case "high":
        return "text-warning border-warning";
      case "medium":
        return "text-primary border-primary";
      case "low":
        return "text-success border-success";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const slaTimeRemaining = formatDistanceToNow(new Date(ticket.sla_deadline), {
    addSuffix: true,
  });

  return (
    <>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <Card className="transition-all duration-300 hover:shadow-lg animate-fade-in overflow-hidden">
          <CollapsibleTrigger asChild>
            <div className="cursor-pointer">
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-1 flex-1">{ticket.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge 
                      variant={getPriorityBadgeVariant(ticket.priority) as any} 
                      className={getPriorityColor(ticket.priority)}
                    >
                      {ticket.priority}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getStatusBadgeVariant(ticket.status) as any} className="flex items-center gap-1 animate-pulse">
                    {getStatusIcon(ticket.status)}
                    <span className="capitalize">{ticket.status.replace("_", " ")}</span>
                  </Badge>
                  {ticket.is_sla_breached && ticket.status !== "resolved" && ticket.status !== "closed" && (
                    <Badge variant="destructive" className="animate-fade-in">
                      SLA Breached
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
                </div>
                <SLAProgressBar 
                  createdAt={ticket.created_at}
                  slaDeadline={ticket.sla_deadline}
                  isBreached={ticket.is_sla_breached}
                  status={ticket.status}
                />
              </CardContent>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 border-t animate-fade-in">
              <div className="mt-4">
                <Button 
                  onClick={() => setIsDetailOpen(true)} 
                  variant="outline" 
                  className="w-full hover-scale"
                >
                  View Full Details & Comments
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <TicketDetailDialog
        ticketId={ticket.id}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        userRole={userRole}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default TicketCard;
