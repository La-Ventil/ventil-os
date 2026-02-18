import { hashSecret } from '@repo/crypto';
import { ConsentType, isPrismaUniqueConstraintError, mapProfileTypeToProfileRecord, userRepository } from '@repo/db';
import { formatGeneratedUsername } from '@repo/domain/user/user-username';
import { createEmailVerificationToken } from '../email-tokens';
import { generateToken } from '../tokens';
import type { Command } from '../../usecase';

export type SignUpInput = {
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  educationLevel?: string | null;
  profileType: string;
  password: string;
  termsAccepted: boolean;
};

export type SignUpResult =
  | { ok: true; token: string; expires: Date }
  | { ok: false; reason: 'email-already-used' };

export const signUp: Command<[SignUpInput], SignUpResult> = async (input: SignUpInput) => {
  const { profile, studentProfile, externalProfile } = mapProfileTypeToProfileRecord(input.profileType);
  const username =
    input.username ?? formatGeneratedUsername(input.firstName, input.lastName, generateToken(6));
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

    const { token, expires } = await createEmailVerificationToken(input.email);

    return { ok: true, token, expires };
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) {
      return { ok: false, reason: 'email-already-used' };
    }

    throw error;
  }
};
