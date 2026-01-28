import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { MachineAdminViewModel } from '@repo/view-models/machine-admin';
import AdminTable from '@repo/ui/admin/admin-table';

type AdminMachinesTableProps = {
  machines: MachineAdminViewModel[];
  columns: {
    name: string;
    category: string;
    room: string;
    badgeRequirements: string;
    status: string;
  };
  statusLabelFor: (machine: MachineAdminViewModel) => string;
};

export default function AdminMachinesTable({
  machines,
  columns,
  statusLabelFor
}: AdminMachinesTableProps) {
  return (
    <AdminTable>
      <TableHead>
        <TableRow>
          <TableCell>{columns.name}</TableCell>
          <TableCell>{columns.category}</TableCell>
          <TableCell>{columns.room}</TableCell>
          <TableCell>{columns.badgeRequirements}</TableCell>
          <TableCell>{columns.status}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {machines.map((machine) => (
          <TableRow key={machine.id} hover>
            <TableCell>{machine.name}</TableCell>
            <TableCell>{machine.category}</TableCell>
            <TableCell>{machine.room}</TableCell>
            <TableCell>{machine.badgeRequirementsCount}</TableCell>
            <TableCell>{statusLabelFor(machine)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </AdminTable>
  );
}
