import { useColorScheme } from 'nativewind';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function Switch({ value, onValueChange, disabled = false, size = 'medium' }: SwitchProps) {
  const { colorScheme } = useColorScheme();

  const progress = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value, progress]);

  const sizes = {
    small: { width: 44, height: 24, thumb: 20 },
    medium: { width: 52, height: 28, thumb: 24 },
    large: { width: 60, height: 32, thumb: 28 },
  };

  const { width, height, thumb } = sizes[size];

  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        colorScheme === "dark" ? '#334155' : '#e2e8f0',
        colorScheme === "dark" ? '#34d399' : '#10b981',
      ]
    );

    return {
      backgroundColor,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const translateX = progress.value * (width - thumb - 4);
    
    return {
      transform: [{ translateX }],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
      
      // Haptic feedback nativo solo en móviles
      if (Platform.OS !== 'web') {
        // Usar vibración ligera si está disponible
        try {
          const { Haptics } = require('expo-haptics');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
          // Silenciar error si Haptics no está disponible
        }
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: height / 2,
            padding: 2,
            justifyContent: 'center',
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: thumb,
              height: thumb,
              borderRadius: thumb / 2,
              backgroundColor: '#ffffff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}