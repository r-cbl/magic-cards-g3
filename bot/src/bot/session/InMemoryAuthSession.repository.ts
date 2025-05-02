import { AuthSession } from "./AuthSession.entity";
import { AuthSessionRepository } from "./AuthSession.repository";
import { parseExpiresIn } from "./AuthSession.utils";

export class InMemoryAuthSessionRepository implements AuthSessionRepository {
  private store: Map<string, AuthSession> = new Map();

  save(userId: string, response: AuthSession): void {
    const ms = parseExpiresIn(response.tokens.expiresIn);
    response.tokens.expirationDate  = new Date(Date.now() + ms);
    this.store.set(userId, response);
  }

  get(userId: string): AuthSession | undefined {
    return this.store.get(userId);
  }

  delete(userId: string): void {
    this.store.delete(userId);
  }

  clear(): void {
    this.store.clear();
  }
  
}
