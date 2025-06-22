import { Sculpture } from "@/types";
import React, { forwardRef } from "react";
import { StyleSheet, View } from "react-native";

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
