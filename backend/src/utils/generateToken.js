import jwt from "jsonwebtoken";

const DEFAULT_EXPIRES_IN = "7d";

const generateToken = (userId, role, expiresIn = DEFAULT_EXPIRES_IN) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      sub: userId,
      role,
    },
    secret,
    { expiresIn }
  );
};

export default generateToken;
