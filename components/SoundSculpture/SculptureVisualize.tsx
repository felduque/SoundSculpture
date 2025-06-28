import { Sculpture } from "@/types";
import React, { forwardRef, useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";

const SculptureVisualization = forwardRef<
  View,
  { sculpture: Sculpture | null }
>(({ sculpture }, ref) => {
  const animatedValues = useRef<Animated.Value[]>([]);

  useEffect(() => {
    if (sculpture) {
      // Initialize animated values for each point
      animatedValues.current = sculpture.points.map(() => new Animated.Value(0));
      
      // Animate points appearing with staggered timing
      const animations = animatedValues.current.map((animValue, index) =>
        Animated.timing(animValue, {
          toValue: 1,
          duration: 800,
          delay: index * 50,
          useNativeDriver: true,
        })
      );

      Animated.stagger(50, animations).start();

      // Add floating animation
      const floatingAnimations = animatedValues.current.map((animValue) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1.1,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0.9,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ])
        )
      );

      setTimeout(() => {
        floatingAnimations.forEach(anim => anim.start());
      }, 1000);
    }
  }, [sculpture]);

  if (!sculpture) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} ref={ref}>
      {sculpture.points.map((point, index) => {
        const animatedValue = animatedValues.current[index];
        
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
                elevation: Math.floor(point.z / 10),
                transform: [
                  {
                    scale: animatedValue || 1,
                  },
                ],
                opacity: animatedValue || 1,
              },
            ]}
          />
        );
      })}
      
      {/* Add connecting lines for certain shapes */}
      {['spiral', 'dna', 'tornado'].includes(sculpture.shapeType) && (
        <View style={styles.connectionLayer}>
          {sculpture.points.slice(0, -1).map((point, index) => {
            const nextPoint = sculpture.points[index + 1];
            const distance = Math.sqrt(
              Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
            );
            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
            
            return (
              <View
                key={`line-${index}`}
                style={[
                  styles.connectionLine,
                  {
                    left: point.x,
                    top: point.y,
                    width: distance,
                    backgroundColor: sculpture.color,
                    transform: [{ rotate: `${angle}rad` }],
                    opacity: 0.3,
                  },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
});

export default SculptureVisualization;
SculptureVisualization.displayName = "SculptureVisualization";

const styles = StyleSheet.create({
  sculpturePoint: {
    position: "absolute",
    borderRadius: 50,
    opacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
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
    height: 1,
    transformOrigin: '0 50%',
  },
});