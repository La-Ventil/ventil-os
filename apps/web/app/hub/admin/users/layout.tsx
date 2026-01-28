import type { ReactNode } from 'react';

type AdminUsersLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function AdminUsersLayout({ children, modal }: AdminUsersLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
