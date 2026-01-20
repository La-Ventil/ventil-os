import { redirect } from 'next/navigation';

export default async function Page() {
  redirect('/hub/settings/profile');
}
