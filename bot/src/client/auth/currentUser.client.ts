import { CurrentUserResponse } from "./response/CurrentUser.response";

export class CurrentUserClient {
  async execute(token: string): Promise<CurrentUserResponse> {
    const response = await fetch("http://localhost:3001/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    return await response.json() as CurrentUserResponse;
  }
}
