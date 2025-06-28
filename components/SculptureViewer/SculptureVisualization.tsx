import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import type { Sculpture } from '@/types';

const { width, height } = Dimensions.get('window');

interface Props {
  sculpture: Sculpture;
}

export function SculptureVisualization({ sculpture }: Props) {
  const animationProgress = useSharedValue(0);
  const waveAnimation = useSharedValue(0);

  useEffect(() => {
    // Start main animation
    animationProgress.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );

    // Start wave animation for connecting lines
    waveAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      false
    );
  }, []);

  const renderPoints = () => {
    return sculpture.points.map((point, index) => {
      const animatedStyle = useAnimatedStyle(() => {
        const delay = index * 0.1;
        const scale = interpolate(
          animationProgress.value,
          [0, 0.5, 1],
          [0.8, 1.2, 1],
          'clamp'
        );
        
        const opacity = interpolate(
          animationProgress.value,
          [0, 0.3, 0.7, 1],
          [0.6, 1, 1, 0.8],
          'clamp'
        );

        const translateY = interpolate(
          animationProgress.value,
          [0, 1],
          [0, Math.sin((index + animationProgress.value) * 0.5) * 10],
          'clamp'
        );

        return {
          transform: [
            { scale: scale + Math.sin((index + animationProgress.value) * 2) * 0.1 },
            { translateY },
          ],
          opacity,
        };
      });

      return (
        <Animated.View
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
              borderRadius: point.size / 2,
              elevation: Math.floor(point.z / 10),
            },
            animatedStyle,
          ]}
        />
      );
    });
  };

  const renderConnections = () => {
    if (!['spiral', 'dna', 'tornado', 'galaxy'].includes(sculpture.shapeType)) {
      return null;
    }

    return sculpture.points.slice(0, -1).map((point, index) => {
      const nextPoint = sculpture.points[index + 1];
      const distance = Math.sqrt(
        Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
      );
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);

      const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
          waveAnimation.value,
          [0, 0.5, 1],
          [0.2, 0.6, 0.3],
          'clamp'
        );

        const scaleX = interpolate(
          waveAnimation.value,
          [0, 1],
          [0.8, 1.2],
          'clamp'
        );

        return {
          opacity,
          transform: [{ scaleX }],
        };
      });

      return (
        <Animated.View
          key={`line-${index}`}
          style={[
            styles.connectionLine,
            {
              left: point.x,
              top: point.y,
              width: distance,
              backgroundColor: sculpture.color,
              transform: [{ rotate: `${angle}rad` }],
            },
            animatedStyle,
          ]}
        />
      );
    });
  };

  const renderParticles = () => {
    // Add floating particles for enhanced visual effect
    const particles = Array.from({ length: 20 }, (_, index) => {
      const animatedStyle = useAnimatedStyle(() => {
        const floatY = interpolate(
          animationProgress.value,
          [0, 1],
          [0, -50 - Math.random() * 100],
          'clamp'
        );

        const opacity = interpolate(
          animationProgress.value,
          [0, 0.3, 0.7, 1],
          [0, 0.8, 0.8, 0],
          'clamp'
        );

        const scale = interpolate(
          animationProgress.value,
          [0, 0.5, 1],
          [0, 1, 0.5],
          'clamp'
        );

        return {
          transform: [
            { translateY: floatY },
            { scale },
          ],
          opacity,
        };
      });

      return (
        <Animated.View
          key={`particle-${index}`}
          style={[
            styles.particle,
            {
              left: Math.random() * width,
              top: height * 0.8 + Math.random() * 100,
              backgroundColor: sculpture.color,
            },
            animatedStyle,
          ]}
        />
      );
    });

    return particles;
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={[styles.backgroundGradient, { backgroundColor: sculpture.color + '10' }]} />
      
      {/* Connection lines */}
      <View style={styles.connectionLayer}>
        {renderConnections()}
      </View>
      
      {/* Main sculpture points */}
      {renderPoints()}
      
      {/* Floating particles */}
      {renderParticles()}
      
      {/* Center glow effect */}
      <View style={[styles.centerGlow, { backgroundColor: sculpture.color + '20' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  sculpturePoint: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  connectionLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  connectionLine: {
    position: 'absolute',
    height: 2,
    transformOrigin: '0 50%',
    opacity: 0.4,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  centerGlow: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    width: '20%',
    height: '20%',
    borderRadius: 100,
    opacity: 0.3,
  },
});