import { Ticket, Shield, UserCircle, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  userRole: string;
}

const DashboardHeader = ({ userRole }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      });
    } else {
      navigate("/login");
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return <Shield className="h-5 w-5" />;
      case "agent":
        return <Ticket className="h-5 w-5" />;
      default:
        return <UserCircle className="h-5 w-5" />;
    }
  };

  const getRoleVariant = () => {
    switch (userRole) {
      case "admin":
        return "default";
      case "agent":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Ticket className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">HelpDesk</h1>
          <Badge variant={getRoleVariant() as any} className="flex items-center gap-1">
            {getRoleIcon()}
            <span className="capitalize">{userRole}</span>
          </Badge>
        </div>
      </div>
      
      <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;
