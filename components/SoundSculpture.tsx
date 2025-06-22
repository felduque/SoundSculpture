import React, { forwardRef, useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { captureRef } from "react-native-view-shot";
import { useAudioRecording } from "../hooks/useAudioRecording";
import type { Sculpture, ShapeType, ShapeTypeConfig } from "../types";
import { SculptureExporter } from "../utils/sculptureExporter";
import { audioToShape } from "../utils/shapeGenerator";

const { width, height } = Dimensions.get("window");

const SoundSculpture: React.FC = () => {
  const [sculptures, setSculptures] = useState<Sculpture[]>([]);
  const [currentSculpture, setCurrentSculpture] = useState<Sculpture | null>(
    null
  );
  const [shapeType, setShapeType] = useState<ShapeType>("wave");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const sculptureViewRef = React.useRef<View>(null);

  const {
    startRecording,
    stopRecording,
    cancelRecording,
    recordingState,
    isRecording,
  } = useAudioRecording();

  const shapeTypes: ShapeTypeConfig[] = [
    {
      id: "wave",
      name: "Onda",
      icon: "waves",
      description: "Forma circular ondulante",
    },
    {
      id: "spiral",
      name: "Espiral",
      icon: "rotate-right",
      description: "Espiral creciente",
    },
    {
      id: "flower",
      name: "Flor",
      icon: "local-florist",
      description: "Patrón floral",
    },
    {
      id: "mountain",
      name: "Montaña",
      icon: "terrain",
      description: "Perfil montañoso",
    },
  ];

  const colors: string[] = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
  ];

  const handleStartRecording = useCallback(async (): Promise<void> => {
    await startRecording();
  }, [startRecording]);

  const handleStopRecording = useCallback(async (): Promise<void> => {
    try {
      const result = await stopRecording();

      if (!result) {
        Alert.alert("Error", "No se pudo procesar la grabación");
        return;
      }

      const sculpture: Sculpture = {
        id: Date.now(),
        audioData: result.audioData,
        shapeType,
        color: colors[Math.floor(Math.random() * colors.length)],
        points: audioToShape({
          audioData: result.audioData,
          shapeType,
          screenWidth: width,
          screenHeight: height - 200, // Espacio para controles
        }),
        duration: result.duration,
        createdAt: new Date().toLocaleTimeString(),
        uri: result.uri,
        name: `${shapeTypes.find((t) => t.id === shapeType)?.name} ${new Date().toLocaleTimeString()}`,
      };

      setSculptures((prev) => [sculpture, ...prev.slice(0, 9)]); // Máximo 10 esculturas
      setCurrentSculpture(sculpture);
    } catch (error) {
      console.error("Error processing recording:", error);
      Alert.alert("Error", "No se pudo procesar la grabación");
    }
  }, [stopRecording, shapeType, colors, shapeTypes]);

  const handleExportSculpture = useCallback(
    async (sculpture: Sculpture): Promise<void> => {
      try {
        Alert.alert(
          "Exportar Escultura",
          "Selecciona el formato de exportación",
          [
            {
              text: "Imagen (PNG)",
              onPress: async () => {
                try {
                  if (sculptureViewRef.current) {
                    const uri = await captureRef(sculptureViewRef, {
                      format: "png",
                      quality: 1,
                    });
                    // Llama al exportador con el nuevo uri
                    await SculptureExporter.exportImage({ ...sculpture, uri });
                  } else {
                    Alert.alert("Error", "No se pudo capturar la imagen.");
                  }
                } catch (e) {
                  console.log("=========================================");
                  console.log("Error capturing image:", e);
                  console.log("=========================================");
                  Alert.alert("Error", "No se pudo exportar la imagen.");
                }
              },
            },
            {
              text: "JSON (Datos)",
              onPress: () => SculptureExporter.exportAsJSON(sculpture),
            },
            {
              text: "3D (OBJ)",
              onPress: () => SculptureExporter.exportAsOBJ(sculpture),
            },
            {
              text: "Cancelar",
              style: "cancel",
            },
          ]
        );
      } catch (error) {
        Alert.alert("Error", "No se pudo exportar la escultura");
        console.error("Error exporting sculpture:", error);
      }
    },
    []
  );

  const handleDeleteSculpture = useCallback(
    (sculptureId: number): void => {
      Alert.alert(
        "Eliminar Escultura",
        "¿Estás seguro de que quieres eliminar esta escultura?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => {
              setSculptures((prev) => prev.filter((s) => s.id !== sculptureId));
              if (currentSculpture?.id === sculptureId) {
                setCurrentSculpture(null);
              }
            },
          },
        ]
      );
    },
    [currentSculpture]
  );

  // Auto-stop recording después de 5 segundos
  useEffect(() => {
    if (isRecording && recordingState.duration >= 5000) {
      handleStopRecording();
    }
  }, [isRecording, recordingState.duration, handleStopRecording]);

  const SculptureVisualization = forwardRef<
    View,
    { sculpture: Sculpture | null }
  >(({ sculpture }, ref) => {
    if (!sculpture) return null;

    return (
      <View style={StyleSheet.absoluteFillObject} ref={ref}>
        {sculpture.points.map((point, index) => (
          <View
            key={`${sculpture.id}-${index}`}
            style={[
              styles.sculpturePoint,
              {
                left: point.x - point.size / 2,
                top: point.y - point.size / 2,
                width: point.size,
                height: point.size,
                backgroundColor: sculpture.color,
                shadowColor: sculpture.color,
                elevation: Math.floor(point.z / 10),
              },
            ]}
          />
        ))}
      </View>
    );
  });
  SculptureVisualization.displayName = "SculptureVisualization";

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Header */}
      <View className="bg-gray-800 p-4 border-gray-700 border-b">
        <Text className="font-bold text-white text-2xl text-center">
          🎵 Sound Sculpture
        </Text>
        <Text className="mt-1 text-gray-400 text-sm text-center">
          Convierte sonidos en arte visual 3D
        </Text>
      </View>

      {/* Selector de Formas */}
      <View className="bg-gray-800 p-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {shapeTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setShapeType(type.id)}
              className={`mx-2 px-4 py-2 rounded-full flex-row items-center ${
                shapeType === type.id ? "bg-blue-500" : "bg-gray-700"
              }`}
              disabled={isRecording}
            >
              <Icon
                name={type.icon}
                size={16}
                color="white"
                style={{ marginRight: 4 }}
              />
              <Text className="font-medium text-white text-sm">
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Visualización Principal */}
      <View className="relative flex-1 bg-black">
        <SculptureVisualization
          sculpture={currentSculpture}
          ref={sculptureViewRef}
        />

        {!currentSculpture && (
          <View className="flex-1 justify-center items-center px-8">
            <Icon name="mic" size={64} color="#6B7280" />
            <Text className="mt-4 mb-2 text-white text-xl text-center">
              Crea tu primera escultura
            </Text>
            <Text className="text-gray-400 text-center">
              Graba cualquier sonido para generar arte visual único
            </Text>
          </View>
        )}

        {/* Info de escultura actual */}
        {currentSculpture && (
          <View className="bottom-4 left-4 absolute bg-black/70 p-3 rounded-lg max-w-xs">
            <Text className="font-medium text-white">
              {currentSculpture.name}
            </Text>
            <Text className="text-gray-400 text-sm">
              {currentSculpture.points.length} puntos •{" "}
              {(currentSculpture.duration / 1000).toFixed(1)}s
            </Text>
            <Text className="text-gray-400 text-sm">
              Creado: {currentSculpture.createdAt}
            </Text>
          </View>
        )}
      </View>

      {/* Controles de Grabación */}
      <View className="bg-gray-800 p-6">
        <View className="items-center mb-4">
          <TouchableOpacity
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            className={`w-20 h-20 rounded-full items-center justify-center ${
              isRecording ? "bg-red-500" : "bg-blue-500"
            }`}
            style={[
              styles.recordButton,
              {
                shadowColor: isRecording ? "#EF4444" : "#3B82F6",
              },
            ]}
            disabled={isPlaying}
          >
            <Icon name={isRecording ? "stop" : "mic"} size={32} color="white" />
          </TouchableOpacity>
        </View>

        {isRecording && (
          <View className="items-center mb-4">
            <Text className="mb-2 font-bold text-red-400 text-lg">
              🔴 Grabando... {(recordingState.duration / 1000).toFixed(1)}s
            </Text>
            <View className="bg-gray-700 rounded-full w-full h-2 overflow-hidden">
              <View
                className="bg-red-500 rounded-full h-full transition-all duration-100"
                style={{ width: `${(recordingState.duration / 5000) * 100}%` }}
              />
            </View>
            <Text className="mt-1 text-gray-400 text-xs">
              Máximo 5 segundos
            </Text>
          </View>
        )}

        <Text className="text-gray-300 text-center">
          {isRecording
            ? "Habla, canta o haz ruido para crear tu escultura"
            : `Forma seleccionada: ${shapeTypes.find((t) => t.id === shapeType)?.name}`}
        </Text>
      </View>

      {/* Lista de Esculturas */}
      {sculptures.length > 0 && (
        <View className="bg-gray-800 max-h-40">
          <Text className="px-4 pt-3 pb-2 font-bold text-white text-lg">
            🎨 Mis Esculturas ({sculptures.length})
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          >
            {sculptures.map((sculpture) => (
              <View key={sculpture.id} className="mr-3">
                <TouchableOpacity
                  onPress={() => setCurrentSculpture(sculpture)}
                  className={`w-16 h-16 rounded-lg items-center justify-center ${
                    currentSculpture?.id === sculpture.id
                      ? "bg-blue-500"
                      : "bg-gray-700"
                  }`}
                  style={[
                    styles.sculptureItem,
                    {
                      borderColor: sculpture.color,
                      shadowColor: sculpture.color,
                    },
                  ]}
                >
                  <Icon
                    name={
                      shapeTypes.find((t) => t.id === sculpture.shapeType)
                        ?.icon || "help"
                    }
                    size={20}
                    color="white"
                  />
                  <Text className="mt-1 text-white text-xs" numberOfLines={1}>
                    {sculpture.createdAt.slice(0, 5)}
                  </Text>
                </TouchableOpacity>

                {/* Controles de escultura */}
                <View className="flex-row justify-center gap-1 mt-2">
                  <TouchableOpacity
                    onPress={() => handleExportSculpture(sculpture)}
                    className="bg-purple-600 p-1 rounded"
                  >
                    <Icon name="download" size={12} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteSculpture(sculpture.id)}
                    className="bg-red-600 p-1 rounded"
                  >
                    <Icon name="delete" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sculpturePoint: {
    position: "absolute",
    borderRadius: 50,
    opacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  recordButton: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sculptureItem: {
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default SoundSculpture;
