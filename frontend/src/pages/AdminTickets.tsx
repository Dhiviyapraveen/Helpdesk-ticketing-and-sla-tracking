import { useEffect, useState } from "react";
import { adminService } from "@/services/api";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { toast } from "@/hooks/use-toast";

interface TicketItem {
  _id: string;
  title: string;
  priority: string;
  status: string;
  assignedTo?: { _id: string; name: string } | null;
}

const AdminTickets = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [agents, setAgents] = useState<{ _id: string; name: string }[]>([]);
  const [assigning, setAssigning] = useState<string | null>(null); // ticket being assigned

  const fetchTickets = () => {
    adminService.getAllTickets()
      .then(res => setTickets(res.data || []))
      .catch(err => console.error(err));
  };

  const fetchAgents = () => {
    adminService.getAgents()
      .then(res => setAgents(res.data || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, []);

  const assignAgent = async (ticketId: string, agentId: string) => {
    setAssigning(ticketId);
    try {
      await adminService.assignTicket(ticketId, agentId);
      toast({ title: "Agent assigned successfully" });
      fetchTickets();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to assign agent", variant: "destructive" });
    } finally {
      setAssigning(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-5">All Tickets</h1>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Assign</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{t.title}</td>
                <td className="px-4 py-3">
                  <StatusBadge type={t.priority} label={t.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge type={t.status} label={t.status} />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={t.assignedTo?._id || ""}
                    onChange={(e) => assignAgent(t._id, e.target.value)}
                    className="input-field w-full"
                    disabled={assigning === t._id}
                  >
                    <option value="">Assign Agent</option>
                    {agents.map((a) => (
                      <option key={a._id} value={a._id}>{a.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTickets;