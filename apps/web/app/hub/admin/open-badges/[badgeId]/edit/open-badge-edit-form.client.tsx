'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { openBadgeUpdateRequestSchema, type OpenBadgeUpdateRequest } from '@repo/application/forms';
import OpenBadgeCreateForm from '@repo/ui/forms/open-badge-create.form';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import type { OpenBadgeEditViewModel } from '@repo/view-models/open-badge-edit';
import { updateOpenBadge } from '../../../../../../lib/actions/update-open-badge';

type OpenBadgeEditFormClientProps = {
  badge: OpenBadgeEditViewModel;
};

export default function OpenBadgeEditFormClient({ badge }: OpenBadgeEditFormClientProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();

  const initialState = createFormState<OpenBadgeUpdateRequest>({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    imageFile: undefined,
    levels: badge.levels.length ? badge.levels : [{ title: '', description: '' }],
    deliveryEnabled: false,
    deliveryLevel: '',
    activationEnabled: badge.activationEnabled
  });

  const formState = useFormActionState({
    action: updateOpenBadge,
    initialState,
    schema: openBadgeUpdateRequestSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });

  const [state] = formState;

  useEffect(() => {
    if (state.success) {
      router.push('/hub/admin/open-badges');
    }
  }, [router, state.success]);

  return (
    <OpenBadgeCreateForm formState={formState} badgeId={badge.id} imagePreviewUrl={badge.coverImage ?? undefined} />
  );
}
