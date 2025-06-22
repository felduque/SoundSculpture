import { shapeColors, shapeTypes } from "@/constants/shapes";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { Sculpture, ShapeType } from "@/types";
import { audioToShape } from "@/utils/shapeGenerator";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirstSculpture } from "./SoundSculpture/FirstSculpture";
import { Sculpture3D } from "./SoundSculpture/Sculpture3D";
import SculptureVisualization from "./SoundSculpture/SculptureVisualize";
import Icon from "./ui/IconLucide";

const { width, height } = Dimensions.get("window");
export const SoundSculptureUltimateL: React.FC = () => {
  const [currentSculpture, setCurrentSculpture] = useState<Sculpture | null>(
    null
  );
  const sculptureViewRef = useRef<View>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("wave");
  const [sculptures, setSculptures] = useState<Sculpture[]>([]);

  const {
    startRecording,
    stopRecording,
    cancelRecording,
    recordingState,
    isRecording,
  } = useAudioRecording();

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
        color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
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

      setCurrentSculpture(sculpture);
      setSculptures((prev) => [...prev, sculpture]);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert("Error", "No se pudo Procesar la grabacion");
    }
  }, [stopRecording, shapeType]);
  // auto pause 5 seconds
  useEffect(() => {
    if (isRecording && recordingState.duration >= 5000) {
      handleStopRecording();
    }
  }, [isRecording, recordingState.duration, handleStopRecording]);
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      {/* header */}
      <View className="bg-surface-light dark:bg-surface-dark p-4 border-b border-border-light dark:border-border-dark">
        <Text className="font-bold text-primary-light dark:text-primary-dark text-2xl text-center">
          🎵 Sound Sculpture
        </Text>
        <Text className="mt-1 text-text-secondary-light dark:text-text-secondary-dark text-sm text-center">
          Convierte sonidos en arte
        </Text>
      </View>
      {/* Form selector */}
      <View className="bg-surface-light dark:bg-surface-dark p-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 8,
          }}
        >
          {shapeTypes.map((shape) => (
            <TouchableOpacity
              key={shape.id}
              onPress={() => setShapeType(shape.id)}
              className={`flex-row items-center mx-2 px-4 py-2 rounded-full  gap-1 ${shape.id === shapeType ? "bg-indigo-light dark:bg-indigo-dark" : "bg-card-light dark:bg-card-dark"}`}
            >
              <Icon name={shape.icon} />
              <Text>{shape.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Visualized */}

      <View className="relative flex-1 bg-red-light dark:bg-surface-dark">
        {shapeType === "3d" ? (
          <Sculpture3D 
            data={currentSculpture}
          />
        ) : (
          <SculptureVisualization
            sculpture={currentSculpture}
            ref={sculptureViewRef}
          />
        )}
        {currentSculpture ? (
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
        ) : (
          <FirstSculpture />
        )}
      </View>

      {/* controllers recorder */}
      <View className="bg-surface-light dark:bg-surface-dark p-6">
        <View className="items-center mb-4">
          <TouchableOpacity
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            className={`w-20 h-20 rounded-full items-center justify-center bg-indigo-light dark:bg-indigo-dark shadow-lg `}
          >
            <Icon name={isRecording ? "MicOff" : "Mic"} size={32} />
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
                style={{
                  width: `${(recordingState.duration / 5000) * 100}%`,
                }}
              />
            </View>
            <Text>Maximo 5 segundos</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
