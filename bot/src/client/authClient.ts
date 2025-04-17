import { userDTO } from "../domain/entities/userDTO";
import { LoginResponse, MeResponse, Register } from "../domain/entities/authDTO";

export class AuthClient {
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    return data as LoginResponse;
  }

  async register(data: Register): Promise<LoginResponse> {
    const response = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Registration failed: ${err}`);
    }

    const result = await response.json();
    return result as LoginResponse;
  }

  async getCurrentUser(token: string): Promise<MeResponse> {
    const response = await fetch("http://localhost:3001/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const data = await response.json();
    return data as MeResponse;
  }
}
