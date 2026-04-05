import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import { StorageService } from '../services/StorageService';
import { ControlButton } from '../components/ControlButton';
import { SessionStats, GameMetrics } from '../types/game';

interface DashboardData {
  metrics: GameMetrics | null;
  recentSessions: SessionStats[];
}

const ParentDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<DashboardData>({
    metrics: null,
    recentSessions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [metrics, sessions] = await Promise.all([
        StorageService.getGameMetrics(),
        StorageService.getAllSessionStats(),
      ]);
      setData({
        metrics,
        recentSessions: sessions.sort((a, b) => b.endTime! - a.endTime!).slice(0, 10),
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Analytics',
      'This will clear all progress and analytics data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            await StorageService.resetLocalData();
            await loadDashboardData();
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom, paddingHorizontal: SPACING.lg },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <Section title="Overall Stats">
          {data.metrics && (
            <>
              <StatCard
                label="Total Sessions"
                value={data.metrics.totalSessions.toString()}
              />
              <StatCard
                label="Sentences Completed"
                value={data.metrics.totalSentencesCompleted.toString()}
              />
              <StatCard
                label="Total Play Time"
                value={`${Math.round(data.metrics.totalPlayTime / 60)} min`}
              />
              <StatCard
                label="Avg Success Rate"
                value={`${Math.round(data.metrics.averageSuccessRate)}%`}
              />
            </>
          )}
        </Section>

        {/* Recent Sessions */}
        <Section title="Recent Sessions">
          {data.recentSessions.length > 0 ? (
            data.recentSessions.map((session, idx) => (
              <SessionCard key={idx} session={session} />
            ))
          ) : (
            <Text style={styles.emptyText}>No sessions yet</Text>
          )}
        </Section>

        {/* Actions */}
        <Section title="Actions">
          <ControlButton
            label="Refresh Data"
            onPress={loadDashboardData}
            variant="secondary"
            size="medium"
          />
          <ControlButton
            label="Reset All Data"
            onPress={handleResetData}
            variant="danger"
            size="medium"
          />
        </Section>
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

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

interface SessionCardProps {
  session: SessionStats;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const date = new Date(session.startTime).toLocaleDateString();
  const duration = Math.round((session.endTime || Date.now() - session.startTime) / 1000);

  return (
    <View style={styles.sessionCard}>
      <View style={styles.sessionRow}>
        <Text style={styles.sessionLabel}>Date</Text>
        <Text style={styles.sessionValue}>{date}</Text>
      </View>
      <View style={styles.sessionRow}>
        <Text style={styles.sessionLabel}>Mode</Text>
        <Text style={styles.sessionValue}>{session.mode}</Text>
      </View>
      <View style={styles.sessionRow}>
        <Text style={styles.sessionLabel}>Sentences</Text>
        <Text style={styles.sessionValue}>{session.sentencesCompleted}</Text>
      </View>
      <View style={styles.sessionRow}>
        <Text style={styles.sessionLabel}>Success</Text>
        <Text style={styles.sessionValue}>{Math.round(session.successRate)}%</Text>
      </View>
      <View style={styles.sessionRow}>
        <Text style={styles.sessionLabel}>Duration</Text>
        <Text style={styles.sessionValue}>{duration}s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.medium,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  statLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.huge,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sessionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.medium,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sessionLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray[600],
  },
  sessionValue: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.gray[400],
    fontSize: FONT_SIZES.medium,
    paddingVertical: SPACING.xl,
  },
});

export default ParentDashboardScreen;
