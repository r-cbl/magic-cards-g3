import { LoginResponse, MeResponse, Register } from "../../domain/entities/authDTO";
import { CurrentUserClient } from "./currentUser.client";
import { LoginClient } from "./login.client";
import { RegisterClient } from "./register.client";

export class AuthClient {

  private loginClient = new LoginClient();
  private registerClient = new RegisterClient();
  private currentUserClient = new CurrentUserClient();


  login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    return this.loginClient.execute(credentials);
  }

  register(data: Register): Promise<LoginResponse> {
    return this.registerClient.execute(data);
  }

  getCurrentUser(token: string): Promise<MeResponse> {
    return this.currentUserClient.execute(token);
  }
}
