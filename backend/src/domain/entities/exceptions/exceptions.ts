export class UnauthorizedException extends Error {
    constructor(message: string) {
        super(`${message}`);
        this.name = 'UnauthorizedException';
    }
}
export class UserAlreadyExistsError extends Error {
    constructor(message: string) {
        super(`${message}`);
        this.name = 'UserAlreadyExistsError';
    }
}
export class UserNotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'UserNotFoundError';
    }
  }
