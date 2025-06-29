import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import IconLucide from "@/components/ui/IconLucide";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "@/hooks/useTranslation";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.navigation.record,
          tabBarIcon: ({ color }) => (
            <IconLucide 
              name="MicVocal"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="newGallery"
        options={{
          title: t.navigation.gallery,
          tabBarIcon: ({ color }) => (
            <IconLucide
              name="Image"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.navigation.settings,
          tabBarIcon: ({ color }) => (
            <IconLucide
              name="Settings"
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}