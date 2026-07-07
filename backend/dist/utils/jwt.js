import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d');
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
//signs a jwt for the given payload
export const signToken = (payload) => {
    const option = {
        expiresIn: JWT_EXPIRES_IN,
    };
    return jwt.sign(payload, JWT_SECRET, option);
};
//Verifies a JWT and returns the decoded payload.
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
