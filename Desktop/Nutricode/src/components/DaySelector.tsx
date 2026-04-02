import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

interface DaySelectorProps {
  selectedDay: string;
  onSelectDay: (dayKey: string) => void;
  days: { key: string; label: string }[];
}

export default function DaySelector({ selectedDay, onSelectDay, days }: DaySelectorProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {days.map((day) => {
        const isActive = selectedDay === day.key;
        return (
          <TouchableOpacity
            key={day.key}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onSelectDay(day.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {day.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surfaceCards,
    borderWidth: 1.5,
    borderColor: Colors.surfaceCardsLight,
  },
  pillActive: {
    backgroundColor: Colors.brandAccent,
    borderColor: Colors.brandAccent,
  },
  pillText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.textOnAccent,
  },
});
