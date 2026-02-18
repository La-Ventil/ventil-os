import { hashSecret } from '@repo/crypto';
import { ConsentType, userRepository } from '@repo/db';
import { generateToken } from './tokens';
import { isUniqueConstraintError, resolveProfile } from './mappers';

export type RegisterUserAccountInput = {
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  educationLevel?: string | null;
  profileType: string;
  password: string;
  termsAccepted: boolean;
};

export type RegisterUserAccountResult = { ok: true } | { ok: false; reason: 'email-already-used' };

const generateUsername = (firstName: string, lastName: string) => `${firstName}${lastName}#${generateToken(6)}`;

export const registerUserAccount = async (input: RegisterUserAccountInput): Promise<RegisterUserAccountResult> => {
  const { profile, studentProfile, externalProfile } = resolveProfile(input.profileType);
  const username = input.username ?? generateUsername(input.firstName, input.lastName);
  const { salt, hashedSecret, iterations } = await hashSecret(input.password);

  try {
    await userRepository.createUser({
      name: input.lastName,
      email: input.email,
      username,
      firstName: input.firstName,
      lastName: input.lastName,
      educationLevel: input.educationLevel ?? null,
      password: hashedSecret,
      salt,
      iterations,
      profile,
      studentProfile,
      externalProfile,
      consents: {
        create: {
          accepted: input.termsAccepted,
          acceptedAt: new Date(),
          type: ConsentType.terms
        }
      }
    });

    return { ok: true };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, reason: 'email-already-used' };
    }

    throw error;
  }
};
