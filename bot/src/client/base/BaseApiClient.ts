import { ApiError } from "../../types/errors";
import { GetRequest } from "../publications/request/get.request";

export abstract class BaseApiClient {
  protected async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit,
    userErrorMessage: string,
    token?: string
  ): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(url, options);
      const text = await response.text();
  
      let data: any = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          throw new ApiError(
            'Invalid JSON in response',
            response.status,
            userErrorMessage,
            parseError
          );
        }
      }
  
      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${(data as { message?: string })?.message || 'Unknown error'}`,
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
  

  protected async requestWithBody<T>(
    method: "POST" | "PUT",
    url: string,
    userErrorMessage: string,
    body?: unknown,
    token?: string
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    console.log("url: ", url,"Method: ", method,"Date: ",Date.now());
    return this.fetchWithErrorHandling<T>(
      url,
      {
        method,
        headers,
        body: JSON.stringify(body),
      },
      userErrorMessage
    );
  }
  

  protected async requestWithOutBody<T>(
    method: "GET" | "DELETE",
    url: string,
    userErrorMessage: string,
    token?: string,
    queryParams?: Record<string, any>,
  ): Promise<T> {
    const headers: Record<string, string> = {};
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    if (queryParams) {
      const queryString = new URLSearchParams(this.buildQueryParams(queryParams)).toString();
      url += `?${queryString}`;
    }
    console.log("url: ", url,"Method: ", method,"Date: ",Date.now());
    return this.fetchWithErrorHandling<T>(
      url,
      {
        method: method,
        headers,
      },
      userErrorMessage
    );
  }
  

  private buildQueryParams(params: Record<string, any>): Record<string, string> {
    const queryParams: Record<string, string> = {};
  
    for (const key in params) {
      const value = params[key];
  
      if (value === undefined || value === null) {
        continue; // Ignorar valores nulos o undefined
      }
  
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParams[key] = value.join(',');
        }
      } else if (value instanceof Date) {
        queryParams[key] = value.toISOString();
      } else {
        queryParams[key] = String(value);
      }
    }
  
    return queryParams;
  }
  
}
