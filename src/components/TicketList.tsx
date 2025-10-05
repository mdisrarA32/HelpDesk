import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TicketCard from "@/components/TicketCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TicketFilters } from "@/components/TicketFilters";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

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
}

interface TicketListProps {
  userRole: string;
  userId: string;
  refreshTrigger: number;
}

const TicketList = ({ userRole, userId, refreshTrigger }: TicketListProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchTickets();
  }, [userRole, userId, refreshTrigger]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [tickets, statusFilter, priorityFilter, sortOrder, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, sortOrder]);

  const fetchTickets = async () => {
    setLoading(true);
    
    let query = supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    // Users only see their own tickets
    if (userRole === "user") {
      query = query.eq("created_by", userId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching tickets:", error);
    } else {
      setTickets(data || []);
    }

    setLoading(false);
  };

  const applyFiltersAndSort = () => {
    let result = [...tickets];

    // Search filter
    if (searchQuery) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(t => t.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter(t => t.priority === priorityFilter);
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortOrder === "priority") {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      }
      return 0;
    });

    setFilteredTickets(result);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortOrder("newest");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {userRole === "user"
              ? "You haven't created any tickets yet."
              : "No tickets have been created yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {userRole === "user" ? "My Tickets" : "All Tickets"}
      </h2>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tickets by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <TicketFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        sortOrder={sortOrder}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onSortChange={setSortOrder}
        onReset={handleResetFilters}
      />

      {filteredTickets.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            {tickets.length === 0 
              ? "No tickets yet. Create your first ticket to get started." 
              : "No tickets match your search or filters."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} userRole={userRole} onUpdate={fetchTickets} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default TicketList;
