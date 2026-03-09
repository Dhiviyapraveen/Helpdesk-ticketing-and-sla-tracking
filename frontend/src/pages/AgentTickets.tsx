import { useEffect, useState } from "react";
import { agentService } from "@/services/api";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

interface TicketItem {
  _id: string;
  title: string;
  priority: string;
  status: string;
  createdAt: string;
}

const AgentTickets = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchTickets = () => {
    setLoading(true);
    agentService
      .getMyTickets()
      .then((res) => {
        setTickets(res.data?.tickets || res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load assigned tickets", err);
        setTickets([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setUpdating(ticketId);
    try {
      await agentService.updateStatus(ticketId, newStatus);
      toast({ title: "Status updated successfully" });
      fetchTickets();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to update status", variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">Assigned Tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tickets.length} tickets assigned to you
        </p>
      </motion.div>

      {}
      {loading ? (
        <LoadingSpinner />
      ) : tickets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Ticket className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No tickets assigned
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You currently have no tickets assigned to you.
          </p>
        </motion.div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t, i) => (
                  <motion.tr
                    key={t._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {t.title}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge type={t.priority} label={t.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={t.status}
                        onChange={(e) =>
                          handleStatusChange(t._id, e.target.value)
                        }
                        className="input-field py-1 px-2 h-auto"
                        disabled={updating === t._id}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentTickets;
