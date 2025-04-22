import { AuthSession } from "../../bot/session/AuthSession.entity";

export class LoginClient {
  async execute(credentials: { email: string; password: string }): Promise<AuthSession> {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    return await response.json() as AuthSession;
  }
}
