import { SettingsItem } from "@/components/settings/SettingsItem";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import Icon from "@/components/ui/IconLucide";
import { useSettingsStore } from "@/store/settingsStore";
import { useColorScheme } from "nativewind";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();

  const {
    notifications,
    privacy,
    app,
    updateNotificationSetting,
    updatePrivacySetting,
    updateAppSetting,
    resetToDefaults,
  } = useSettingsStore();

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to their default values?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetToDefaults,
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          console.log("User logged out");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="font-bold text-3xl text-text-primary-light dark:text-text-primary-dark">
            Settings
          </Text>
          <Text
            className="text-text-secondary-light dark:text-text-secondary-dark"
            style={[styles.subtitle]}
          >
            Customize your app experience
          </Text>
        </View>

        {/* Theme Section */}
        <SettingsSection title="Appearance">
          <ThemeSelector />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsItem
            title="Push Notifications"
            description="Receive notifications on your device"
            icon={
              <Icon
                name="Bell"
                size={20}
                color={colorScheme === "dark" ? "#34d399" : "#10b981"}
              />
            }
            value={notifications.pushNotifications}
            onToggle={(value) =>
              updateNotificationSetting("pushNotifications", value)
            }
          />
          <SettingsItem
            title="Email Notifications"
            description="Receive updates via email"
            icon={
              <Icon
                name="Mail"
                size={20}
                color={colorScheme === "dark" ? "#34d399" : "#10b981"}
              />
            }
            value={notifications.emailNotifications}
            onToggle={(value) =>
              updateNotificationSetting("emailNotifications", value)
            }
          />
          <SettingsItem
            title="Sound Alerts"
            description="Play sounds for notifications"
            icon={
              <Icon
                name="Volume2"
                size={20}
                color={colorScheme === "dark" ? "#34d399" : "#10b981"}
              />
            }
            value={notifications.soundAlerts}
            onToggle={(value) =>
              updateNotificationSetting("soundAlerts", value)
            }
          />
          <SettingsItem
            title="Vibration"
            description="Vibrate for notifications"
            icon={
              <Icon
                name="Vibrate"
                size={20}
                color={colorScheme === "dark" ? "#34d399" : "#10b981"}
              />
            }
            value={notifications.vibration}
            onToggle={(value) => updateNotificationSetting("vibration", value)}
            isLast
          />
        </SettingsSection>

        {/* Privacy & Security */}
        <SettingsSection title="Privacy & Security">
          <SettingsItem
            title="Analytics"
            description="Help improve the app with usage data"
            icon={
              <Icon
                name="ChartColumnBig"
                size={20}
                color={colorScheme === "dark" ? "#60a5fa" : "#3b82f6"}
              />
            }
            value={privacy.analytics}
            onToggle={(value) => updatePrivacySetting("analytics", value)}
          />
          <SettingsItem
            title="Crash Reporting"
            description="Send crash reports to help fix bugs"
            icon={
              <Icon
                name="Shield"
                size={20}
                color={colorScheme === "dark" ? "#60a5fa" : "#3b82f6"}
              />
            }
            value={privacy.crashReporting}
            onToggle={(value) => updatePrivacySetting("crashReporting", value)}
          />
          <SettingsItem
            title="Personalized Ads"
            description="Show ads based on your interests"
            icon={
              <Icon
                name="Eye"
                size={20}
                color={colorScheme === "dark" ? "#60a5fa" : "#3b82f6"}
              />
            }
            value={privacy.personalizedAds}
            onToggle={(value) => updatePrivacySetting("personalizedAds", value)}
            isLast
          />
        </SettingsSection>

        {/* App Settings */}
        <SettingsSection title="App Settings">
          <SettingsItem
            title="Auto Save"
            description="Automatically save your work"
            icon={
              <Icon
                name="Save"
                size={20}
                color={colorScheme === "dark" ? "#a78bfa" : "#8b5cf6"}
              />
            }
            value={app.autoSave}
            onToggle={(value) => updateAppSetting("autoSave", value)}
          />
          <SettingsItem
            title="High Quality Audio"
            description="Use higher quality audio processing"
            icon={
              <Icon
                name="Music"
                size={20}
                color={colorScheme === "dark" ? "#a78bfa" : "#8b5cf6"}
              />
            }
            value={app.highQualityAudio}
            onToggle={(value) => updateAppSetting("highQualityAudio", value)}
          />
          <SettingsItem
            title="Offline Mode"
            description="Enable offline functionality"
            icon={
              <Icon
                name="Wifi"
                size={20}
                color={colorScheme === "dark" ? "#a78bfa" : "#8b5cf6"}
              />
            }
            value={app.offlineMode}
            onToggle={(value) => updateAppSetting("offlineMode", value)}
          />
          <SettingsItem
            title="Language"
            description="English"
            icon={
              <Icon
                name="Globe"
                size={20}
                color={colorScheme === "dark" ? "#a78bfa" : "#8b5cf6"}
              />
            }
            showChevron
            onPress={() => {
              Alert.alert("Language", "Language selection coming soon!");
            }}
            isLast
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support">
          <SettingsItem
            title="Help Center"
            description="Get help and find answers"
            icon={
              <Icon
                name="BadgeQuestionMark"
                size={20}
                color={colorScheme === "dark" ? "#f472b6" : "#ec4899"}
              />
            }
            showChevron
            onPress={() => {
              Alert.alert("Help Center", "Opening help center...");
            }}
          />
          <SettingsItem
            title="Contact Support"
            description="Get in touch with our team"
            icon={
              <Icon
                name="MessageCircleQuestionMark"
                size={20}
                color={colorScheme === "dark" ? "#f472b6" : "#ec4899"}
              />
            }
            showChevron
            onPress={() => {
              Alert.alert("Contact Support", "Opening contact form...");
            }}
          />
          <SettingsItem
            title="Rate App"
            description="Rate us on the App Store"
            icon={
              <Icon
                name="Star"
                size={20}
                color={colorScheme === "dark" ? "#f472b6" : "#ec4899"}
              />
            }
            showChevron
            onPress={() => {
              Alert.alert("Rate App", "Thank you for your feedback!");
            }}
            isLast
          />
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection title="Account">
          <SettingsItem
            title="Sign Out"
            description="Sign out of your account"
            icon={
              <Icon
                name="LogOut"
                size={20}
                color={colorScheme === "dark" ? "#ef4444" : "#dc2626"}
              />
            }
            onPress={handleLogout}
          />
          <SettingsItem
            title="Reset Settings"
            description="Reset all settings to default"
            icon={
              <Icon
                name="Trash2"
                size={20}
                color={colorScheme === "dark" ? "#ef4444" : "#dc2626"}
              />
            }
            onPress={handleResetSettings}
            isLast
          />
        </SettingsSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              { color: colorScheme === "dark" ? "#94a3b8" : "#64748b" },
            ]}
          >
            Sound Sculpture v1.0.0
          </Text>
          <Text
            style={[
              styles.footerSubtext,
              { color: colorScheme === "dark" ? "#94a3b8" : "#64748b" },
            ]}
          >
            Made with ❤️ for music lovers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
  },
  footerSubtext: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});
