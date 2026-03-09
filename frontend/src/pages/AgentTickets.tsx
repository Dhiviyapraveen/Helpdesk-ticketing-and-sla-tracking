import { useEffect,useState } from "react";
import { ticketService } from "@/services/api";
import StatusBadge from "@/components/StatusBadge";

const AgentTickets = ()=>{

const [tickets,setTickets] = useState([]);
useEffect(() => {

  ticketService.getAssignedTickets()
    .then((res) => {

      setTickets(res.data || []);

    })
    .catch((err) => {

      console.error("Failed to load assigned tickets", err);
      setTickets([]);

    });

}, []);

return(

<div className="max-w-6xl mx-auto">

<h1 className="text-2xl font-bold mb-5">Assigned Tickets</h1>

<table className="w-full">

<thead>
<tr>
<th>Title</th>
<th>Status</th>
<th>Priority</th>
</tr>
</thead>

<tbody>

{tickets.map((t:any)=>(
<tr key={t._id}>

<td>{t.title}</td>

<td>
<StatusBadge type={t.status} label={t.status}/>
</td>

<td>
<StatusBadge type={t.priority} label={t.priority}/>
</td>

</tr>
))}

</tbody>

</table>

</div>

)

}

export default AgentTickets