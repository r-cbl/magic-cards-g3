export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Helper function for API requests
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  // Default headers
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  // Get token from localStorage if available (client-side only)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tokens")
    if (token) {
      try {
        const tokenData = JSON.parse(token)
        if (tokenData.accessToken) {
          headers["Authorization"] = `Bearer ${tokenData.accessToken}`
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage")
      }
    }
  }

  // Merge options
  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, config)

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    // Parse JSON response
    const data = await response.json()
    return data as T
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Convenience methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
