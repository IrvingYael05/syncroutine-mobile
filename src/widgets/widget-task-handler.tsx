import React from "react";
import { WidgetTaskHandlerProps } from "react-native-android-widget";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SyncRoutineWidget } from "./SyncRoutineWidget";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Convierte segundos a "1h 30m"
const formatSecondsToHoursMinutes = (
  totalSeconds: number | undefined,
): string => {
  if (!totalSeconds) return "0m";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

export async function widgetTaskHandler({
  renderWidget,
}: WidgetTaskHandlerProps) {
  try {
    const token = await AsyncStorage.getItem("widget_token");
    const userId = await AsyncStorage.getItem("widget_userId");

    // Si no hay sesión, dibujamos la vista bloqueada
    if (!token || !userId) {
      renderWidget(<SyncRoutineWidget isLoggedIn={false} />);
      return;
    }

    const response = await fetch(`${API_URL}/historial/resumen/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error de red");

    const data = await response.json();

    // Dibujamos con la data real mapeada de tu DTO
    renderWidget(
      <SyncRoutineWidget
        isLoggedIn={true}
        rachaDias={data.rachaDiasActivos || 0}
        tiempoTotal={formatSecondsToHoursMinutes(data.tiempoTotalSegundos)}
        tiempoPromedio={formatSecondsToHoursMinutes(data.tiempoPromedioDiario)}
      />,
    );
  } catch (error) {
    console.error("Error en Widget Fetch:", error);
    // Fallback: Si no hay internet en ese momento, dibuja el widget por defecto para no crashear
    renderWidget(<SyncRoutineWidget isLoggedIn={true} />);
  }
}
