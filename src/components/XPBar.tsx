import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  compact?: boolean;
}

export default function XPBar({ currentXP, nextLevelXP, level, compact = false }: XPBarProps) {
  const progress = Math.min((currentXP / nextLevelXP) * 100, 100);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactBarBg}>
          <View style={[styles.compactBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.compactText}>{currentXP}/{nextLevelXP} XP</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>LV {level}</Text>
        </View>
        <Text style={styles.xpText}>{currentXP} / {nextLevelXP} XP</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
        <View style={[styles.barShine, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: Colors.levelBadge,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    ...Typography.captionBold,
    color: Colors.textOnAccent,
  },
  xpText: {
    ...Typography.caption,
    color: Colors.brandAccent,
    fontWeight: '700',
  },
  barBackground: {
    height: 12,
    backgroundColor: Colors.xpBarBackground,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.xpBar,
    borderRadius: 6,
  },
  barShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  // Compact variant
  compactContainer: {
    width: '100%',
  },
  compactBarBg: {
    height: 6,
    backgroundColor: Colors.xpBarBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  compactBarFill: {
    height: '100%',
    backgroundColor: Colors.xpBar,
    borderRadius: 3,
  },
  compactText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
});
