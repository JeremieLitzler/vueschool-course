export const userIsLoggedIn = () =>
  useState<boolean>('isLoggedIn', () => false);
