export const formatGeneratedUsername = (firstName: string, lastName: string, suffix: string): string =>
  `${firstName}${lastName}#${suffix}`;
