import { verifySecret } from '@repo/crypto';
import { userRepository } from '@repo/db';
import { Email } from '@repo/domain/user/email';
import { User } from '@repo/domain/user/user';
import { prismaClient } from '../prisma';
import { generateToken } from './tokens';
import { selectDomainUser, toDomainUser } from './mappers';

const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const createEmailVerificationToken = async (email: string) => {
  const token = generateToken(24);
  const expires = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS);

  await prismaClient.verificationToken.deleteMany({
    where: { identifier: email }
  });

  await prismaClient.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  });

  return { token, expires };
};

export type EmailVerificationResult =
  | { ok: true; email: string }
  | { ok: false; reason: 'invalid' | 'expired' | 'not-found' };

export const requestEmailVerification = async (email: string) => {
  return createEmailVerificationToken(email);
};

export type RequestEmailChangeResult =
  | { ok: true; email: string; token: string }
  | { ok: false; reason: 'email-already-used' };

export const requestEmailChange = async (userId: string, email: string): Promise<RequestEmailChangeResult> => {
  const existing = await prismaClient.user.findFirst({
    where: {
      OR: [{ email }, { pendingEmail: email }]
    },
    select: { id: true }
  });

  if (existing && existing.id !== userId) {
    return { ok: false, reason: 'email-already-used' };
  }

  const record = await prismaClient.user.findUnique({
    where: { id: userId },
    select: selectDomainUser
  });

  if (!record) {
    throw new Error('User not found');
  }

  const domainUser = toDomainUser(record);
  const nextEmail = Email.from(email);

  if (domainUser.email === nextEmail) {
    const { token } = await createEmailVerificationToken(nextEmail);
    return { ok: true, email: nextEmail, token };
  }

  const updated = User.requestEmailChange(domainUser, nextEmail);

  await prismaClient.user.update({
    where: { id: userId },
    data: { pendingEmail: updated.pendingEmail ?? null }
  });

  const { token } = await createEmailVerificationToken(nextEmail);

  return { ok: true, email: nextEmail, token };
};

export type RequestEmailChangeWithPasswordResult =
  | RequestEmailChangeResult
  | { ok: false; reason: 'not-found' | 'invalid-password' };

export const requestEmailChangeWithPassword = async (
  currentEmail: string,
  currentPassword: string,
  newEmail: string
): Promise<RequestEmailChangeWithPasswordResult> => {
  const credentials = await userRepository.findUserCredentialsByEmail(currentEmail);

  if (!credentials) {
    return { ok: false, reason: 'not-found' };
  }

  const isValid = await verifySecret(
    currentPassword,
    credentials.password,
    credentials.salt,
    credentials.iterations
  );

  if (!isValid) {
    return { ok: false, reason: 'invalid-password' };
  }

  return requestEmailChange(credentials.id, newEmail);
};

export type ResendEmailChangeVerificationResult =
  | { ok: true; email: string; token: string }
  | { ok: false; reason: 'no-pending-email' };

export const resendEmailChangeVerification = async (userId: string): Promise<ResendEmailChangeVerificationResult> => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: selectDomainUser
  });

  if (!user) {
    return { ok: false, reason: 'no-pending-email' };
  }

  const domainUser = toDomainUser(user);

  if (!User.hasPendingEmail(domainUser)) {
    return { ok: false, reason: 'no-pending-email' };
  }

  const pendingEmail = domainUser.pendingEmail as Email;
  const { token } = await createEmailVerificationToken(pendingEmail);
  return { ok: true, email: pendingEmail, token };
};

export type CancelEmailChangeResult = { ok: true } | { ok: false; reason: 'no-pending-email' };

export const cancelEmailChange = async (userId: string): Promise<CancelEmailChangeResult> => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: selectDomainUser
  });

  if (!user) {
    return { ok: false, reason: 'no-pending-email' };
  }

  const domainUser = toDomainUser(user);
  if (!User.hasPendingEmail(domainUser)) {
    return { ok: false, reason: 'no-pending-email' };
  }

  const pendingEmail = domainUser.pendingEmail as Email;
  const updated = User.clearPendingEmail(domainUser);

  await prismaClient.user.update({
    where: { id: userId },
    data: { pendingEmail: updated.pendingEmail ?? null }
  });

  await prismaClient.verificationToken.deleteMany({
    where: { identifier: pendingEmail }
  });

  return { ok: true };
};

export const verifyEmailToken = async (email: string, token: string): Promise<EmailVerificationResult> => {
  const record = await prismaClient.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token
      }
    }
  });

  if (!record) {
    return { ok: false, reason: 'invalid' };
  }

  if (record.expires < new Date()) {
    await prismaClient.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token
        }
      }
    });
    return { ok: false, reason: 'expired' };
  }

  const user = await prismaClient.user.findFirst({
    where: {
      OR: [{ email }, { pendingEmail: email }]
    },
    select: selectDomainUser
  });

  if (!user) {
    return { ok: false, reason: 'not-found' };
  }

  let updatedUser: User;
  try {
    updatedUser = User.confirmEmail(toDomainUser(user), Email.from(email));
  } catch (error) {
    await prismaClient.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token
        }
      }
    });
    return { ok: false, reason: 'invalid' };
  }

  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      email: updatedUser.email,
      pendingEmail: updatedUser.pendingEmail ?? null,
      emailVerified: updatedUser.emailVerifiedAt ?? new Date()
    }
  });

  await prismaClient.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token
      }
    }
  });

  return { ok: true, email };
};
