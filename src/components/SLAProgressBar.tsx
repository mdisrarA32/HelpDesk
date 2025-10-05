import { Progress } from "@/components/ui/progress";
import { differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";

interface SLAProgressBarProps {
  createdAt: string;
  slaDeadline: string;
  isBreached: boolean;
  status: string;
}

export function SLAProgressBar({ createdAt, slaDeadline, isBreached, status }: SLAProgressBarProps) {
  if (status === "resolved" || status === "closed") {
    return null;
  }

  const now = new Date();
  const created = new Date(createdAt);
  const deadline = new Date(slaDeadline);
  
  const totalMinutes = differenceInMinutes(deadline, created);
  const elapsedMinutes = differenceInMinutes(now, created);
  const percentage = Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100));
  
  const getProgressColor = () => {
    if (isBreached) return "bg-destructive";
    if (percentage > 80) return "bg-warning";
    if (percentage > 50) return "bg-yellow-500";
    return "bg-success";
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">SLA Progress</span>
        <span className={cn(
          "font-medium",
          isBreached ? "text-destructive" : 
          percentage > 80 ? "text-warning" :
          "text-muted-foreground"
        )}>
          {Math.round(percentage)}%
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
      />
    </div>
  );
}
