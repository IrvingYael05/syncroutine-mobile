import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons as Icon } from "@expo/vector-icons";
import { globalStyles, Colors } from "@/constants/theme";
import CustomModal from "@/components/CustomModal";

// 1. Importamos el contexto de autenticación
import { useAuth } from "@/context/AuthContext";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "error" as const,
  });

  const router = useRouter();

  // 2. Extraemos signIn del contexto
  const { signIn } = useAuth();

  if (!permission) return <View style={globalStyles.container} />;

  if (!permission.granted) {
    return (
      <View style={globalStyles.container}>
        <Icon
          name="camera-outline"
          size={60}
          color={Colors.textMuted}
          style={{ marginBottom: 20 }}
        />
        <Text style={globalStyles.subtitle}>
          Se requiere acceso a la cámara para emparejar el dispositivo.
        </Text>
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={requestPermission}
        >
          <Text style={globalStyles.buttonText}>Otorgar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const showError = (title: string, message: string) => {
    setModalConfig({ visible: true, title, message, type: "error" });
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/vinculacion/estado/${data}`,
      );
      const result = await response.json();

      if (result.status === "PAIRED") {
        // El useEffect del _layout.tsx detectará el cambio y hará la redirección segura.
        await signIn(result.token, result.refreshToken);
      } else {
        showError(
          "Código Inválido",
          "El código QR ha caducado o no es válido.",
        );
      }
    } catch (error) {
      showError(
        "Error de Conexión",
        "No se pudo conectar al servidor. Revisa tu conexión a internet.",
      );
    }
  };

  return (
    <View style={localStyles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      <View style={localStyles.overlay}>
        <Text style={localStyles.scanText}>
          Apunta al código QR de la pantalla
        </Text>
        <TouchableOpacity
          style={localStyles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={localStyles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
      <CustomModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Reintentar"
        onConfirm={() => {
          setModalConfig((prev) => ({ ...prev, visible: false }));
          setScanned(false);
        }}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  cameraContainer: { flex: 1, backgroundColor: Colors.background },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 20,
  },
  scanText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  cancelText: { color: Colors.text, fontWeight: "bold" },
});
