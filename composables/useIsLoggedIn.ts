/**
 * OBSOLETE: use 'useUserStore' instead.
 *
 * @returns The state
 */
export const userIsLoggedIn = () =>
  useState<boolean>('isLoggedIn', () => false);
