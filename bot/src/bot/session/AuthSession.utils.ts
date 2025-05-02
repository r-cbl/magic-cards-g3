export function parseExpiresIn(expiresIn: string): number {
    if (expiresIn.endsWith("h")) {
      return parseInt(expiresIn) * 60 * 60 * 1000;
    }
    if (expiresIn.endsWith("m")) {
      return parseInt(expiresIn) * 60 * 1000;
    }
    if (expiresIn.endsWith("s")) {
      return parseInt(expiresIn) * 1000;
    }
    // Por defecto, lo tratamos como segundos
    return parseInt(expiresIn) * 1000;
  }