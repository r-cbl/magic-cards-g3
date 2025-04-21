// src/client/auth/RegisterClient.ts
import { LoginResponse, Register } from "@/domain/entities/authDTO";

export class RegisterClient {
  async execute(data: Register): Promise<LoginResponse> {
    const response = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Registration failed: ${err}`);
    }

    return await response.json() as LoginResponse;
  }
}
