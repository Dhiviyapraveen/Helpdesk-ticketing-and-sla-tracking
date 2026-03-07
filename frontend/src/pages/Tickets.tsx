import { useEffect, useState } from 'react';
import { ticketService } from '@/services/api';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Pencil, Ticket } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TicketItem {
  _id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  slaStatus?: string;
  createdAt: string;
}

const Tickets = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<TicketItem | null>(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Low', status: 'Open' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = () => {
    setLoading(true);
    ticketService.getAll()
      .then((res) => setTickets(res.data?.tickets || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await ticketService.create({ title: form.title, description: form.description, priority: form.priority });
      toast({ title: 'Ticket created' });
      setCreateOpen(false);
      setForm({ title: '', description: '', priority: 'Low', status: 'Open' });
      fetchTickets();
    } catch {
      toast({ title: 'Failed to create ticket', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      await ticketService.update(selected._id, { title: form.title, description: form.description, priority: form.priority, status: form.status });
      toast({ title: 'Ticket updated' });
      setEditOpen(false);
      fetchTickets();
    } catch {
      toast({ title: 'Failed to update ticket', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await ticketService.delete(selected._id);
      toast({ title: 'Ticket deleted' });
      setDeleteOpen(false);
      fetchTickets();
    } catch {
      toast({ title: 'Failed to delete ticket', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (t: TicketItem) => {
    setSelected(t);
    setForm({ title: t.title, description: t.description || '', priority: t.priority, status: t.status });
    setEditOpen(true);
  };

  const openDelete = (t: TicketItem) => {
    setSelected(t);
    setDeleteOpen(true);
  };

  const statuses = ['all', 'Open', 'In Progress', 'Closed'];

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tickets</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tickets.length} total tickets</p>
        </div>
        <button onClick={() => { setForm({ title: '', description: '', priority: 'Low', status: 'Open' }); setCreateOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Ticket
        </button>
      </motion.div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search tickets..." />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted"><Ticket className="h-8 w-8 text-muted-foreground" /></div>
          <h3 className="text-lg font-semibold text-foreground">No tickets found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
        </motion.div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">SLA</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <motion.tr
                    key={t._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{t.title}</td>
                    <td className="px-4 py-3"><StatusBadge type={t.priority} label={t.priority} /></td>
                    <td className="px-4 py-3"><StatusBadge type={t.status} label={t.status} /></td>
                    <td className="px-4 py-3"><StatusBadge type={t.slaStatus || 'on track'} label={t.slaStatus || 'On Track'} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(t)} className="mr-1 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => openDelete(t)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Ticket">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Ticket title" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" placeholder="Describe the issue..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? 'Creating...' : 'Create Ticket'}</button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Ticket">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                <option>Open</option><option>In Progress</option><option>Closed</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Ticket">
        <p className="mb-6 text-sm text-muted-foreground">Are you sure you want to delete "<span className="font-medium text-foreground">{selected?.title}</span>"? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteOpen(false)} className="btn-ghost flex-1">Cancel</button>
          <button onClick={handleDelete} disabled={submitting} className="flex-1 rounded-xl bg-destructive px-4 py-2.5 font-medium text-destructive-foreground transition-all hover:opacity-90">
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Tickets;
