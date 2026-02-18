import { randomBytes } from 'node:crypto';

export const generateToken = (bytes: number) => randomBytes(bytes).toString('base64url');
