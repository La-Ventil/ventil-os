import type { ReactNode } from 'react';

type AdminUserOpenBadgesLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export default function AdminUserOpenBadgesLayout({ children, modal }: AdminUserOpenBadgesLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
