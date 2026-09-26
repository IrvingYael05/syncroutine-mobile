import { fetchApi } from "./apiClient";

export interface BloqueDto {
  id: string; // UUID
  userId: string; // UUID
  nombre: string;
  esAleatorio: boolean;
}

export const BloquesService = {
  /**
   * Obtiene todos los bloques asociados a un usuario
   * Consume: GET /api/bloques/usuario/{userId}
   */
  obtenerBloquesPorUsuario: async (userId: string): Promise<BloqueDto[]> => {
    return fetchApi(`/bloques/usuario/${userId}`);
  },

  /**
   * Obtiene un bloque específico por su ID
   * Consume: GET /api/bloques/{id}
   */
  obtenerBloquePorId: async (id: string): Promise<BloqueDto> => {
    return fetchApi(`/bloques/${id}`);
  },
};
