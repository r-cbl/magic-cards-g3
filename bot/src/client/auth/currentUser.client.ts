import { BaseApiClient } from "../base/BaseApiClient";
import { CurrentUserResponse } from "./response/CurrentUser.response";

export class CurrentUserClient extends BaseApiClient{
  async execute(token: string): Promise<CurrentUserResponse> {
  return this.requestWithOutBody<CurrentUserResponse>(
    "GET",
    "http://localhost:3001/api/auth/me",
    "Unauthorized",
    token
    );
  }
}
