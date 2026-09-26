import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { Colors } from "@/constants/theme";

type ModalType = "success" | "error" | "warning" | "info";

interface CustomModalProps {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  cancelText?: string;
}

export default function CustomModal({
  visible,
  type,
  title,
  message,
  confirmText = "Aceptar",
  onConfirm,
  onCancel,
  cancelText = "Cancelar",
}: CustomModalProps) {
  const getModalConfig = () => {
    switch (type) {
      case "success":
        return { icon: "checkmark-circle-outline" as const, color: Colors.primary };
      case "error":
        return { icon: "close-circle-outline" as const, color: Colors.danger };
      case "warning":
        return { icon: "warning-outline" as const, color: "#f59e0b" }; // Ámbar
      case "info":
        return { icon: "information-circle-outline" as const, color: "#3b82f6" }; // Azul
    }
  };

  const config = getModalConfig();

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Icon name={config.icon} size={50} color={config.color} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: config.color }]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: { flexDirection: "row", gap: 10, width: "100%" },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.textMuted,
  },
  cancelButtonText: {
    color: Colors.textMuted,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonText: { color: "#000000", fontWeight: "bold", fontSize: 16 },
});
