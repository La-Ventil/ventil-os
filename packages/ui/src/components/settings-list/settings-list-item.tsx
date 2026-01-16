'use client';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export type SettingsListItemProps = {
  icon: React.ReactNode;
  label: React.ReactNode;
  href: string;
  linkComponent: React.ElementType;
};

export default function SettingsListItem({ icon, label, href, linkComponent }: SettingsListItemProps) {
  return (
    <ListItemButton component={linkComponent} href={href}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}
