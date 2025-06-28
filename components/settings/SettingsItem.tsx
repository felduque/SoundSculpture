import { Switch } from "@/components/ui/Switch";
import { ChevronRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SettingsItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showChevron?: boolean;
  isLast?: boolean;
  disabled?: boolean;
}

export function SettingsItem({
  title,
  description,
  icon,
  value,
  onPress,
  onToggle,
  showChevron = false,
  isLast = false,
  disabled = false,
}: SettingsItemProps) {
  const { colorScheme } = useColorScheme();

  const handlePress = () => {
    if (disabled) return;
    if (onToggle && value !== undefined) {
      onToggle(!value);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || (!onPress && !onToggle)}
      activeOpacity={0.7}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <View
      className="flex-row items-center px-4 py-4"
        style={[
          !isLast && {
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === "dark" ? "#334155" : "#e2e8f0",
          },
        ]}
      >
        {icon && <View className="mr-3">{icon}</View>}

        <View className="flex-1">
          <Text
          className="font-medium text-base text-text-primary-light dark:text-text-primary-dark"
          >
            {title}
          </Text>
          {description && (
            <Text
              className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark"
            >
              {description}
            </Text>
          )}
        </View>

        {onToggle && value !== undefined && (
          <Switch value={value} onValueChange={onToggle} disabled={disabled} />
        )}

        {showChevron && (
          <ChevronRight
            size={20}
            color={colorScheme === "dark" ? "#94a3b8" : "#64748b"}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
