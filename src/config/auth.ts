import "dotenv/config";

export default {
  jwt: {
    secret: process.env.JWT_TOKEN_SECRET || "",
    expiresIn: process.env.JWT_TOKEN_EXPIRATION || "",
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || "",
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "",
    expirationInDays:
      Number(process.env.REFRESH_TOKEN_EXPIRATION_IN_DAYS) || 30,
  },
};
