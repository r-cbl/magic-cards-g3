export interface AuthSession {
    user: {
      id: string;
      name: string;
      email: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
      expirationDate : Date;
    };
  };