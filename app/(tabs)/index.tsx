import { FirstSculpture } from "@/components/SoundSculpture/FirstSculpture";
import { Sculpture3D } from "@/components/SoundSculpture/Sculpture3D";
import SculptureVisualization from "@/components/SoundSculpture/SculptureVisualize";
import Icon from "@/components/ui/IconLucide";
import { Loading } from "@/components/ui/Loading/Loading";
import { shapeColors, shapeTypes } from "@/constants/shapes";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { useSculptureData } from "@/hooks/useSculptureData";
import { useTranslation } from "@/hooks/useTranslation";
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

const { width, height } = Dimensions.get("window");

export default function RecordScreen() {
  const { t } = useTranslation();
  const [currentSculpture, setCurrentSculpture] = useState<Sculpture | null>(null);
  const sculptureViewRef = useRef<View>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("wave");

  const { startRecording, stopRecording, recordingState, isRecording } = useAudioRecording();
  const { loading, setLoading, error, saveSculpture } = useSculptureData();

  const handleStartRecording = useCallback(async (): Promise<void> => {
    setLoading(true);
    await startRecording();
  }, [startRecording, setLoading]);

  const handleStopRecording = useCallback(async (): Promise<void> => {
    try {
      const result = await stopRecording();
      if (!result) {
        Alert.alert(t.common.error, t.errors.recording.processingFailed);
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
          screenHeight: height - 200,
        }),
        duration: result.duration,
        createdAt: new Date().toLocaleTimeString(),
        uri: result.uri,
        name: `${t.recording.shapes[shapeType]} ${new Date().toLocaleTimeString()}`,
      };

      setCurrentSculpture(sculpture);
      await saveSculpture(sculpture);
    } catch (error) {
      Alert.alert(t.common.error, t.errors.recording.processingFailed);
    }
  }, [stopRecording, shapeType, saveSculpture, t]);

  useEffect(() => {
    if (isRecording && recordingState.duration >= 5000) {
      handleStopRecording();
    }
  }, [isRecording, recordingState.duration, handleStopRecording]);

  const handleShape = (e: ShapeType) => {
    setCurrentSculpture(null);
    setShapeType(e);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Header */}
      <View className="bg-surface-light dark:bg-surface-dark p-4 border-b border-border-light dark:border-border-dark">
        <Text className="font-bold text-2xl text-center text-indigo-light dark:text-indigo-dark">
          {t.recording.title}
        </Text>
        <Text className="mt-1 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {t.recording.subtitle}
        </Text>
      </View>

      {/* Shape Selector */}
      <View className="bg-surface-light dark:bg-surface-dark p-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {shapeTypes.map((shape) => (
            <TouchableOpacity
              key={shape.id}
              onPress={() => handleShape(shape.id)}
              className={`flex-row items-center mx-2 px-4 py-2 rounded-full gap-1 ${
                shape.id === shapeType 
                  ? "bg-indigo-light dark:bg-indigo-dark" 
                  : "bg-background-light dark:bg-background-dark"
              }`}
            >
              <Icon name={shape.icon} />
              <Text>{t.recording.shapes[shape.id]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Visualization */}
      <View className="relative flex-1 bg-red-light dark:bg-surface-dark">
        {shapeType === "3d" ? (
          <Sculpture3D data={currentSculpture} />
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
              {currentSculpture.points.length} {t.recording.sculptureInfo.points} •{" "}
              {(currentSculpture.duration / 1000).toFixed(1)}{t.recording.recording.duration}
            </Text>
            <Text className="text-gray-400 text-sm">
              {t.recording.sculptureInfo.created}: {currentSculpture.createdAt}
            </Text>
          </View>
        ) : loading ? (
          <Loading variant="sculpture" color="#10b981" size="full" fullScreen />
        ) : (
          <FirstSculpture />
        )}
      </View>

      {/* Recording Controls */}
      <View className="bg-surface-light dark:bg-surface-dark p-6">
        <View className="items-center">
          <TouchableOpacity
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${
              isRecording 
                ? "bg-error-light dark:bg-error-dark" 
                : "bg-indigo-light dark:bg-indigo-dark"
            }`}
          >
            <Icon name={isRecording ? "MicOff" : "Mic"} size={32} />
          </TouchableOpacity>
        </View>
        
        {isRecording && (
          <View className="relative bg-indigo-dark dark:bg-indigo-light rounded-full w-full h-4 overflow-hidden">
            <View
              className="bg-indigo-light dark:bg-indigo-dark rounded-full h-full transition-all duration-100"
              style={{ width: `${(recordingState.duration / 5000) * 100}%` }}
            />
            <View className="absolute inset-0 justify-center items-center">
              <Text className="font-bold text-white text-xs">
                {(recordingState.duration / 1000).toFixed(1)}{t.recording.recording.duration} / 5.0{t.recording.recording.duration}
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}