import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import { STARTER_PACKS } from '../data/sentencePacks';
import { ControlButton } from '../components/ControlButton';
import { SentencePack } from '../types/game';

interface HomeScreenProps {
  onStartGame: (packId: string, mode: 'play' | 'challenge' | 'practice') => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onOpenSettings }) => {
  const insets = useSafeAreaInsets();
  const [packs, setPacks] = useState<SentencePack[]>([]);

  useEffect(() => {
    setPacks(STARTER_PACKS);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + SPACING.lg, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tap & Tell</Text>
        <Text style={styles.subtitle}>Sentence Builder</Text>
      </View>

      {/* Packs list */}
      <ScrollView
        style={styles.packsContainer}
        contentContainerStyle={styles.packsContent}
        showsVerticalScrollIndicator={false}
      >
        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            onPlayPress={() => onStartGame(pack.id, 'play')}
            onChallengePress={() => onStartGame(pack.id, 'challenge')}
            onPracticePress={() => onStartGame(pack.id, 'practice')}
          />
        ))}
      </ScrollView>

      {/* Settings button */}
      <View style={styles.footer}>
        <ControlButton
          label="⚙ Settings"
          onPress={onOpenSettings}
          variant="secondary"
          size="medium"
        />
      </View>
    </View>
  );
};

interface PackCardProps {
  pack: SentencePack;
  onPlayPress: () => void;
  onChallengePress: () => void;
  onPracticePress: () => void;
}

const PackCard: React.FC<PackCardProps> = ({
  pack,
  onPlayPress,
  onChallengePress,
  onPracticePress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{pack.name}</Text>
        <Text style={styles.cardDescription}>{pack.description}</Text>
      </View>

      <View style={styles.modeButtons}>
        <TouchableOpacity
          style={[styles.modeButton, styles.modeButtonPlay]}
          onPress={onPlayPress}
        >
          <Text style={styles.modeButtonText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, styles.modeButtonChallenge]}
          onPress={onChallengePress}
        >
          <Text style={styles.modeButtonText}>Challenge</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, styles.modeButtonPractice]}
          onPress={onPracticePress}
        >
          <Text style={styles.modeButtonText}>Practice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZES.huge,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: SPACING.sm,
  },
  packsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  packsContent: {
    paddingBottom: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.large,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.largeSmall,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  cardDescription: {
    fontSize: FONT_SIZES.smallMedium,
    color: COLORS.gray[600],
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  modeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonPlay: {
    backgroundColor: COLORS.primary,
  },
  modeButtonChallenge: {
    backgroundColor: COLORS.secondary,
  },
  modeButtonPractice: {
    backgroundColor: COLORS.accent,
  },
  modeButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.small,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
});
