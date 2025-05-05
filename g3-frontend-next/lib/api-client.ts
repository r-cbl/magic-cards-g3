// Configura la URL base de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Helper function para realizar solicitudes a la API
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Headers predeterminados
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Obtener el token de localStorage si está disponible (solo en cliente)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tokens");
    if (token) {
      try {
        const tokenData = JSON.parse(token);
        if (tokenData.accessToken) {
          headers["Authorization"] = `Bearer ${tokenData.accessToken}`;
        }
      } catch (e) {
        console.error("Error al analizar los datos del usuario desde localStorage");
      }
    }
  }

  // Combina las opciones con los headers
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Manejar errores HTTP (por ejemplo, 401 o 403)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Si el error es de autenticación (401 o 403), borrar la sesión
      if (response.status === 401 || response.status === 403) {
        // Eliminar token de localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("tokens");
        }

        // Redirigir al usuario a la página de login
        window.location.href = "/login"; // O usa router.push("/login") si usas Next.js Router
      }

      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    // Parsear la respuesta JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Manejo global de errores
    console.error(error);
    throw error; // Vuelve a lanzar el error para manejarlo en el nivel superior
  }
}

// Métodos convenientes para los métodos HTTP comunes
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};


