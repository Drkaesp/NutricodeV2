// ─── Food Database (per 100g) ───
export interface FoodItem {
  id: string;
  name: string;
  category: 'proteina' | 'carboidrato' | 'fruta' | 'vegetal' | 'gordura' | 'lacteo' | 'outro';
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  icon: string; // Ionicons name
}

export const FOOD_DATABASE: FoodItem[] = [];

// ─── Exercise Library ───
export type MuscleGroup = 'peito' | 'costas' | 'ombro' | 'biceps' | 'triceps' | 'perna' | 'gluteo' | 'abdomen' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: string;
  defaultSets: number;
  defaultReps: number;
  icon: string;
}

export const EXERCISE_DATABASE: Exercise[] = [];

// ─── Muscle Group Labels ───
export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  peito: 'Peito',
  costas: 'Costas',
  ombro: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  perna: 'Pernas',
  gluteo: 'Glúteo',
  abdomen: 'Abdômen',
  cardio: 'Cardio',
};

// ─── XP & Level System ───
export const XP_REWARDS = {
  COMPLETE_WORKOUT: 50,
  LOG_MEAL: 20,
  COMPLETE_WATER_GOAL: 30,
  DAILY_STREAK: 15,
  COMPLETE_ALL_DAILY: 100, // bonus for doing all 3 in a day
};

export function getXPForLevel(level: number): number {
  // Progressive: Level 1 = 100, Level 2 = 250, Level 3 = 450, etc.
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function getLevelFromXP(totalXP: number): { level: number; currentXP: number; nextLevelXP: number } {
  let level = 1;
  let accumulatedXP = 0;
  while (accumulatedXP + getXPForLevel(level) <= totalXP) {
    accumulatedXP += getXPForLevel(level);
    level++;
  }
  return {
    level,
    currentXP: totalXP - accumulatedXP,
    nextLevelXP: getXPForLevel(level),
  };
}

// ─── Water Calculation ───
export function calculateDailyWaterGoal(weightKg: number): number {
  // ml = weight * 35
  return Math.round(weightKg * 35);
}

// ─── Day Labels ───
export const DAYS_OF_WEEK = [
  { key: 'seg', label: 'Seg', full: 'Segunda-feira' },
  { key: 'ter', label: 'Ter', full: 'Terça-feira' },
  { key: 'qua', label: 'Qua', full: 'Quarta-feira' },
  { key: 'qui', label: 'Qui', full: 'Quinta-feira' },
  { key: 'sex', label: 'Sex', full: 'Sexta-feira' },
  { key: 'sab', label: 'Sáb', full: 'Sábado' },
  { key: 'dom', label: 'Dom', full: 'Domingo' },
];

// ─── Meal Slots ───
export const MEAL_SLOTS = [
  { key: 'cafe', label: 'Café da Manhã', icon: 'cafe', time: '07:00' },
  { key: 'almoco', label: 'Almoço', icon: 'restaurant', time: '12:00' },
  { key: 'lanche', label: 'Lanche da Tarde', icon: 'ice-cream', time: '16:00' },
  { key: 'janta', label: 'Janta', icon: 'moon', time: '20:00' },
];

// ─── Recommended Workouts ───
export interface RecommendedWorkout {
  id: string;
  name: string;
  description: string;
  focus: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  exercises: string[]; // exercise IDs
  icon: string;
  color: string;
}

export const RECOMMENDED_WORKOUTS: RecommendedWorkout[] = [];

// ─── Fitness Tips ───
export const FITNESS_TIPS = [
  { id: 't1', title: 'Hidratação é Chave', text: 'Beber água antes, durante e após o treino melhora a performance em até 25%.', icon: 'water' },
  { id: 't2', title: 'Sono e Recuperação', text: 'Dormir 7-9h por noite é essencial para a síntese proteica e recuperação muscular.', icon: 'moon' },
  { id: 't3', title: 'Proteína pós-treino', text: 'Consumir proteína em até 1h após o treino maximiza o ganho de massa muscular.', icon: 'nutrition' },
  { id: 't4', title: 'Progressão de Carga', text: 'Aumente a carga gradualmente (5-10%) a cada 2 semanas para continuar evoluindo.', icon: 'trending-up' },
  { id: 't5', title: 'Não pule o aquecimento', text: '5-10 minutos de aquecimento diminuem em 50% o risco de lesões durante o treino.', icon: 'flame' },
  { id: 't6', title: 'Carboidratos antes do treino', text: 'Carboidratos complexos 1-2h antes garantem energia suficiente para treinar pesado.', icon: 'flash' },
];
