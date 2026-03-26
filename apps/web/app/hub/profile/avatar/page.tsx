import type { JSX } from 'react';
import AvatarEditorModalRoute from '../../_avatar-editor/avatar-editor-modal-route';
import { getUserProfileFromSession } from '../../../../lib/auth';
import { updateAvatarAction } from '../../../../lib/actions/users/update-avatar';
import ProfilePageContent from '../profile-page-content';

export default async function ProfileAvatarPage(): Promise<JSX.Element> {
  const userProfile = await getUserProfileFromSession();

  return (
    <>
      <ProfilePageContent profile={userProfile} />
      <AvatarEditorModalRoute
        initialSelection={userProfile.avatar}
        modalPath="/hub/profile/avatar"
        closeHref="/hub/profile"
        onSave={updateAvatarAction}
      />
    </>
  );
}
