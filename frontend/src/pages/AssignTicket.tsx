import { useEffect, useState } from "react";
import { ticketService, adminService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface Ticket {
  _id: string;
  title: string;
}

interface Agent {
  _id: string;
  name: string;
}

const AssignTicket = () => {

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  const fetchTickets = async () => {

    const res = await ticketService.getAll();

    setTickets(res.data?.tickets || res.data);

  };

  const fetchAgents = async () => {

    const res = await adminService.getUsers();

    const agentList = res.data.filter((u: any) => u.role === "agent");

    setAgents(agentList);

  };

  useEffect(() => {

    fetchTickets();
    fetchAgents();

  }, []);

  const assignTicket = async (ticketId: string) => {

    if (!selectedAgent) {
      toast({ title: "Select an agent first" });
      return;
    }

    try {

      await adminService.assignTicket(ticketId, selectedAgent);

      toast({ title: "Ticket assigned successfully" });

    } catch {

      toast({
        title: "Failed to assign ticket",
        variant: "destructive"
      });

    }

  };

  return (

    <div className="max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Assign Tickets
      </h1>

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Ticket</th>
            <th className="p-3 text-left">Agent</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>

          {tickets.map((ticket) => (

            <tr key={ticket._id} className="border-t">

              <td className="p-3">{ticket.title}</td>

              <td className="p-3">

                <select
                  className="border p-2"
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >

                  <option value="">
                    Select Agent
                  </option>

                  {agents.map((agent) => (

                    <option
                      key={agent._id}
                      value={agent._id}
                    >
                      {agent.name}
                    </option>

                  ))}

                </select>

              </td>

              <td className="p-3">

                <button
                  onClick={() => assignTicket(ticket._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Assign
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};

export default AssignTicket;