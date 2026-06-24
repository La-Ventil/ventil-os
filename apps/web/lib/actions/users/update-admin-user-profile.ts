'use server';

import { revalidateTag } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { canManageUsers } from '@repo/application';
import { isUserError } from '@repo/domain/user/user-errors';
import { updateAdminUserProfile, viewUserProfileById } from '@repo/application/users/usecases';
import { AdminAccessLevel, parseAdminUserEditFormInput, type AdminUserEditFormInput } from '@repo/application/forms';
import type { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors } from '@repo/form/zod-errors';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { getServerSession } from '../../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function updateAdminUserProfileAction(
  previousState: FormState<AdminUserEditFormInput>,
  formData: FormData
): Promise<FormState<AdminUserEditFormInput>> {
  const t = await getTranslations();
  const session = await getServerSession();
  const userCanManageUsers = canManageUsers(session?.user);

  if (!session || !userCanManageUsers) {
    return formError(previousState.values, { message: t('user.update.unauthorized') });
  }

  const userId = formData.get('userId');
  if (typeof userId !== 'string') {
    return formError(previousState.values, { message: t('user.update.notFound') });
  }

  const userProfile = await viewUserProfileById(userId);
  if (!userProfile) {
    return formError(previousState.values, { message: t('user.update.notFound') });
  }

  const { success, data, error } = parseAdminUserEditFormInput(formData);
  const values = Object.fromEntries(formData) as unknown as AdminUserEditFormInput;

  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors));
    }

    await updateAdminUserProfile(userId, {
      actorUserId: session.user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      educationLevel: data.educationLevel || null,
      profile: data.profile,
      globalAdmin: data.adminAccessLevel === AdminAccessLevel.Global,
      pedagogicalAdmin: data.adminAccessLevel === AdminAccessLevel.Pedagogical
    });

    revalidateTag('admin-statistics', {});
    return formSuccess(values, t('user.update.success'));
  } catch (e) {
    if (isUserError(e) && e.code === 'user.lastGlobalAdmin') {
      return formError(values, { message: t('user.update.lastGlobalAdmin') });
    }
    if (isUserError(e) && e.code === 'user.cannotChangeOwnAdminAccess') {
      return formError(values, { message: t('user.update.cannotChangeOwnAdminAccess') });
    }
    console.error(e);
    return formError(values, { message: t('user.update.error') });
  }
}
