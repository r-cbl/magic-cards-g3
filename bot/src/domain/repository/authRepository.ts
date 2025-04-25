import { LoginResponse } from "../../domain/entities/authDTO";

export class InMemoryLoginContextRepository {
  private store: Map<string, LoginResponse> = new Map();

  save(userId: string, response: LoginResponse): void {
    this.store.set(userId, response);
  }

  get(userId: string): LoginResponse | undefined {
    return this.store.get(userId);
  }

  delete(userId: string): void {
    this.store.delete(userId);
  }

  clear(): void {
    this.store.clear();
  }
}
