import { fetchApi } from "./apiClient";

export interface ActividadDto {
  id: string; // UUID
  bloqueId: string; // UUID
  nombre: string;
  tiempoObjetivoSegundos: number;
  orden: number;
}

export const ActividadesService = {
  /**
   * Obtiene todas las actividades asociadas a un bloque
   * Consume: GET /api/actividades/bloque/{bloqueId}
   */
  obtenerPorBloque: async (bloqueId: string): Promise<ActividadDto[]> => {
    return fetchApi(`/actividades/bloque/${bloqueId}`);
  },
};
