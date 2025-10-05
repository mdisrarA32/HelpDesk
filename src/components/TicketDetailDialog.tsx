import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, differenceInHours, differenceInMinutes } from "date-fns";
import { Clock, User, MessageSquare, Timer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIActions } from "@/components/AIActions";

interface TicketDetailDialogProps {
  ticketId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: string;
  onUpdate: () => void;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
  };
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  sla_deadline: string;
  is_sla_breached: boolean;
  created_by: string;
  assigned_to: string | null;
  resolved_at: string | null;
}

const TicketDetailDialog = ({ ticketId, open, onOpenChange, userRole, onUpdate }: TicketDetailDialogProps) => {
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (open && ticketId) {
      fetchTicketDetails();
      fetchComments();
    }
  }, [open, ticketId]);

  const fetchTicketDetails = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .single();

    if (error) {
      console.error("Error fetching ticket:", error);
    } else {
      setTicket(data);
      setNewStatus(data.status);
    }
  };

  const fetchComments = async () => {
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      return;
    }

    if (!commentsData) {
      setComments([]);
      return;
    }

    // Fetch profiles separately
    const userIds = commentsData.map(c => c.user_id);
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    // Merge comments with profiles
    const enrichedComments = commentsData.map(comment => ({
      ...comment,
      profiles: profilesData?.find(p => p.id === comment.user_id) || { full_name: "Unknown User" }
    }));

    setComments(enrichedComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to comment",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("comments").insert({
      ticket_id: ticketId,
      user_id: user.id,
      content: newComment,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      setNewComment("");
      fetchComments();
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    }

    setLoading(false);
  };

  const handleUpdateStatus = async () => {
    if (!ticket || newStatus === ticket.status) return;

    setLoading(true);
    const updateData: any = { status: newStatus };
    
    if (newStatus === "resolved" || newStatus === "closed") {
      updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("tickets")
      .update(updateData)
      .eq("id", ticketId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Ticket status updated",
      });
      fetchTicketDetails();
      onUpdate();
    }

    setLoading(false);
  };

  if (!ticket) {
    return null;
  }

  const canUpdateStatus = userRole === "agent" || userRole === "admin";

  const getResolutionTime = () => {
    if (!ticket.resolved_at) return null;
    
    const createdAt = new Date(ticket.created_at);
    const resolvedAt = new Date(ticket.resolved_at);
    const hours = differenceInHours(resolvedAt, createdAt);
    const minutes = differenceInMinutes(resolvedAt, createdAt) % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const resolutionTime = getResolutionTime();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{ticket.title}</span>
            <div className="flex items-center gap-2">
              <Badge variant={ticket.priority === "urgent" || ticket.priority === "high" ? "destructive" : "default"}>
                {ticket.priority}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {ticket.status.replace("_", " ")}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Ticket Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{ticket.description}</p>
            </div>

            {/* Ticket Info */}
            <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
              </div>
              {resolutionTime && (
                <div className="flex items-center gap-1 text-success animate-fade-in">
                  <Timer className="h-4 w-4" />
                  <span className="font-medium">Resolved in {resolutionTime}</span>
                </div>
              )}
              {ticket.is_sla_breached && (
                <Badge variant="destructive" className="animate-fade-in">SLA Breached</Badge>
              )}
            </div>

            <Separator />

            {/* Status Update (Agents/Admins only) */}
            {canUpdateStatus && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Update Status</h3>
                <div className="flex items-center gap-2">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={loading || newStatus === ticket.status}
                    size="sm"
                  >
                    Update
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            {/* AI Actions */}
            {(canUpdateStatus) && (
              <>
                <AIActions
                  ticketId={ticket.id}
                  ticketTitle={ticket.title}
                  ticketDescription={ticket.description}
                  comments={comments}
                />
                <Separator />
              </>
            )}

            {/* Comments */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({comments.length})
              </h3>

              {comments.length > 0 && (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg border bg-card p-3 animate-fade-in hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{comment.profiles?.full_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddComment} disabled={loading || !newComment.trim()} size="sm" className="hover-scale">
                  Add Comment
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailDialog;
