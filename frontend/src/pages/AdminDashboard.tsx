import { useEffect, useState } from "react";
import { ticketService, adminService } from "@/services/api";
import StatsCard from "@/components/StatsCard";
import { Users, Ticket, AlertTriangle, CheckCircle } from "lucide-react";

const AdminDashboard = () => {

  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {

    ticketService.getAll().then((res) => {
      setTickets(res.data || []);
    });

    adminService.getUsers().then((res) => {
      setUsers(res.data || []);
    });

  }, []);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (t) => t.status === "Open"
  ).length;

  const closedTickets = tickets.filter(
    (t) => t.status === "Closed"
  ).length;

  const totalUsers = users.length;

  return (
    <div className="mx-auto max-w-6xl">

      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <StatsCard
          title="Total Tickets"
          value={totalTickets}
          icon={<Ticket />}
          color="primary"
        />

        <StatsCard
          title="Open Tickets"
          value={openTickets}
          icon={<AlertTriangle />}
          color="warning"
        />

        <StatsCard
          title="Closed Tickets"
          value={closedTickets}
          icon={<CheckCircle />}
          color="success"
        />

        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={<Users />}
          color="primary"
        />

      </div>

    </div>
  );
};

export default AdminDashboard;