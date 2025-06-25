import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, Text, View } from 'react-native';

// Tipos para el componente
type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'sculpture';

interface LoadingProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  color?: string;
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

// Configuración de tamaños
const sizeConfig = {
  xs: {
    container: 'w-4 h-4',
    spinner: 16,
    text: 'text-xs',
    dots: 'w-1 h-1',
  },
  sm: {
    container: 'w-6 h-6',
    spinner: 20,
    text: 'text-sm',
    dots: 'w-1.5 h-1.5',
  },
  md: {
    container: 'w-8 h-8',
    spinner: 24,
    text: 'text-base',
    dots: 'w-2 h-2',
  },
  lg: {
    container: 'w-12 h-12',
    spinner: 32,
    text: 'text-lg',
    dots: 'w-3 h-3',
  },
  xl: {
    container: 'w-16 h-16',
    spinner: 40,
    text: 'text-xl',
    dots: 'w-4 h-4',
  },
  full: {
    container: 'w-24 h-24',
    spinner: 48,
    text: 'text-2xl',
    dots: 'w-5 h-5',
  },
};

// Componente de puntos animados
const DotsLoader = ({ size, color }: { size: LoadingSize; color: string }) => {
  const dotSize = sizeConfig[size].dots;
  const animValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = animValues.map((animValue, index) =>
      createAnimation(animValue, index * 200)
    );

    animations.forEach(animation => animation.start());

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, []);
  
  return (
    <View className="flex-row items-center space-x-1">
      {animValues.map((animValue, index) => (
        <Animated.View
          key={index}
          className={`${dotSize} rounded-full`}
          style={{ 
            backgroundColor: color,
            opacity: animValue,
          }}
        />
      ))}
    </View>
  );
};

// Componente de pulso
const PulseLoader = ({ size, color }: { size: LoadingSize; color: string }) => {
  const containerSize = sizeConfig[size].container;
  
  return (
    <View 
      className={`${containerSize} rounded-full animate-pulse`}
      style={{ backgroundColor: color }}
    />
  );
};

// Componente skeleton
const SkeletonLoader = ({ size }: { size: LoadingSize }) => {
  const containerSize = sizeConfig[size].container;
  
  return (
    <View className={`${containerSize} bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse`} />
  );
};

// Componente de formas flotantes para escultura de audio
const SculptureLoader = ({ size, color }: { size: LoadingSize; color: string }) => {
  const baseSize = parseInt(sizeConfig[size].container.split('w-')[1]) * 4;
  
  // Animaciones
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotación continua
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Escala pulsante
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Ondas expansivas
    const waveAnimation = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );

    // Rebote vertical
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Iniciar todas las animaciones
    rotateAnimation.start();
    scaleAnimation.start();
    waveAnimation.start();
    bounceAnimation.start();

    return () => {
      rotateAnimation.stop();
      scaleAnimation.stop();
      waveAnimation.stop();
      bounceAnimation.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const waveScale = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 2],
  });

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  });

  const shapes = [
    { id: 1, size: baseSize * 0.4, angle: 0, color: color, opacity: 0.8 },
    { id: 2, size: baseSize * 0.3, angle: 90, color: color, opacity: 0.6 },
    { id: 3, size: baseSize * 0.5, angle: 180, color: color, opacity: 0.7 },
    { id: 4, size: baseSize * 0.35, angle: 270, color: color, opacity: 0.9 },
  ];

  return (
    <View className="relative justify-center items-center" style={{ width: baseSize * 2, height: baseSize * 2 }}>
      {/* Ondas de audio de fondo */}
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={`wave-${index}`}
          className="absolute border-2 rounded-full"
          style={{
            width: baseSize * (0.8 + index * 0.4),
            height: baseSize * (0.8 + index * 0.4),
            borderColor: color,
            transform: [
              {
                scale: waveScale,
              },
            ],
            opacity: waveOpacity,
          }}
        />
      ))}

      {/* Formas orbitales */}
      <Animated.View
        style={{
          transform: [{ rotate }],
        }}
      >
        {shapes.map((shape) => {
          const radian = (shape.angle * Math.PI) / 180;
          const x = Math.cos(radian) * (baseSize * 0.4);
          const y = Math.sin(radian) * (baseSize * 0.4);

          return (
            <Animated.View
              key={shape.id}
              className="absolute rounded-lg"
              style={{
                width: shape.size,
                height: shape.size,
                backgroundColor: shape.color,
                opacity: shape.opacity,
                left: x + baseSize - shape.size / 2,
                top: y + baseSize - shape.size / 2,
                borderRadius: shape.size / 4,
                transform: [
                  { translateY: bounceAnim },
                  { scale: scaleAnim },
                ],
              }}
            />
          );
        })}
      </Animated.View>

      {/* Núcleo central */}
      <Animated.View
        className="absolute rounded-full"
        style={{
          width: baseSize * 0.25,
          height: baseSize * 0.25,
          backgroundColor: color,
          opacity: 0.9,
          transform: [
            { scale: scaleAnim },
          ],
        }}
      />
    </View>
  );
};

// Componente principal
export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  color = '#3b82f6',
  text,
  className = '',
  fullScreen = false,
}) => {
  const config = sizeConfig[size];
  
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <ActivityIndicator 
            size={config.spinner} 
            color={color}
          />
        );
      case 'dots':
        return <DotsLoader size={size} color={color} />;
      case 'pulse':
        return <PulseLoader size={size} color={color} />;
      case 'skeleton':
        return <SkeletonLoader size={size} />;
      case 'sculpture':
        return <SculptureLoader size={size} color={color} />;
      default:
        return <ActivityIndicator size={config.spinner} color={color} />;
    }
  };

  const content = (
    <View className={`items-center justify-center ${className}`}>
      {renderLoader()}
      {text && (
        <Text 
          className={`${config.text} mt-2 text-text-secondary-light dark:text-text-secondary-dark text-center`}
        >
          {text}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
        {content}
      </View>
    );
  }

  return content;
};

// Hook personalizado para estados de carga
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const toggleLoading = () => setIsLoading(prev => !prev);
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
  };
};

// Componente para botones con loading
interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  loadingText?: string;
  size?: LoadingSize;
  className?: string;
  disabled?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  onPress,
  loadingText = "Cargando...",
  size = 'sm',
  className = '',
  disabled = false,
}) => {
  return (
    <View 
      className={`
        px-4 py-3 rounded-lg items-center justify-center flex-row
        ${isLoading || disabled 
          ? 'bg-neutral-300 dark:bg-neutral-600' 
          : 'bg-primary-light dark:bg-primary-dark'
        }
        ${className}
      `}
      onTouchEnd={!isLoading && !disabled ? onPress : undefined}
    >
      {isLoading ? (
        <View className="flex-row items-center">
          <Loading size={size} color="#ffffff" />
          <Text className="ml-2 font-medium text-white">
            {loadingText}
          </Text>
        </View>
      ) : (
        children
      )}
    </View>
  );
};

// Componente para overlays de carga
interface LoadingOverlayProps {
  visible: boolean;
  text?: string;
  size?: LoadingSize;
  variant?: LoadingVariant;
  color?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  text = "Cargando...",
  size = 'lg',
  variant = 'spinner',
  color = '#3b82f6',
}) => {
  if (!visible) return null;
  
  return (
    <View className="z-50 absolute inset-0 justify-center items-center bg-black/50">
      <View className="bg-surface-light dark:bg-surface-dark shadow-strong p-6 rounded-xl">
        <Loading 
          size={size} 
          variant={variant} 
          color={color} 
          text={text}
        />
      </View>
    </View>
  );
};

export default Loading;