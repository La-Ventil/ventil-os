export const ConsentementType = {
    CGU: 'cgu',
} as const;

export type ConsentementType = (typeof ConsentementType)[keyof typeof ConsentementType];