"use no memo";

import React from "react";
import {
  FlexWidget,
  TextWidget,
  IconWidget,
} from "react-native-android-widget";

export interface SyncRoutineWidgetProps {
  rachaDias?: string | number;
  tiempoTotal?: string;
  tiempoPromedio?: string;
  isLoggedIn?: boolean;
}

export function SyncRoutineWidget({
  rachaDias = 0,
  tiempoTotal = "0h 0m",
  tiempoPromedio = "0h 0m",
  isLoggedIn = true,
}: SyncRoutineWidgetProps) {
  if (!isLoggedIn) {
    return (
      <FlexWidget
        style={{
          height: "match_parent",
          width: "match_parent",
          backgroundColor: "#1e293b",
          borderRadius: 24,
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
        clickAction="OPEN_APP" // <-- Abre la app para iniciar sesión
      >
        <IconWidget
          font="MaterialIcons"
          icon="lock_outline"
          size={36}
          style={{ color: "#94a3b8" }}
        />
        <TextWidget
          text="Inicia sesión en SyncRoutine"
          style={{ fontSize: 15, color: "#94a3b8", marginTop: 12 }}
        />
      </FlexWidget>
    );
  }

  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "#1e293b",
        borderRadius: 24,
        padding: 20,
        flexDirection: "column",
      }}
      clickAction="OPEN_APP" // <-- Abre la app al tocar cualquier parte del widget
    >
      {/* HEADER */}
      <FlexWidget
        style={{
          width: "match_parent",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextWidget
          text="SyncRoutine"
          style={{ fontSize: 18, color: "#10b981", fontWeight: "bold" }}
        />
        <IconWidget
          font="MaterialIcons"
          icon="sync"
          size={20}
          style={{ color: "#94a3b8" }}
        />
      </FlexWidget>

      {/* CONTENEDOR DE MÉTRICAS */}
      <FlexWidget
        style={{
          flex: 1,
          width: "match_parent",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        {/* Racha */}
        <FlexWidget
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconWidget
            font="MaterialIcons"
            icon="local_fire_department"
            size={32}
            style={{ color: "#f59e0b" }}
          />
          <TextWidget
            text={`${rachaDias}`}
            style={{
              fontSize: 26,
              color: "#ffffff",
              fontWeight: "bold",
              marginTop: 6,
            }}
          />
          <TextWidget
            text="Racha"
            style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}
          />
        </FlexWidget>

        {/* Separador */}
        <FlexWidget
          style={{ width: 1, height: 60, backgroundColor: "#334155" }}
        />

        {/* Tiempo Total */}
        <FlexWidget
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconWidget
            font="MaterialIcons"
            icon="timer"
            size={32}
            style={{ color: "#3b82f6" }}
          />
          <TextWidget
            text={`${tiempoTotal}`}
            style={{
              fontSize: 22,
              color: "#ffffff",
              fontWeight: "bold",
              marginTop: 6,
            }}
          />
          <TextWidget
            text="Total"
            style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}
          />
        </FlexWidget>

        {/* Separador */}
        <FlexWidget
          style={{ width: 1, height: 60, backgroundColor: "#334155" }}
        />

        {/* Promedio */}
        <FlexWidget
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconWidget
            font="MaterialIcons"
            icon="bar_chart"
            size={32}
            style={{ color: "#8b5cf6" }}
          />
          <TextWidget
            text={`${tiempoPromedio}`}
            style={{
              fontSize: 22,
              color: "#ffffff",
              fontWeight: "bold",
              marginTop: 6,
            }}
          />
          <TextWidget
            text="Promedio"
            style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
