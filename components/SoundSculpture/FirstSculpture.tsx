import React from "react";
import { Text, View } from "react-native";
import Icon from "../ui/IconLucide";
import { useTranslation } from "@/hooks/useTranslation";

export const FirstSculpture: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <View className="flex-1 justify-center items-center px-8">
      <Icon name="Mic" size={64} color="#000" />
      <Text className="mt-4 mb-2 text-text-primary-light dark:text-text-primary-dark text-xl text-center">
        {t.recording.firstSculpture.title}
      </Text>
      <Text className="text-text-secondary-light dark:text-text-secondary-dark text-center">
        {t.recording.firstSculpture.subtitle}
      </Text>
    </View>
  );
};