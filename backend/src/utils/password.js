import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword) => {
  if (!plainPassword) {
    throw new Error("Password is required for hashing");
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    throw new Error("Both plain and hashed passwords are required for comparison");
  }
  return bcrypt.compare(plainPassword, hashedPassword);
};
