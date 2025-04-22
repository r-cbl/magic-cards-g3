import { ApiError } from "../../types/errors";

export abstract class BaseApiClient {
  protected async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit,
    userErrorMessage: string
  ): Promise<T> {
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${(data as { message?: string }).message || 'Unknown error'}`,
          response.status,
          userErrorMessage,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'API request failed',
        500,
        'Unable to connect to the server. Please try again later.',
        error
      );
    }
  }

  protected async post<T>(
    url: string,
    body: unknown,
    userErrorMessage: string,
    token?: string
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.fetchWithErrorHandling<T>(
      url,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      },
      userErrorMessage
    );
  }

  protected async get<T>(
    url: string,
    userErrorMessage: string,
    token?: string
  ): Promise<T> {
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.fetchWithErrorHandling<T>(
      url,
      {
        method: 'GET',
        headers,
      },
      userErrorMessage
    );
  }
}
