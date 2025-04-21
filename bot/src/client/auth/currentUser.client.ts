// src/client/auth/MeClient.ts
import { MeResponse } from "@/domain/entities/authDTO";

export class CurrentUserClient {
  async execute(token: string): Promise<MeResponse> {
    const response = await fetch("http://localhost:3001/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    return await response.json() as MeResponse;
  }
}
