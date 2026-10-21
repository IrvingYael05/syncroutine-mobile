import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useKeepAwake } from "expo-keep-awake";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import {
  ActividadesService,
  ActividadDto,
} from "@/context/services/api/actividades.service";
import { HistorialService } from "@/context/services/api/historial.service";
import CustomModal from "@/components/CustomModal";

export default function PlayerScreen() {
  useKeepAwake();

  const { id: bloqueId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [actividades, setActividades] = useState<ActividadDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "error" as const,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showError = (title: string, message: string) => {
    setModalConfig({ visible: true, title, message, type: "error" });
  };

  const cargarActividades = async () => {
    try {
      const data = await ActividadesService.obtenerPorBloque(
        bloqueId as string,
      );
      const ordenadas = data.sort((a, b) => a.orden - b.orden);
      setActividades(ordenadas);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
      showError(
        "Error de Carga",
        "No pudimos descargar las actividades de este bloque.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (bloqueId) cargarActividades();
  }, [bloqueId]);

  const onRefresh = () => {
    setIsRefreshing(true);
    cargarActividades();
  };

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const deltaSeconds = Math.floor(
          (now - (startTimeRef.current as number)) / 1000,
        );
        setElapsedSeconds(accumulatedTimeRef.current + deltaSeconds);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      accumulatedTimeRef.current = elapsedSeconds;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const registrarYContinuar = async () => {
    if (!user?.id || actividades.length === 0) return;

    setIsRunning(false);
    setIsSaving(true);

    const actividadActual = actividades[currentIndex];

    try {
      await HistorialService.registrarActividad({
        userId: user.id,
        actividadId: actividadActual.id,
        tiempoRealSegundos: elapsedSeconds,
      });

      if (currentIndex < actividades.length - 1) {
        setCurrentIndex(currentIndex + 1);
        resetTimer();
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Error registrando historial:", error);
      showError(
        "Error de Guardado",
        "Hubo un problema registrando tu tiempo. Inténtalo de nuevo.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const resetTimer = () => {
    setElapsedSeconds(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");

    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m}:${s}`;
    }
    return `${m}:${s}`;
  };

  if (isLoading) {
    return (
      <View style={localStyles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (actividades.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={localStyles.centerContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <Icon
          name="cloud-offline-outline"
          size={60}
          color={Colors.textMuted}
          style={{ marginBottom: 16 }}
        />
        <Text style={localStyles.textMuted}>
          No se encontraron actividades.
        </Text>
        <Text style={{ color: Colors.textMuted, fontSize: 14, marginTop: 8 }}>
          Desliza hacia abajo para recargar
        </Text>
        <TouchableOpacity
          style={{ marginTop: 30 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
            Volver al Dashboard
          </Text>
        </TouchableOpacity>
        <CustomModal
          visible={modalConfig.visible}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText="Entendido"
          onConfirm={() => setModalConfig({ ...modalConfig, visible: false })}
        />
      </ScrollView>
    );
  }

  const actividadActual = actividades[currentIndex];
  const isOvertime = elapsedSeconds > actividadActual.tiempoObjetivoSegundos;

  return (
    <SafeAreaView style={localStyles.safeArea}>
      <View style={localStyles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={localStyles.backButton}
        >
          <Icon name="arrow-back" size={28} color={Colors.textMuted} />
        </TouchableOpacity>
        <Text style={localStyles.progressText}>
          {currentIndex + 1} / {actividades.length}
        </Text>
      </View>

      <View style={localStyles.content}>
        <Text style={localStyles.activityTitle}>{actividadActual.nombre}</Text>
        <Text style={localStyles.targetTime}>
          Objetivo: {formatTime(actividadActual.tiempoObjetivoSegundos)}
        </Text>

        <View
          style={[
            localStyles.timerCircle,
            isOvertime && localStyles.timerCircleOvertime,
          ]}
        >
          <Text
            style={[
              localStyles.timerText,
              isOvertime && localStyles.timerTextOvertime,
            ]}
          >
            {formatTime(elapsedSeconds)}
          </Text>
        </View>

        <View style={localStyles.controlsContainer}>
          <TouchableOpacity
            style={[localStyles.controlButton, localStyles.playPauseButton]}
            onPress={toggleTimer}
            disabled={isSaving}
          >
            <Icon
              name={isRunning ? "pause" : "play"}
              size={40}
              color={Colors.background}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              localStyles.controlButton,
              localStyles.playPauseButton,
              localStyles.dangerButton,
            ]}
            onPress={registrarYContinuar}
            disabled={isSaving || elapsedSeconds === 0}
          >
            <Icon
              name={
                currentIndex === actividades.length - 1
                  ? "send-sharp"
                  : "arrow-redo-sharp"
              }
              size={40}
              color={Colors.background}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isSaving && (
        <View style={localStyles.processingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={localStyles.processingText}>
            Registrando progreso...
          </Text>
        </View>
      )}

      <CustomModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Entendido"
        onConfirm={() => setModalConfig({ ...modalConfig, visible: false })}
      />
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  centerContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  textMuted: { color: Colors.textMuted, fontSize: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  backButton: { padding: 8 },
  progressText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  activityTitle: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  targetTime: { color: Colors.textMuted, fontSize: 16, marginBottom: 50 },

  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.background,
    borderWidth: 8,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  timerCircleOvertime: {
    borderColor: Colors.danger,
    shadowColor: Colors.danger,
  },
  timerText: {
    color: Colors.text,
    fontSize: 64,
    fontWeight: "300",
    fontVariant: ["tabular-nums"],
  },
  timerTextOvertime: { color: Colors.danger },

  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    width: "100%",
  },
  controlButton: { justifyContent: "center", alignItems: "center" },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  dangerButton: { backgroundColor: Colors.danger, shadowColor: Colors.danger },
  processingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  processingText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
});
