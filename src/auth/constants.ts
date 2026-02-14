export const jwtConstants = {
  secret:
    process.env.JWT_SECRET || 'comandeira-secret-key-change-in-production',
  expiresIn: '3h',
};
