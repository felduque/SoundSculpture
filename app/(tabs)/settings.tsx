import { SettingsItem } from "@/components/settings/SettingsItem";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import Icon from "@/components/ui/IconLucide";
import { useSettingsStore } from "@/store/settingsStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useColorScheme } from "nativewind";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

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
      t.settings.alerts.resetTitle,
      t.settings.alerts.resetMessage,
      [
        { text: t.common.cancel, style: "cancel" },
        {
          text: t.settings.alerts.resetConfirm,
          style: "destructive",
          onPress: resetToDefaults,
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t.settings.alerts.signOutTitle, 
      t.settings.alerts.signOutMessage, 
      [
        { text: t.common.cancel, style: "cancel" },
        {
          text: t.settings.alerts.signOutConfirm,
          style: "destructive",
          onPress: () => {
            console.log("User logged out");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="font-bold text-3xl text-text-primary-light dark:text-text-primary-dark">
            {t.settings.title}
          </Text>
          <Text
            className="text-text-secondary-light dark:text-text-secondary-dark"
            style={[styles.subtitle]}
          >
            {t.settings.subtitle}
          </Text>
        </View>

        {/* Theme Section */}
        <SettingsSection title={t.settings.sections.appearance}>
          <ThemeSelector />
        </SettingsSection>

        {/* Language Section */}
        <SettingsSection title={t.settings.app.language}>
          <LanguageSelector />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title={t.settings.sections.notifications}>
          <SettingsItem
            title={t.settings.notifications.push}
            description={t.settings.notifications.pushDesc}
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
            title={t.settings.notifications.email}
            description={t.settings.notifications.emailDesc}
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
            title={t.settings.notifications.sound}
            description={t.settings.notifications.soundDesc}
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
            title={t.settings.notifications.vibration}
            description={t.settings.notifications.vibrationDesc}
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
        <SettingsSection title={t.settings.sections.privacy}>
          <SettingsItem
            title={t.settings.privacy.analytics}
            description={t.settings.privacy.analyticsDesc}
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
            title={t.settings.privacy.crashReporting}
            description={t.settings.privacy.crashReportingDesc}
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
            title={t.settings.privacy.personalizedAds}
            description={t.settings.privacy.personalizedAdsDesc}
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
        <SettingsSection title={t.settings.sections.app}>
          <SettingsItem
            title={t.settings.app.autoSave}
            description={t.settings.app.autoSaveDesc}
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
            title={t.settings.app.highQualityAudio}
            description={t.settings.app.highQualityAudioDesc}
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
            title={t.settings.app.offlineMode}
            description={t.settings.app.offlineModeDesc}
            icon={
              <Icon
                name="Wifi"
                size={20}
                color={colorScheme === "dark" ? "#a78bfa" : "#8b5cf6"}
              />
            }
            value={app.offlineMode}
            onToggle={(value) => updateAppSetting("offlineMode", value)}
            isLast
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title={t.settings.sections.support}>
          <SettingsItem
            title={t.settings.support.helpCenter}
            description={t.settings.support.helpCenterDesc}
            icon={
              <Icon
                name="BadgeQuestionMark"
                size={20}
                color={colorScheme === "dark" ? "#f472b6" : "#ec4899"}
              />
            }
            showChevron
            onPress={() => {
              Alert.alert(t.settings.alerts.helpCenterTitle, t.settings.alerts.helpCenterMessage);
            }}
          />
          <SettingsItem
            title={t.settings.support.contactSupport}
            description={t.settings.support.contactSupportDesc}
            icon={
              <Icon
                name="MessageCircleQuestionMark"
                size={20}
                color={colorScheme === "dark" ? "#f472b6" : "#ec4899"}
              />
            }
            showChevron
            onPress={() => {
              Alert.alert(t.settings.alerts.contactSupportTitle, t.settings.alerts.contactSupportMessage);
            }}
          />
          <SettingsItem
            title={t.settings.support.rateApp}
            description={t.settings.support.rateAppDesc}
            icon={
              <Icon
                name="Star"
                size={20}
                color={colorScheme === "dark" ? "#f472b6" : "#ec4899"}
              />
            }
            showChevron
            onPress={() => {
              Alert.alert(t.settings.alerts.rateAppTitle, t.settings.alerts.rateAppMessage);
            }}
            isLast
          />
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection title={t.settings.sections.account}>
          <SettingsItem
            title={t.settings.account.signOut}
            description={t.settings.account.signOutDesc}
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
            title={t.settings.account.resetSettings}
            description={t.settings.account.resetSettingsDesc}
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
            {t.settings.footer.version}
          </Text>
          <Text
            style={[
              styles.footerSubtext,
              { color: colorScheme === "dark" ? "#94a3b8" : "#64748b" },
            ]}
          >
            {t.settings.footer.subtitle}
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