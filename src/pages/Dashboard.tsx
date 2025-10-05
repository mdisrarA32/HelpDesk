import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Ticket, Clock, CheckCircle2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TicketList from "@/components/TicketList";
import CreateTicketDialog from "@/components/CreateTicketDialog";
import DashboardHeader from "@/components/DashboardHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchUserRole();
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) console.error("Error fetching user role:", error);
    else if (data) setUserRole(data.role);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleTicketCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast({
      title: "✅ Ticket Created",
      description: "Your support request has been successfully created.",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <DashboardHeader userRole={userRole} />
          <div className="flex items-center gap-2">
            {userRole === "user" && (
              <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" /> New Ticket
              </Button>
            )}
            {(userRole === "agent" || userRole === "admin") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" /> Analytics
              </Button>
            )}
            <ThemeToggle />
           
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <motion.div
        className="container mx-auto px-4 py-10 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">
          👋 Welcome back, <span className="text-primary">{user.user_metadata?.name || "User"}</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage your tickets and track your support progress in real-time.
        </p>
      </motion.div>

     
      <main className="container mx-auto flex-1 px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <TicketList
            userRole={userRole}
            userId={user.id}
            refreshTrigger={refreshTrigger}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card/70 backdrop-blur-md py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} <span className="text-primary font-semibold">HelpDesk Made with ❤️ by MD ISRAR</span>. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <CreateTicketDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
};

export default Dashboard;
