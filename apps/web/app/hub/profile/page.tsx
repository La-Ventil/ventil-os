import type { JSX } from 'react';
import { getUserProfileFromSession } from '../../../lib/auth';
import ProfilePageContent from './_components/profile-page-content';

export default async function Page(): Promise<JSX.Element> {
  const userProfile = await getUserProfileFromSession();

  return <ProfilePageContent profile={userProfile} />;
}
