import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons as Icon } from "@expo/vector-icons";
import { globalStyles, Colors } from "@/constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={localStyles.safeArea}>
      <ScrollView
        contentContainerStyle={localStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={localStyles.hero}>
          <View style={localStyles.logoContainer}>
            <Icon name="timer" size={55} color={Colors.background} />
          </View>
          <Text
            style={[
              globalStyles.title,
              { marginBottom: 40 },
              localStyles.heroTitleHighlight,
            ]}
          >
            SyncRoutine
          </Text>

          <Text style={localStyles.heroTitle}>
            Sincroniza tu enfoque en{"\n"}
            <Text style={localStyles.heroTitleHighlight}>tiempo real.</Text>
          </Text>

          <Text style={localStyles.heroDesc}>
            Ejecuta los bloques de tareas que diseñaste en la web. El móvil guía
            tu ritmo, controla tu tiempo y mantiene tu concentración absoluta.
          </Text>
        </View>

        {/* FEATURES SECTION (Adaptado al rol móvil) */}
        <View style={localStyles.featuresContainer}>
          <FeatureItem
            icon="play-circle-outline"
            title="Control de Bloques"
            desc="Inicia, pausa y avanza entre las sub-actividades de tu rutina sin distracciones."
          />
          <FeatureItem
            icon="sync-outline"
            title="Wearable Sync"
            desc="Vincula el dispositivo en segundos. La sesión web transfiere el control a tus manos."
          />
          <FeatureItem
            icon="bar-chart-outline"
            title="Métricas Automáticas"
            desc="Al finalizar tu bloque, los tiempos reales se envían directo a tu Dashboard web."
          />
        </View>

        {/* CALL TO ACTION PRIMARIO (Único botón interactivo) */}
        <View style={localStyles.ctaContainer}>
          <TouchableOpacity
            style={localStyles.glowButton}
            onPress={() => router.push("/scanner")}
          >
            <View style={localStyles.btnContent}>
              <Icon name="qr-code-outline" size={24} color="#ffffff" />
              <Text style={localStyles.glowButtonText}>
                Escanear PIN de Vinculación
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente para las Tarjetas de Características
function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: keyof typeof Icon.glyphMap;
  title: string;
  desc: string;
}) {
  return (
    <View style={localStyles.featureItem}>
      <View style={localStyles.featureIcon}>
        <Icon name={icon} size={26} color={Colors.primary} />
      </View>
      <View style={localStyles.featureTextContainer}>
        <Text style={localStyles.featureTitle}>{title}</Text>
        <Text style={localStyles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    backgroundColor: Colors.primary,
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    transform: [{ rotate: "-10deg" }],
  },
  badge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    marginBottom: 24,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: Colors.text,
    textAlign: "center",
    lineHeight: 48,
    letterSpacing: -1,
  },
  heroTitleHighlight: {
    color: Colors.primary,
  },
  heroDesc: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  ctaContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  glowButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    // Sombra para emular el brillo hover de la web
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  glowButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 12,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  featureIcon: {
    backgroundColor: Colors.background,
    padding: 14,
    borderRadius: 16,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  featureDesc: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 24,
  },
  footerTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  footerCopyright: {
    color: "rgba(148, 163, 184, 0.5)", // Muted con más opacidad
    fontSize: 12,
  },
});
