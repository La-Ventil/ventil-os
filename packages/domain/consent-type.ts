export const ConsentType = {
  TermsOfUse: 'terms'
} as const;

export type ConsentType = (typeof ConsentType)[keyof typeof ConsentType];
