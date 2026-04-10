import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { MUSCLE_GROUP_LABELS, MuscleGroup, Exercise } from '@/constants/GameData';
import { getWorkoutPlan, saveWorkoutPlan, WorkoutExercise } from '@/src/utils/storage';
import { fetchExercisesFromApi } from '@/src/utils/api';

const MUSCLE_FILTERS: { key: MuscleGroup | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'peito', label: 'Peito' },
  { key: 'costas', label: 'Costas' },
  { key: 'ombro', label: 'Ombros' },
  { key: 'biceps', label: 'Bíceps' },
  { key: 'triceps', label: 'Tríceps' },
  { key: 'perna', label: 'Pernas' },
  { key: 'gluteo', label: 'Glúteo' },
  { key: 'abdomen', label: 'Abdom.' },
  { key: 'cardio', label: 'Cardio' },
];

export default function TreinoEdit() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day: string }>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MuscleGroup | 'all'>('all');
  const [currentExercises, setCurrentExercises] = useState<WorkoutExercise[]>([]);
  const [apiExercises, setApiExercises] = useState<(Exercise & { images: string[] })[]>([]);
  const [loading, setLoading] = useState(true);

  const dayLabel = day ? day.charAt(0).toUpperCase() + day.substring(1) : '';

  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [day])
  );

  async function loadExercises() {
    setLoading(true);
    const plan = await getWorkoutPlan();
    if (day) {
      setCurrentExercises(plan[day]?.exercises || []);
    }
    const apiData = await fetchExercisesFromApi();
    setApiExercises(apiData);
    setLoading(false);
  }

  const filtered = apiExercises.filter((ex) => {
    const matchSearch = search.trim() === '' || ex.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchFilter = filter === 'all' || ex.muscleGroup === filter;
    return matchSearch && matchFilter;
  });

  const groupedExercises: Record<string, (Exercise & { images: string[] })[]> = {};
  if (filter === 'all') {
    filtered.forEach(ex => {
      if (!groupedExercises[ex.muscleGroup]) groupedExercises[ex.muscleGroup] = [];
      groupedExercises[ex.muscleGroup].push(ex);
    });
  }

  async function addExercise(ex: Exercise & { images: string[] }) {
    const newEx: WorkoutExercise = {
      exerciseId: ex.id,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      sets: ex.defaultSets,
      reps: ex.defaultReps,
      images: ex.images,
    };
    const updated = [...currentExercises, newEx];
    setCurrentExercises(updated);

    const plan = await getWorkoutPlan();
    if (day) {
      plan[day] = { ...plan[day], exercises: updated };
      await saveWorkoutPlan(plan);
    }
  }

  const alreadyAdded = new Set(currentExercises.map((e) => e.exerciseId));

  const renderExercise = (ex: Exercise & { images: string[] }) => {
    const added = alreadyAdded.has(ex.id);
    return (
      <View key={ex.id} style={[styles.exCard, added && styles.exCardAdded]}>
        <View style={styles.exIcon}>
          <Ionicons name={ex.icon as any} size={22} color={added ? Colors.brandGreen : Colors.brandAccent} />
        </View>
        <View style={styles.exInfo}>
          <Text style={styles.exName}>{ex.name}</Text>
          <View style={styles.exMeta}>
            <Text style={styles.exMuscle}>{MUSCLE_GROUP_LABELS[ex.muscleGroup]}</Text>
            <Text style={styles.exEquip}>{ex.equipment}</Text>
            <Text style={styles.exDefault}>{ex.defaultSets}x{ex.defaultReps}</Text>
          </View>
        </View>
        {added ? (
          <Ionicons name="checkmark-circle" size={26} color={Colors.brandGreen} />
        ) : (
          <TouchableOpacity onPress={() => addExercise(ex)} activeOpacity={0.7}>
            <Ionicons name="add-circle" size={26} color={Colors.brandAccent} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Exercícios</Text>
        <Text style={styles.headerBadge}>{currentExercises.length} adicionados</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar exercícios..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Muscle Group Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {MUSCLE_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
            onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={{textAlign: 'center', color: Colors.textMuted, marginTop: 20}}>Carregando da API...</Text>
        ) : filter === 'all' ? (
          Object.entries(groupedExercises).map(([muscle, exs]) => (
            <View key={muscle} style={{ marginBottom: 12 }}>
              <View style={styles.groupHeader}>
                <View style={styles.groupDot} />
                <Text style={styles.groupTitle}>{MUSCLE_GROUP_LABELS[muscle as MuscleGroup]}</Text>
              </View>
              {exs.map(renderExercise)}
            </View>
          ))
        ) : (
          filtered.map(renderExercise)
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 6, marginRight: 10 },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary, flex: 1 },
  headerBadge: {
    ...Typography.captionBold,
    color: Colors.brandGreen,
    backgroundColor: Colors.brandGreen + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.surfaceCardsLight,
    marginBottom: 8,
  },
  searchInput: { flex: 1, color: Colors.textPrimary, paddingVertical: 12, fontSize: 16, marginLeft: 8 },
  filterRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.surfaceCards,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
    marginRight: 6,
  },
  filterPillActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  filterText: { ...Typography.captionBold, color: Colors.textSecondary },
  filterTextActive: { color: Colors.textOnAccent },
  scroll: { paddingHorizontal: 16 },
  exCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  exCardAdded: {
    borderColor: Colors.brandGreen + '40',
    backgroundColor: Colors.brandGreen + '08',
  },
  exIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.brandAccent + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exInfo: { flex: 1 },
  exName: { ...Typography.bodyBold, color: Colors.textPrimary },
  exMeta: { flexDirection: 'row', gap: 10, marginTop: 4 },
  exMuscle: { ...Typography.caption, color: Colors.brandGreen },
  exEquip: { ...Typography.caption, color: Colors.textSecondary },
  exDefault: { ...Typography.captionBold, color: Colors.brandAccent },
  groupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 4, gap: 8 },
  groupDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brandGreen },
  groupTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
});
