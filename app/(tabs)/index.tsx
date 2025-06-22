import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSculptures } from "@/contexts/SculptureContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, TouchableOpacity, View } from "react-native";

export default function RecordScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [audioPermission, setAudioPermission] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [recordingName, setRecordingName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  // Usar el contexto de esculturas
  const { saveSculpture } = useSculptures();

  useEffect(() => {
    // Get permission to record audio
    const getPermission = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setAudioPermission(status === 'granted');
    };

    getPermission();
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, [ ]);

  // Timer for recording duration
  useEffect(() => {
    let interval: number;
    if (recordingStatus === 'recording') {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [recordingStatus]);

  const startRecording = async () => {
    try {
      // Check if permission is granted
      if (!audioPermission) {
        console.log('No permission to record');
        return;
      }

      // Configure recording session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create new recording instance
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setRecordingStatus('recording');
      setRecordingDuration(0);
      setRecordingName(`Escultura_${new Date().toISOString().split('T')[0]}_${Date.now()}`);
      
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsSaving(true);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      
      // Guardar la grabación usando el servicio
      if (uri) {
        try {
          const savedSculpture = await saveSculpture(recording, recordingName, recordingDuration);
          console.log('Escultura guardada:', savedSculpture);
          
          // Feedback háptico de éxito
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          // Mostrar mensaje de éxito
          Alert.alert(
            "Grabación Completada",
            "Tu escultura sonora ha sido guardada. Puedes visualizarla en la galería.",
            [{ text: "OK" }]
          );
        } catch (error) {
          console.error('Error al guardar la escultura:', error);
          Alert.alert("Error", "No se pudo guardar la grabación. Inténtalo de nuevo.");
        }
      }

      setRecordingStatus('idle');
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert("Error", "Ocurrió un error al detener la grabación.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRecording = () => {
    if (recordingStatus === 'idle') {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView className="flex-1 px-5 pt-10 pb-5" style={{ backgroundColor }}>
      <View className="flex-1 justify-center items-center">
        <ThemedText type="title" className="mb-10 text-center">
          Sound Sculpture
        </ThemedText>
        
        <ThemedText type="subtitle" className="mb-5 text-center">
          Esculpir con Sonidos
        </ThemedText>

        <ThemedView 
          className="justify-center items-center mb-10 rounded-full w-64 h-64"
          style={{
            backgroundColor: recordingStatus === 'recording' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(10, 126, 164, 0.1)',
            borderWidth: 1,
            borderColor: recordingStatus === 'recording' ? '#FF3B30' : tintColor,
          }}
        >
          <TouchableOpacity
            onPress={toggleRecording}
            disabled={isSaving}
            className="justify-center items-center rounded-full w-48 h-48"
            style={{
              backgroundColor: recordingStatus === 'recording' ? '#FF3B30' : 
                            isSaving ? 'rgba(0,0,0,0.3)' : tintColor,
            }}
          >
            {isSaving ? (
              <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>
                Guardando...
              </ThemedText>
            ) : (
              <FontAwesome
                name={recordingStatus === 'recording' ? 'stop' : 'microphone'}
                size={48}
                color="white"
              />
            )}
          </TouchableOpacity>
        </ThemedView>

        <ThemedText type="defaultSemiBold" className="mb-2 text-center">
          {recordingStatus === 'recording' ? 'Grabando...' : 'Presiona para grabar'}
        </ThemedText>

        {recordingStatus === 'recording' && (
          <ThemedText type="default" className="text-center">
            {formatTime(recordingDuration)}
          </ThemedText>
        )}

        <View className="mt-10">
          <ThemedText type="default" className="text-center">
            Cada sonido genera geometrías únicas que puedes manipular
          </ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}
