export function isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
export function isValidPasswordFormat(password: string, minLength: number = 6): boolean {
    return password.length >= minLength;
  }
  