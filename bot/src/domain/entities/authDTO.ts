export interface LoginResponse{
  user: {
    id: string;
    name: string;
    email: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
};

export interface MeResponse{
  user: {
    id: string,
    email: string
  }
}
export interface Register {
  name: string,
  email: string,
  password: string
}

