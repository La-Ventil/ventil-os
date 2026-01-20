export const ConsentType = {
  TermsOfUse: 'cgu'
} as const;

export type ConsentType = (typeof ConsentType)[keyof typeof ConsentType];
