import { AuthSession } from "../../bot/session/AuthSession.entity";
import { RegisterRequest } from "./request/Register.request";

export class RegisterClient {
  async execute(request: RegisterRequest): Promise<AuthSession> {
    const response = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Registration failed: ${err}`);
    }

    return await response.json() as AuthSession;
  }
}
