import { JwtPayload } from "../../utils/jwt";

declare global {
  namespace Express {

    interface User {
      id: string;
      email: string;
      role: Role;
    }
    interface Request {
      /** Populated by the `authenticate` middleware after verifying the JWT. */
      user?: JwtPayload;
    }
  }
}

export {};
