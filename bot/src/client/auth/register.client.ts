import { AuthSession } from "../../bot/session/AuthSession.entity";
import { BaseApiClient } from "../base/BaseApiClient";
import { RegisterRequest } from "./request/Register.request";

export class RegisterClient extends BaseApiClient{
  async execute(request: RegisterRequest): Promise<AuthSession> {
    return this.requestWithBody<AuthSession>(
      "POST",
      "/auth/register",
      "Invalid email or password. Please try again.",
      request,
    );
  }
}
