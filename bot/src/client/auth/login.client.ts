import { AuthSession } from "../../bot/session/AuthSession.entity";
import { BaseApiClient } from "../base/BaseApiClient";

export class LoginClient extends BaseApiClient {
  async execute(credentials: { email: string; password: string }): Promise<AuthSession> {
    return this.requestWithBody<AuthSession>(
      "POST",
      "http://localhost:3001/api/auth/login",
      "Invalid email or password. Please try again.",
      credentials,
    );
  }
}
