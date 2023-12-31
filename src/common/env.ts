export default {
  port: Number(process.env.PORT) || 3000,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET!,
  access_token_expiration_in_seconds: 180,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET!,
  refresh_token_expiration_in_days: 14,
};
