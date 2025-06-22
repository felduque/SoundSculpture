import { Audio } from 'expo-av';
import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { AudioAnalysisResult, RecordingState } from '../types';

export const useAudioRecording = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    duration: 0,
    isPaused: false,
  });
  
  const durationInterval = useRef<number | null>(null);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      
      if (permission.status !== 'granted') {
        Alert.alert('Error', 'Se requieren permisos de micrófono');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setRecordingState({
        isRecording: true,
        duration: 0,
        isPaused: false,
      });

      // Iniciar contador de duración
      durationInterval.current = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          duration: prev.duration + 100,
        }));
      }, 100);

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<AudioAnalysisResult | null> => {
    try {
      if (!recording) return null;

      // Limpiar intervalo
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }

      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
      }));

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (!uri) {
        throw new Error('No se pudo obtener la URI del archivo');
      }

      // Analizar audio
      const audioData = await analyzeAudio(uri);
      
      setRecording(null);
      
      return {
        uri,
        audioData,
        duration: recordingState.duration,
      };

    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'No se pudo detener la grabación');
      return null;
    }
  }, [recording, recordingState.duration]);

  const cancelRecording = useCallback(async (): Promise<void> => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
      
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }

      setRecording(null);
      setRecordingState({
        isRecording: false,
        duration: 0,
        isPaused: false,
      });
    } catch (error) {
      console.error('Error canceling recording:', error);
    }
  }, [recording]);

  return {
    startRecording,
    stopRecording,
    cancelRecording,
    recordingState,
    isRecording: recordingState.isRecording,
  };
};

// Función auxiliar para análisis de audio
const analyzeAudio = async (uri: string): Promise<number[]> => {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri });
    const status = await sound.getStatusAsync();
    
    if (!status.isLoaded) {
      throw new Error('No se pudo cargar el audio');
    }

    const duration = status.durationMillis || 2000;
    const samples = Math.floor(duration / 50); // Una muestra cada 50ms
    const audioData: number[] = [];
    
    // Simular análisis de amplitud
    // En una implementación real, usarías FFT o Web Audio API
    for (let i = 0; i < samples; i++) {
      const time = (i / samples) * duration;
      // Simular patrones de amplitud más realistas
      const baseAmplitude = Math.sin((time / duration) * Math.PI * 4) * 50 + 50;
      const noise = (Math.random() - 0.5) * 30;
      const amplitude = Math.max(0, Math.min(100, baseAmplitude + noise));
      audioData.push(amplitude);
    }
    
    await sound.unloadAsync();
    return audioData;
  } catch (error) {
    console.error('Error analyzing audio:', error);
    // Retornar datos dummy en caso de error
    return Array.from({ length: 40 }, () => Math.random() * 100);
  }
};