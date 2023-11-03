import { sign, verify } from "jsonwebtoken";
import { User } from "../models/User";

export class TokenHandler {
  private static secret = process.env.JWT_SECRET!;
  
  static async generateToken({
    user,
    payload,
    expiresIn,
  }: {
    user: User;
    payload: object;
    expiresIn: string | number;
  }): Promise<string> {
    return sign(payload, this.secret, {
      subject: user.id,
      expiresIn: expiresIn,
    });
  }

  static async verifyToken(token: string) {
    return verify(token, this.secret);
  }
}
