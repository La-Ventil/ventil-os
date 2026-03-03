'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { openBadgeUpdateRequestSchema, type OpenBadgeUpdateRequest } from '@repo/application/forms';
import OpenBadgeForm from '@repo/ui/forms/open-badge.form';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import type { OpenBadgeEditViewModel } from '@repo/view-models/open-badge-edit';
import { updateOpenBadgeAction } from '../../../../../../lib/actions/open-badges/update-open-badge';

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
    action: updateOpenBadgeAction,
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

  return <OpenBadgeForm formState={formState} badgeId={badge.id} imagePreviewUrl={badge.coverImage ?? undefined} />;
}
