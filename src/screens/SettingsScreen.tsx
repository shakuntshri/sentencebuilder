import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { ControlButton } from '../components/ControlButton';

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, parentSettings, updateParentSettings, resetSettings } =
    useSettings();
  const [showParentalGate, setShowParentalGate] = useState(false);

  const handleAudioToggle = (value: boolean) => {
    updateSettings({ soundEnabled: value });
  };

  const handleHapticsToggle = (value: boolean) => {
    updateSettings({ hapticsEnabled: value });
  };

  const handleHighContrastToggle = (value: boolean) => {
    updateSettings({ highContrast: value });
  };

  const handleDyslexiaFontToggle = (value: boolean) => {
    updateSettings({ dyslexiaFont: value });
  };

  const handleShowTextToggle = (value: boolean) => {
    updateSettings({ showTextPrompt: value });
  };

  const handleResetSettings = () => {
    Alert.alert('Reset Settings', 'Are you sure you want to reset all settings?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Reset',
        onPress: () => resetSettings(),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom, paddingHorizontal: SPACING.lg },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Accessibility Section */}
        <Section title="Accessibility">
          <SettingRow
            label="Text Size"
            description={`Current: ${settings.fontSize}`}
            onPress={() => {}}
          />
          <SettingRow
            label="High Contrast"
            toggleValue={settings.highContrast}
            onToggle={handleHighContrastToggle}
          />
          <SettingRow
            label="Dyslexia-Friendly Font"
            toggleValue={settings.dyslexiaFont}
            onToggle={handleDyslexiaFontToggle}
          />
        </Section>

        {/* Audio & Haptics Section */}
        <Section title="Audio & Haptics">
          <SettingRow
            label="Sound Effects"
            toggleValue={settings.soundEnabled}
            onToggle={handleAudioToggle}
          />
          <SettingRow
            label="Haptic Feedback"
            toggleValue={settings.hapticsEnabled}
            onToggle={handleHapticsToggle}
          />
        </Section>

        {/* Game Settings Section */}
        <Section title="Game Settings">
          <SettingRow
            label="Show Text Prompt"
            description="Display target sentence as text"
            toggleValue={settings.showTextPrompt}
            onToggle={handleShowTextToggle}
          />
          <SettingRow
            label="Difficulty"
            description={`Current: ${settings.difficultyLevel}`}
            onPress={() => {}}
          />
        </Section>

        {/* Parent Settings Section */}
        <Section title="Parent Settings">
          <SettingRow
            label="Parental Gate"
            toggleValue={parentSettings.parentalGateEnabled}
            onToggle={(value) => updateParentSettings({ parentalGateEnabled: value })}
          />
          <SettingRow
            label="Enable Hints"
            toggleValue={parentSettings.hintsEnabled}
            onToggle={(value) => updateParentSettings({ hintsEnabled: value })}
          />
          <SettingRow
            label="Show Parts of Speech"
            toggleValue={parentSettings.showPartsOfSpeech}
            onToggle={(value) => updateParentSettings({ showPartsOfSpeech: value })}
          />
        </Section>

        {/* Actions Section */}
        <Section title="Actions">
          <View style={styles.buttonContainer}>
            <ControlButton
              label="View Analytics"
              onPress={() => {}}
              variant="secondary"
              size="medium"
            />
            <ControlButton
              label="Reset Settings"
              onPress={handleResetSettings}
              variant="danger"
              size="medium"
            />
          </View>
        </Section>

        <Text style={styles.version}>App Version: 0.1.0</Text>
      </ScrollView>
    </View>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface SettingRowProps {
  label: string;
  description?: string;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  toggleValue,
  onToggle,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.settingRow}
    onPress={onPress}
    disabled={onToggle === undefined && !onPress}
  >
    <View style={styles.settingLabel}>
      <Text style={styles.settingLabelText}>{label}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    {onToggle !== undefined && <Switch value={toggleValue || false} onValueChange={onToggle} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  content: {
    paddingVertical: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.largeSmall,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.medium,
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  settingLabel: {
    flex: 1,
  },
  settingLabelText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  settingDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  version: {
    textAlign: 'center',
    color: COLORS.gray[400],
    fontSize: FONT_SIZES.small,
    marginTop: SPACING.xxl,
  },
});

export default SettingsScreen;
