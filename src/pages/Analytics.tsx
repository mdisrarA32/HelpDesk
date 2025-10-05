import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Ticket } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import DashboardHeader from "@/components/DashboardHeader";

interface TicketStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  slaBreached: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
}

const Analytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    slaBreached: 0,
    urgent: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [userRole, setUserRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole();
    fetchStats();
  }, []);

  const fetchUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setUserRole(data.role);
    }
  };

  const fetchStats = async () => {
    const { data: tickets } = await supabase
      .from("tickets")
      .select("*");

    if (tickets) {
      const newStats: TicketStats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === "open").length,
        in_progress: tickets.filter(t => t.status === "in_progress").length,
        resolved: tickets.filter(t => t.status === "resolved").length,
        closed: tickets.filter(t => t.status === "closed").length,
        slaBreached: tickets.filter(t => t.is_sla_breached).length,
        urgent: tickets.filter(t => t.priority === "urgent").length,
        high: tickets.filter(t => t.priority === "high").length,
        medium: tickets.filter(t => t.priority === "medium").length,
        low: tickets.filter(t => t.priority === "low").length,
      };
      setStats(newStats);
    }
    setLoading(false);
  };

  const statusData = [
    { name: "Open", value: stats.open, color: "hsl(var(--primary))" },
    { name: "In Progress", value: stats.in_progress, color: "hsl(var(--warning))" },
    { name: "Resolved", value: stats.resolved, color: "hsl(var(--success))" },
    { name: "Closed", value: stats.closed, color: "hsl(var(--muted))" }
  ];

  const priorityData = [
    { name: "Urgent", value: stats.urgent },
    { name: "High", value: stats.high },
    { name: "Medium", value: stats.medium },
    { name: "Low", value: stats.low }
  ];

  const COLORS = {
    urgent: "hsl(var(--destructive))",
    high: "hsl(var(--warning))",
    medium: "hsl(var(--primary))",
    low: "hsl(var(--success))"
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <DashboardHeader userRole={userRole} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 animate-fade-in">Analytics Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="animate-fade-in hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in hover-scale" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in hover-scale" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SLA Breaches</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.slaBreached}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.slaBreached / stats.total) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in hover-scale" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.in_progress}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle>Tickets by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle>Tickets by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
