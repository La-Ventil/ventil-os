import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { MachineAdminStatus, type MachineAdminViewModel } from '@repo/view-models/machine-admin';
import AdminTable from '@repo/ui/admin/admin-table';
import MachineQuickActions from './machine-quick-actions';
import styles from './admin-machines-table.module.css';

type AdminMachinesTableProps = {
  machines: MachineAdminViewModel[];
  columns: {
    actions: string;
    image: string;
    name: string;
    category: string;
    room: string;
    badgeRequirements: string;
    status: string;
  };
  statusLabelFor: (machine: MachineAdminViewModel) => string;
  actionLabels: {
    manage: string;
    edit: string;
    activate: string;
    deactivate: string;
  };
};

export default function AdminMachinesTable({
  machines,
  columns,
  statusLabelFor,
  actionLabels
}: AdminMachinesTableProps) {
  return (
    <AdminTable>
      <TableHead>
        <TableRow>
          <TableCell>{columns.actions}</TableCell>
          <TableCell>{columns.image}</TableCell>
          <TableCell>{columns.name}</TableCell>
          <TableCell>{columns.category}</TableCell>
          <TableCell>{columns.room}</TableCell>
          <TableCell>{columns.badgeRequirements}</TableCell>
          <TableCell>{columns.status}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {machines.map((machine) => (
          <TableRow
            key={machine.id}
            hover
            className={machine.status === MachineAdminStatus.Inactive ? styles.inactiveRow : undefined}
          >
            <TableCell>
              <MachineQuickActions machine={machine} labels={actionLabels} />
            </TableCell>
            <TableCell>
              {machine.imageUrl ? (
                <img
                  src={machine.imageUrl}
                  alt={machine.name}
                  width={40}
                  height={40}
                  style={{ objectFit: 'contain', display: 'block' }}
                />
              ) : (
                '—'
              )}
            </TableCell>
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
