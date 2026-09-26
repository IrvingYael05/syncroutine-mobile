import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import {
  BloquesService,
  BloqueDto,
} from "@/context/services/api/bloques.service";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const [bloques, setBloques] = useState<BloqueDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const nombreUsuario = user?.user_metadata?.nombre || "Usuario";

  const cargarBloques = async () => {
    if (!user?.id) return;
    try {
      const data = await BloquesService.obtenerBloquesPorUsuario(user.id);
      setBloques(data);
    } catch (error) {
      console.error("Error cargando los bloques:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    cargarBloques();
  }, [user?.id]);

  const onRefresh = () => {
    setIsRefreshing(true);
    cargarBloques();
  };

  return (
    <SafeAreaView style={localStyles.safeArea}>
      <View style={localStyles.header}>
        <View>
          <Text style={localStyles.greeting}>Bienvenido,</Text>
          <Text style={localStyles.headerTitle}>{nombreUsuario}</Text>
        </View>
        <TouchableOpacity
          style={localStyles.logoutButton}
          onPress={() => signOut()}
        >
          <Icon name="log-out-outline" size={24} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={localStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.surface}
          />
        }
      >
        <View style={localStyles.sectionHeader}>
          <Text style={localStyles.sectionTitle}>Tus Bloques de Tareas</Text>
        </View>

        {isLoading ? (
          <View style={localStyles.centerContent}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={localStyles.loadingText}>
              Sincronizando bloques...
            </Text>
          </View>
        ) : bloques.length === 0 ? (
          <View style={localStyles.emptyState}>
            <Icon
              name="cube-outline"
              size={60}
              color={Colors.textMuted}
              style={{ marginBottom: 16 }}
            />
            <Text style={localStyles.emptyStateTitle}>Sin bloques activos</Text>
            <Text style={localStyles.emptyStateDesc}>
              Aún no tienes bloques asignados. Diseña tu rutina en la plataforma
              web y desliza hacia abajo para sincronizar.
            </Text>
          </View>
        ) : (
          bloques.map((bloque) => (
            <View key={bloque.id} style={localStyles.card}>
              <View style={localStyles.cardHeader}>
                <View style={localStyles.iconContainer}>
                  <Icon
                    name={
                      bloque.esAleatorio ? "shuffle-outline" : "list-outline"
                    }
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <View style={localStyles.cardInfo}>
                  <Text style={localStyles.cardTitle}>{bloque.nombre}</Text>
                  <Text style={localStyles.cardSubtitle}>
                    {bloque.esAleatorio
                      ? "Ejecución Aleatoria"
                      : "Ejecución Secuencial"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={localStyles.playButton}
                onPress={() => {
                  router.push({
                    pathname: "/player/[id]",
                    params: { id: bloque.id },
                  });
                }}
              >
                <Icon name="play" size={20} color="#ffffff" />
                <Text style={localStyles.playButtonText}>Iniciar Rutina</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 15,
  },
  greeting: { color: Colors.textMuted, fontSize: 15, marginBottom: 4 },
  headerTitle: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  logoutButton: {
    padding: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  scrollContainer: { paddingHorizontal: 25, paddingBottom: 40, flexGrow: 1 },
  sectionHeader: { marginBottom: 20, marginTop: 10 },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: "bold" },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 16,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  iconContainer: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 14,
    borderRadius: 16,
    marginRight: 15,
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: { color: Colors.textMuted, fontSize: 14, lineHeight: 20 },
  playButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  playButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: { color: Colors.textMuted, marginTop: 12, fontSize: 15 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 60,
  },
  emptyStateTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyStateDesc: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
  },
});
