import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Palette, Download, Play, Pause, RotateCcw } from 'lucide-react-native';
import { useSculptureData } from '@/hooks/useSculptureData';
import { SculptureVisualization } from './SculptureVisualization';
import { ColorPicker } from './ColorPicker';
import { ExportModal } from '../SculptureExport/ExportModal';
import { useTranslation } from '@/hooks/useTranslation';
import { Audio } from 'expo-av';
import type { Sculpture } from '@/types';

export function SculptureViewer() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { data, updateSculpture } = useSculptureData();
  const { width, height } = useWindowDimensions();
  
  const [sculpture, setSculpture] = useState<Sculpture | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sculptureViewRef = useRef<View>(null);

  useEffect(() => {
    if (id) {
      const foundSculpture = data.find(s => s.id.toString() === id);
      if (foundSculpture) {
        setSculpture(foundSculpture);
        loadAudio(foundSculpture);
      }
    }
  }, [id, data]);

  useEffect(() => {
    // Start rotation animation
    const rotationAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    rotationAnimation.start();

    return () => {
      rotationAnimation.stop();
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async (sculptureData: Sculpture) => {
    if (!sculptureData.uri) return;
    
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: sculptureData.uri },
        { shouldPlay: false }
      );
      setSound(audioSound);
      
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const togglePlayback = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
        
        // Add pulsing animation when playing
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.05,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleColorChange = async (newColor: string) => {
    if (!sculpture) return;

    const updatedSculpture = { ...sculpture, color: newColor };
    setSculpture(updatedSculpture);
    
    try {
      await updateSculpture(updatedSculpture);
      Alert.alert('Success', 'Sculpture color updated!');
    } catch (error) {
      Alert.alert(t.common.error, 'Failed to update sculpture color');
    }
  };

  const resetRotation = () => {
    rotationAnim.setValue(0);
  };

  if (!sculpture) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading sculpture...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{sculpture.name}</Text>
          <Text style={styles.subtitle}>
            {sculpture.points.length} points • {(sculpture.duration / 1000).toFixed(1)}s
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setShowColorPicker(true)}
            style={[styles.actionButton, { backgroundColor: sculpture.color }]}
          >
            <Palette size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowExportModal(true)}
            style={styles.actionButton}
          >
            <Download size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sculpture Visualization */}
      <View style={styles.visualizationContainer}>
        <Animated.View
          ref={sculptureViewRef}
          style={[
            styles.sculptureWrapper,
            {
              transform: [
                { rotate: rotation },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <SculptureVisualization sculpture={sculpture} />
        </Animated.View>

        {/* Sculpture Info Overlay */}
        <View style={styles.infoOverlay}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{sculpture.shapeType.toUpperCase()}</Text>
            <Text style={styles.infoDetail}>Created: {sculpture.createdAt}</Text>
            <View style={[styles.colorIndicator, { backgroundColor: sculpture.color }]} />
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={resetRotation} style={styles.controlButton}>
          <RotateCcw size={24} color="#fff" />
          <Text style={styles.controlText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlayback}
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
        >
          {isPlaying ? (
            <Pause size={32} color="#fff" />
          ) : (
            <Play size={32} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowExportModal(true)}
          style={styles.controlButton}
        >
          <Download size={24} color="#fff" />
          <Text style={styles.controlText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      <ColorPicker
        visible={showColorPicker}
        currentColor={sculpture.color}
        onColorSelect={handleColorChange}
        onClose={() => setShowColorPicker(false)}
      />

      {/* Export Modal */}
      <ExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        sculpture={sculpture}
        viewRef={sculptureViewRef}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualizationContainer: {
    flex: 1,
    position: 'relative',
  },
  sculptureWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
    minWidth: 150,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoDetail: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 8,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    alignItems: 'center',
    gap: 8,
  },
  controlText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonActive: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
});