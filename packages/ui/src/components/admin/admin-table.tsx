import type { ReactNode } from 'react';
import Table from '@mui/material/Table';
import styles from './admin-table.module.css';

type AdminTableProps = {
  children: ReactNode;
  className?: string;
};

export default function AdminTable({ children, className }: AdminTableProps) {
  const tableClassName = className ? `${styles.table} ${className}` : styles.table;
  return <Table className={tableClassName}>{children}</Table>;
}
