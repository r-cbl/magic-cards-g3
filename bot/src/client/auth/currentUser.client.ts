import { BaseApiClient } from "../base/BaseApiClient";
import { CurrentUserResponse } from "./response/CurrentUser.response";

export class CurrentUserClient extends BaseApiClient{
  async execute(token: string): Promise<CurrentUserResponse> {
  return this.get<CurrentUserResponse>(
    "http://localhost:3001/api/auth/me",
    "Unauthorized",
    token
    );
  }
}
