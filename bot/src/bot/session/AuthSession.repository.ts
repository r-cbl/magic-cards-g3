import { AuthSession } from "./AuthSession.entity";

export interface AuthSessionRepository {
  save(userId: string, session: AuthSession): void | Promise<void>;
  get(userId: string): AuthSession | undefined | Promise<AuthSession | undefined>;
  delete(userId: string): void | Promise<void>;
  clear(): void | Promise<void>;
}
