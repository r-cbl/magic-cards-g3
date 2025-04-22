import { CurrentUserClient } from "./CurrentUser.client";
import { LoginClient } from "./Login.client";
import { RegisterClient } from "./Register.client";
import { RegisterRequest } from "./request/Register.request";
import { CurrentUserResponse } from "./response/CurrentUser.response";
import { AuthSession } from "../../bot/session/AuthSession.entity";

export class AuthClient {

  private loginClient = new LoginClient();
  private registerClient = new RegisterClient();
  private currentUserClient = new CurrentUserClient();


  login(credentials: { email: string; password: string }): Promise<AuthSession> {
    return this.loginClient.execute(credentials);
  }

  register(data: RegisterRequest): Promise<AuthSession> {
    return this.registerClient.execute(data);
  }

  getCurrentUser(token: string): Promise<CurrentUserResponse> {
    return this.currentUserClient.execute(token);
  }
}
