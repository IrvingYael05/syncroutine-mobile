import { fetchApi } from "./apiClient";

export interface HistorialDto {
  id?: string; // Opcional al crear
  userId: string; // UUID
  actividadId: string; // UUID
  tiempoRealSegundos: number;
  fechaCompletado?: string; // ISO 8601 String
}

export const HistorialService = {
  /**
   * Registra una nueva marca de tiempo en el historial
   * Consume: POST /api/historial
   */
  registrarActividad: async (dto: HistorialDto): Promise<HistorialDto> => {
    return fetchApi(`/historial`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },
};
