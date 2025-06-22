import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    PanResponder,
    TouchableOpacity,
    View
} from "react-native";

// Importar el tipo desde el servicio
import { Sculpture } from "@/types";

// Componente para representar una forma 3D simple
const Shape3D = ({
  color,
  size,
  rotation,
  position,
}: {
  color: string;
  size: number;
  rotation: Animated.Value;
  position: { x: Animated.Value; y: Animated.Value };
}) => {
  console.log("=======================================");
  console.log(color, size, rotation, position);
  console.log("=======================================");
  const animatedStyles = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      {
        rotateX: rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        }),
      },
      {
        rotateY: rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        }),
      },
      {
        rotateZ: rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          backgroundColor: color,
          position: "absolute",
          borderRadius: size / 4,
          opacity: 0.8,
        },
        animatedStyles,
      ]}
    />
  );
};

export function Sculpture3D({ data }: { data: Sculpture | null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [shapes, setShapes] = useState<
    {
      id: number;
      color: string;
      size: number;
      rotation: Animated.Value;
      position: { x: Animated.Value; y: Animated.Value };
    }[]
  >([]);

  const tintColor = useThemeColor({}, "tint");

  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { width, height } = Dimensions.get("window");
  //   const centerX = width / 2 - 50;
  //   const centerY = height / 2 - 150;

  // Configurar el PanResponder para permitir la rotación de la visualización
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Usar el movimiento horizontal para rotar en Y y el vertical para rotar en X
        const rotationSpeed = 0.5;
        rotationAnim.setValue(
          ((gestureState.dx + gestureState.dy) * rotationSpeed) % 360
        );
      },
      onPanResponderGrant: () => {
        // Efecto de escala al tocar
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: () => {
        // Volver a la escala normal al soltar
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    // Cargar la escultura seleccionada
    const loadSculpture = async () => {
      if (data?.uri) {
        // Buscar la escultura en el contexto
        generateShapesFromAudio();
        await loadSound(data.uri);
      }
    };

    loadSculpture();

    // Limpiar al desmontar
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [data?.uri]);

  // Cargar el sonido
  const loadSound = async (uri: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );

      setSound(newSound);

      // Configurar el callback para cuando termine la reproducción
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error al cargar el sonido:", error);
    }
  };

  // Generar formas 3D basadas en el audio
  const generateShapesFromAudio = () => {
    // En una implementación real, analizaríamos el archivo de audio
    // y generaríamos formas basadas en frecuencias, amplitud, etc.

    // Por ahora, generamos formas aleatorias para simular
    const newShapes = [];
    const colors = ["#0a7ea4", "#FF3B30", "#34C759", "#FF9500", "#AF52DE"];

    for (let i = 0; i < 10; i++) {
      const size = Math.random() * 60 + 40;
      const posX = new Animated.Value(Math.random() * width - size);
      const posY = new Animated.Value((Math.random() * height) / 2 - size);
      const rotation = new Animated.Value(Math.random() * 360);

      newShapes.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
        rotation,
        position: { x: posX, y: posY },
      });
    }

    setShapes(newShapes);
  };

  // Animar las formas cuando se reproduce
  const togglePlayback = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        // Pausar reproducción
        await sound.pauseAsync();
        setIsPlaying(false);

        // Detener animaciones
        shapes.forEach((shape) => {
          shape.rotation.stopAnimation();
          shape.position.x.stopAnimation();
          shape.position.y.stopAnimation();
        });
      } else {
        // Iniciar reproducción
        await sound.playAsync();
        setIsPlaying(true);

        // Iniciar animaciones para cada forma
        shapes.forEach((shape) => {
          Animated.loop(
            Animated.timing(shape.rotation, {
              toValue: 360,
              duration: 3000 + Math.random() * 5000,
              useNativeDriver: true,
            })
          ).start();

          // Animar posición
          Animated.sequence([
            Animated.timing(shape.position.x, {
              toValue: Math.random() * width - shape.size,
              duration: 10000 + Math.random() * 5000,
              useNativeDriver: true,
            }),
            Animated.timing(shape.position.y, {
              toValue: (Math.random() * height) / 2 - shape.size,
              duration: 10000 + Math.random() * 5000,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }
    } catch (error) {
      console.error("Error al reproducir/pausar el sonido:", error);
    }
  };

  if (!data) return null

  return (
    <View className="flex-1">
      <View
        className="flex-1 justify-center items-center mb-6"
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={{
            transform: [
              { scale: scaleAnim },
              {
                rotateY: rotationAnim.interpolate({
                  inputRange: [0, 360],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
            width: width - 40,
            height: height / 2,
          }}
        >
          {shapes.map((shape) => (
            <Shape3D
              key={shape.id}
              color={shape.color}
              size={shape.size}
              rotation={shape.rotation}
              position={shape.position}
            />
          ))}
        </Animated.View>
      </View>

      <View className="flex-row justify-center mb-6">
        <TouchableOpacity
          onPress={togglePlayback}
          className="justify-center items-center rounded-full w-16 h-16"
          style={{ backgroundColor: isPlaying ? "#FF3B30" : tintColor }}
        >
          <FontAwesome
            name={isPlaying ? "pause" : "play"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
