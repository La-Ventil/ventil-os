import type { JSX } from 'react';
import { redirect } from 'next/navigation';

export default async function Page(): Promise<JSX.Element> {
  redirect('/hub/settings/profile');
}
