'use server';

import { getTranslations } from 'next-intl/server';
import { nanoid } from 'nanoid';
import { prismaClient, Prisma, Profile, ConsentType, StudentProfile, ExternalProfile } from '@repo/db';
import { SignupFormData, signupFormDataSchema } from '@repo/domain/models/forms/signup-form-data';
import { ProfileType } from '@repo/domain/profile-type';
import { FormState } from '@repo/ui/form-state';
import { hashSecret } from '../security';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';

export async function registerUser(
  previousState: FormState<SignupFormData>,
  formData: FormData
): Promise<FormState<SignupFormData>> {
  const t = await getTranslations();
  const { success, data, error } = signupFormDataSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as SignupFormData;
  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      return {
        message: fieldErrorsToSingleMessage(fieldErrors),
        isValid: false,
        fieldErrors,
        values
      };
    }

    const signupFormData: SignupFormData = data;
    const { salt, hashedSecret, iterations } = await hashSecret(signupFormData.password);
    let profile = Profile.student;
    let studentProfile: StudentProfile | null = null;
    let externalProfile: ExternalProfile | null = null;

    switch (signupFormData.profile) {
      case ProfileType.Ventilacteur:
        profile = Profile.student;
        studentProfile = StudentProfile.ventilactor;
        break;
      case ProfileType.HighSchoolStudent:
        profile = Profile.student;
        studentProfile = StudentProfile.visitor;
        break;
      case ProfileType.Teacher:
        profile = Profile.teacher;
        break;
      case ProfileType.Contributor:
        profile = Profile.external;
        externalProfile = ExternalProfile.contributor;
        break;
      case ProfileType.Visitor:
        profile = Profile.external;
        externalProfile = ExternalProfile.visitor;
        break;
      default:
        profile = Profile.student;
        studentProfile = StudentProfile.visitor;
    }

    let userCreateInput: Prisma.UserCreateInput = {
      name: signupFormData.lastName,
      email: signupFormData.email,
      username: `${signupFormData.firstName}${signupFormData.lastName}#${nanoid()}`,
      firstName: signupFormData.firstName,
      lastName: signupFormData.lastName,
      educationLevel: signupFormData.educationLevel,
      password: hashedSecret,
      salt,
      iterations,
      profile,
      studentProfile,
      externalProfile,
      consents: {
        create: {
          accepted: signupFormData.terms === 'on',
          acceptedAt: new Date(),
          type: ConsentType.terms
        }
      }
    };
    await prismaClient.user.create({
      data: userCreateInput
    });

    return {
      values,
      message: t('signup.success'),
      isValid: true,
      fieldErrors: {}
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      const fieldErrors = {
        email: [
          t('validation.emailAlreadyUsed', {
            defaultMessage: 'Cette adresse email est déjà utilisée.'
          })
        ]
      };

      return {
        message: fieldErrorsToSingleMessage(fieldErrors),
        isValid: false,
        fieldErrors,
        values
      };
    }

    console.error(e);
    return {
      message: t('signup.error'),
      isValid: false,
      fieldErrors: {},
      values
    };
  }
}
