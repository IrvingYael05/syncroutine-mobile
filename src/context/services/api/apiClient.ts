import { supabase } from "@/context/supabase/supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Función global para hacer peticiones HTTP inyectando automáticamente
 * el token de acceso de Supabase en los Headers.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Obtenemos la sesión fresca de Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = {
    "Content-Type": "application/json",
    ...(session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error API: ${response.status} - ${response.statusText}`);
  }

  // Si no hay contenido, no intentamos parsear JSON
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
