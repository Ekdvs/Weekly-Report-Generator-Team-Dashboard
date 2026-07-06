import jwt,{ SignOptions } from "jsonwebtoken";



//create jwtpayload interface
export interface JwtPayload{
    userId: string;
    role:"MANAGER"|"TEAM_MEMBER"
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as string;

if(!JWT_SECRET){
    throw new Error ("JWT_SECRET is not defined in environment variables")
}

//signs a jwt for the given payload
export const signToken =(payload:JwtPayload):string=>{
    const option:SignOptions = {
        expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    }
    return jwt.sign(payload,JWT_SECRET,option)

}


//Verifies a JWT and returns the decoded payload.
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};