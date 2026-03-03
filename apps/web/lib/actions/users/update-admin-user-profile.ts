'use server';

import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { canManageUsers } from '@repo/application';
import { updateProfile, viewUserProfileById } from '@repo/application/users/usecases';
import { parseAdminProfileFormInput, type AdminProfileFormInput } from '@repo/application/forms';
import type { UserRole } from '@repo/domain/user/user-role';
import type { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors } from '@repo/form/zod-errors';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { getServerSession } from '../../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function updateAdminUserProfileAction(
  previousState: FormState<AdminProfileFormInput>,
  formData: FormData
): Promise<FormState<AdminProfileFormInput>> {
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

  const { success, data, error } = parseAdminProfileFormInput(formData);
  const values = Object.fromEntries(formData) as unknown as AdminProfileFormInput;

  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors));
    }

    await updateProfile(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      educationLevel: data.educationLevel,
      profile: data.profile as UserRole
    });
    revalidatePath('/hub/admin/users', 'layout');

    return formSuccess(values, t('user.update.success'));
  } catch (e) {
    console.error(e);
    return formError(values, { message: t('user.update.error') });
  }
}
