import type { JSX } from 'react';
import AvatarEditorModalRoute from '../../../_avatar-editor/avatar-editor-modal-route';

export default function ProfileAvatarModalPage(): JSX.Element {
  return <AvatarEditorModalRoute modalPath="/hub/profile/avatar" closeHref="/hub/profile" />;
}
