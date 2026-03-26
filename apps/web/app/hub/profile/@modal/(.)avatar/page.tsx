import AvatarEditorModalRoute from '../../../_avatar-editor/avatar-editor-modal-route';
import { getUserProfileFromSession } from '../../../../../lib/auth';
import { updateAvatarAction } from '../../../../../lib/actions/users/update-avatar';

export default async function Page() {
  const userProfile = await getUserProfileFromSession();

  return (
    <AvatarEditorModalRoute
      initialSelection={userProfile.avatar}
      modalPath="/hub/profile/avatar"
      closeHref="/hub/profile"
      onSave={updateAvatarAction}
    />
  );
}
