import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SculptureService } from "@/services/SculptureService";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Inicializar el servicio de esculturas al cargar la aplicación
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await SculptureService.initialize();
        console.log("Servicio de esculturas inicializado correctamente");
      } catch (error) {
        console.error("Error al inicializar el servicio de esculturas:", error);
      }
    };

    initializeApp();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="sculpture/[id].tsx" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
  );
}
