'use client';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export type SettingsListItemProps = {
  icon: React.ReactNode;
  label: React.ReactNode;
  href: string;
  linkComponent: React.ElementType;
  onClick?: () => void;
};

export default function SettingsListItem({
  icon,
  label,
  href,
  linkComponent,
  onClick
}: SettingsListItemProps) {
  return (
    <ListItemButton component={linkComponent} href={href} onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}
