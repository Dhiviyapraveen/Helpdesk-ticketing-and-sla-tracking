import { useEffect, useState } from 'react';
import { ticketService } from '@/services/api';
import StatsCard from '@/components/StatsCard';
import { Ticket, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TicketData {
  _id: string;
  status: string;
  slaStatus?: string;
}

const Dashboard = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService.getAll()
      .then((res) => setTickets(res.data?.tickets || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = tickets.length;
  const open = tickets.filter((t) => t.status?.toLowerCase() === 'open').length;
  const closed = tickets.filter((t) => t.status?.toLowerCase() === 'closed').length;
  const overdue = tickets.filter((t) => t.slaStatus?.toLowerCase() === 'breached').length;

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your helpdesk activity</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Tickets" value={total} icon={<Ticket className="h-5 w-5" />} color="primary" delay={0} />
        <StatsCard title="Open Tickets" value={open} icon={<AlertCircle className="h-5 w-5" />} color="warning" delay={0.1} />
        <StatsCard title="Closed Tickets" value={closed} icon={<CheckCircle className="h-5 w-5" />} color="success" delay={0.2} />
        <StatsCard title="SLA Breached" value={overdue} icon={<Clock className="h-5 w-5" />} color="destructive" delay={0.3} />
      </div>

      {loading && (
        <div className="mt-12 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!loading && total === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Ticket className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No tickets yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Create your first ticket to get started</p>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
