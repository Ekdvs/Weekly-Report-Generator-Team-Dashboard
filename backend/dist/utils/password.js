import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
//password hashed
export const hashPassword = async (plain) => {
    return bcrypt.hash(plain, SALT_ROUNDS);
};
//compare password
export const comparePassword = async (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
};
