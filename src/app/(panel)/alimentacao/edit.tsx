import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { FOOD_DATABASE, FoodItem, MEAL_SLOTS } from '@/constants/GameData';
import { getMealPlan, saveMealPlan, MealFood } from '@/src/utils/storage';

export default function AlimentacaoEdit() {
  const router = useRouter();
  const { day, slot } = useLocalSearchParams<{ day: string; slot: string }>();
  const [search, setSearch] = useState('');
  const [currentFoods, setCurrentFoods] = useState<MealFood[]>([]);

  const slotLabel = MEAL_SLOTS.find((s) => s.key === slot)?.label || 'Refeição';

  useFocusEffect(
    useCallback(() => {
      loadCurrentFoods();
    }, [day, slot])
  );

  async function loadCurrentFoods() {
    const plan = await getMealPlan();
    const dayMeals = plan[day || 'seg'];
    if (dayMeals && slot) {
      setCurrentFoods((dayMeals as any)[slot]?.foods || []);
    }
  }

  const filteredFoods = search.length > 1
    ? FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  async function addFood(item: FoodItem) {
    const grams = 100;
    const newFood: MealFood = {
      foodId: item.id,
      name: item.name,
      grams,
      kcal: item.kcal,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
    };
    const updatedFoods = [...currentFoods, newFood];
    setCurrentFoods(updatedFoods);

    const plan = await getMealPlan();
    if (day && slot) {
      (plan[day] as any)[slot] = { foods: updatedFoods };
      await saveMealPlan(plan);
    }
    setSearch('');
  }

  async function removeFood(index: number) {
    const updatedFoods = currentFoods.filter((_, i) => i !== index);
    setCurrentFoods(updatedFoods);

    const plan = await getMealPlan();
    if (day && slot) {
      (plan[day] as any)[slot] = { foods: updatedFoods };
      await saveMealPlan(plan);
    }
  }

  const totals = currentFoods.reduce(
    (acc, f) => ({
      kcal: acc.kcal + f.kcal,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{slotLabel}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar alimentos..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search Results */}
        {filteredFoods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resultados ({filteredFoods.length})</Text>
            {filteredFoods.slice(0, 15).map((item) => (
              <TouchableOpacity key={item.id} style={styles.resultCard} onPress={() => addFood(item)} activeOpacity={0.7}>
                <View style={styles.resultIcon}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.brandAccent} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <View style={styles.resultMacros}>
                    <Text style={styles.macroChip}>{item.kcal} kcal</Text>
                    <Text style={styles.macroDetail}>P: {item.protein}g</Text>
                    <Text style={styles.macroDetail}>C: {item.carbs}g</Text>
                    <Text style={styles.macroDetail}>G: {item.fat}g</Text>
                  </View>
                </View>
                <Ionicons name="add-circle" size={28} color={Colors.brandGreen} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Current Foods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alimentos Adicionados ({currentFoods.length})</Text>
          {currentFoods.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={50} color={Colors.surfaceCardsLight} />
              <Text style={styles.emptyText}>Busque alimentos acima para adicionar à refeição</Text>
            </View>
          ) : (
            currentFoods.map((food, index) => (
              <View key={index} style={styles.foodCard}>
                <View style={styles.foodCardInfo}>
                  <Text style={styles.foodCardName}>{food.name}</Text>
                  <Text style={styles.foodCardMacros}>
                    {food.grams}g • {Math.round(food.kcal)} kcal • P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeFood(index)} style={styles.removeBtn}>
                  <Ionicons name="trash-outline" size={18} color={Colors.statusError} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Totals Footer */}
      {currentFoods.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Total da Refeição</Text>
          <View style={styles.footerRow}>
            <View style={styles.footerItem}>
              <Text style={[styles.footerVal, { color: Colors.macroCalories }]}>{Math.round(totals.kcal)}</Text>
              <Text style={styles.footerLbl}>kcal</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={[styles.footerVal, { color: Colors.macroProtein }]}>{totals.protein.toFixed(0)}g</Text>
              <Text style={styles.footerLbl}>Prot</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={[styles.footerVal, { color: Colors.macroCarbs }]}>{totals.carbs.toFixed(0)}g</Text>
              <Text style={styles.footerLbl}>Carb</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={[styles.footerVal, { color: Colors.macroFat }]}>{totals.fat.toFixed(0)}g</Text>
              <Text style={styles.footerLbl}>Gord</Text>
            </View>
          </View>
        </View>
      )}
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
  headerTitle: { ...Typography.h2, color: Colors.textPrimary },
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
  scroll: { paddingHorizontal: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { ...Typography.captionBold, color: Colors.textSecondary, marginBottom: 10, textTransform: 'uppercase' as any, letterSpacing: 0.5 },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.brandAccent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultInfo: { flex: 1 },
  resultName: { ...Typography.bodyBold, color: Colors.textPrimary },
  resultMacros: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  macroChip: { ...Typography.captionBold, color: Colors.brandAccent },
  macroDetail: { ...Typography.caption, color: Colors.textSecondary },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: 12, maxWidth: 250 },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  foodCardInfo: { flex: 1 },
  foodCardName: { ...Typography.bodyBold, color: Colors.textPrimary },
  foodCardMacros: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },
  removeBtn: { padding: 8 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceCardsDark,
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: Colors.brandAccent,
  },
  footerTitle: { ...Typography.captionBold, color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-around' },
  footerItem: { alignItems: 'center' },
  footerVal: { ...Typography.bodyBold, fontSize: 16 },
  footerLbl: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
});
