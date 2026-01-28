import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  redirect('/hub/admin/machines');
}
