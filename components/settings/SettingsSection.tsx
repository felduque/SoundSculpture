import React from "react";
import { Text, View } from "react-native";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="mb-8">
      <Text className="mx-4 mb-4 font-semibold text-primary text-text-primary-light dark:text-text-primary-dark tracking-tighter">
        {title.toUpperCase()}
      </Text>
      <View className="bg-surface-light dark:bg-surface-dark mx-4 rounded-xl overflow-hidden">
        {children}
      </View>
    </View>
  );
}
