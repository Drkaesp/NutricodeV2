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

export const FOOD_DATABASE: FoodItem[] = [
  // ─── Proteínas ───
  { id: 'f01', name: 'Peito de Frango Grelhado', category: 'proteina', kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, icon: 'nutrition' },
  { id: 'f02', name: 'Ovo Cozido', category: 'proteina', kcal: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, icon: 'egg' },
  { id: 'f03', name: 'Carne Bovina Magra', category: 'proteina', kcal: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, icon: 'nutrition' },
  { id: 'f04', name: 'Tilápia Grelhada', category: 'proteina', kcal: 128, protein: 26, carbs: 0, fat: 2.7, fiber: 0, icon: 'fish' },
  { id: 'f05', name: 'Atum em Lata', category: 'proteina', kcal: 116, protein: 25.5, carbs: 0, fat: 1, fiber: 0, icon: 'fish' },
  { id: 'f06', name: 'Whey Protein (30g)', category: 'proteina', kcal: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, icon: 'fitness' },
  { id: 'f07', name: 'Peito de Peru', category: 'proteina', kcal: 104, protein: 17, carbs: 4, fat: 1.7, fiber: 0, icon: 'nutrition' },
  { id: 'f08', name: 'Camarão Cozido', category: 'proteina', kcal: 99, protein: 24, carbs: 0, fat: 0.3, fiber: 0, icon: 'fish' },

  // ─── Carboidratos ───
  { id: 'f10', name: 'Arroz Branco Cozido', category: 'carboidrato', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, icon: 'restaurant' },
  { id: 'f11', name: 'Arroz Integral Cozido', category: 'carboidrato', kcal: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, icon: 'restaurant' },
  { id: 'f12', name: 'Batata Doce Cozida', category: 'carboidrato', kcal: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, icon: 'leaf' },
  { id: 'f13', name: 'Macarrão Integral', category: 'carboidrato', kcal: 124, protein: 5, carbs: 26, fat: 0.5, fiber: 3.2, icon: 'restaurant' },
  { id: 'f14', name: 'Pão Integral (fatia)', category: 'carboidrato', kcal: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, icon: 'cafe' },
  { id: 'f15', name: 'Aveia em Flocos', category: 'carboidrato', kcal: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, icon: 'cafe' },
  { id: 'f16', name: 'Mandioca Cozida', category: 'carboidrato', kcal: 125, protein: 0.6, carbs: 30, fat: 0.2, fiber: 1.8, icon: 'leaf' },
  { id: 'f17', name: 'Feijão Preto Cozido', category: 'carboidrato', kcal: 77, protein: 4.5, carbs: 14, fat: 0.5, fiber: 8.7, icon: 'restaurant' },
  { id: 'f18', name: 'Tapioca (goma)', category: 'carboidrato', kcal: 358, protein: 0, carbs: 88, fat: 0, fiber: 0, icon: 'cafe' },

  // ─── Frutas ───
  { id: 'f20', name: 'Banana', category: 'fruta', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, icon: 'nutrition' },
  { id: 'f21', name: 'Maçã', category: 'fruta', kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, icon: 'nutrition' },
  { id: 'f22', name: 'Morango', category: 'fruta', kcal: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, icon: 'nutrition' },
  { id: 'f23', name: 'Manga', category: 'fruta', kcal: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, icon: 'nutrition' },
  { id: 'f24', name: 'Abacate', category: 'fruta', kcal: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7, icon: 'nutrition' },
  { id: 'f25', name: 'Melancia', category: 'fruta', kcal: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, icon: 'nutrition' },
  { id: 'f26', name: 'Uva', category: 'fruta', kcal: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, icon: 'nutrition' },
  { id: 'f27', name: 'Laranja', category: 'fruta', kcal: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, icon: 'nutrition' },

  // ─── Vegetais ───
  { id: 'f30', name: 'Brócolis Cozido', category: 'vegetal', kcal: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3.3, icon: 'leaf' },
  { id: 'f31', name: 'Espinafre Cozido', category: 'vegetal', kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.3, fiber: 2.4, icon: 'leaf' },
  { id: 'f32', name: 'Cenoura Crua', category: 'vegetal', kcal: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, icon: 'leaf' },
  { id: 'f33', name: 'Tomate', category: 'vegetal', kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, icon: 'leaf' },
  { id: 'f34', name: 'Alface', category: 'vegetal', kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, icon: 'leaf' },

  // ─── Gorduras Saudáveis ───
  { id: 'f40', name: 'Azeite de Oliva (1 col.)', category: 'gordura', kcal: 119, protein: 0, carbs: 0, fat: 14, fiber: 0, icon: 'water' },
  { id: 'f41', name: 'Castanha do Pará (3 un.)', category: 'gordura', kcal: 99, protein: 2.1, carbs: 1.8, fat: 10, fiber: 1, icon: 'leaf' },
  { id: 'f42', name: 'Pasta de Amendoim (1 col.)', category: 'gordura', kcal: 94, protein: 4, carbs: 3, fat: 8, fiber: 1, icon: 'cafe' },

  // ─── Laticínios ───
  { id: 'f50', name: 'Iogurte Natural', category: 'lacteo', kcal: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, icon: 'cafe' },
  { id: 'f51', name: 'Queijo Cottage', category: 'lacteo', kcal: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, icon: 'restaurant' },
  { id: 'f52', name: 'Leite Desnatado', category: 'lacteo', kcal: 34, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0, icon: 'cafe' },
  { id: 'f53', name: 'Queijo Minas', category: 'lacteo', kcal: 264, protein: 17, carbs: 3, fat: 20, fiber: 0, icon: 'restaurant' },
];

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

export const EXERCISE_DATABASE: Exercise[] = [
  // ─── Peito ───
  { id: 'e01', name: 'Supino Reto', muscleGroup: 'peito', equipment: 'Barra', defaultSets: 4, defaultReps: 10, icon: 'barbell' },
  { id: 'e02', name: 'Supino Inclinado', muscleGroup: 'peito', equipment: 'Halteres', defaultSets: 4, defaultReps: 10, icon: 'barbell' },
  { id: 'e03', name: 'Crucifixo Reto', muscleGroup: 'peito', equipment: 'Halteres', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e04', name: 'Crossover', muscleGroup: 'peito', equipment: 'Cabo', defaultSets: 3, defaultReps: 15, icon: 'barbell' },
  { id: 'e05', name: 'Flexão de Braço', muscleGroup: 'peito', equipment: 'Corpo', defaultSets: 3, defaultReps: 15, icon: 'body' },

  // ─── Costas ───
  { id: 'e10', name: 'Puxada Frontal', muscleGroup: 'costas', equipment: 'Máquina', defaultSets: 4, defaultReps: 10, icon: 'barbell' },
  { id: 'e11', name: 'Remada Curvada', muscleGroup: 'costas', equipment: 'Barra', defaultSets: 4, defaultReps: 10, icon: 'barbell' },
  { id: 'e12', name: 'Remada Unilateral', muscleGroup: 'costas', equipment: 'Halter', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e13', name: 'Pulley Costas', muscleGroup: 'costas', equipment: 'Máquina', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e14', name: 'Barra Fixa', muscleGroup: 'costas', equipment: 'Barra', defaultSets: 3, defaultReps: 8, icon: 'body' },

  // ─── Ombros ───
  { id: 'e20', name: 'Desenvolvimento', muscleGroup: 'ombro', equipment: 'Halteres', defaultSets: 4, defaultReps: 10, icon: 'barbell' },
  { id: 'e21', name: 'Elevação Lateral', muscleGroup: 'ombro', equipment: 'Halteres', defaultSets: 3, defaultReps: 15, icon: 'barbell' },
  { id: 'e22', name: 'Elevação Frontal', muscleGroup: 'ombro', equipment: 'Halteres', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e23', name: 'Face Pull', muscleGroup: 'ombro', equipment: 'Cabo', defaultSets: 3, defaultReps: 15, icon: 'barbell' },

  // ─── Bíceps ───
  { id: 'e30', name: 'Rosca Direta', muscleGroup: 'biceps', equipment: 'Barra', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e31', name: 'Rosca Alternada', muscleGroup: 'biceps', equipment: 'Halteres', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e32', name: 'Rosca Martelo', muscleGroup: 'biceps', equipment: 'Halteres', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e33', name: 'Rosca Scott', muscleGroup: 'biceps', equipment: 'Barra W', defaultSets: 3, defaultReps: 10, icon: 'barbell' },

  // ─── Tríceps ───
  { id: 'e40', name: 'Tríceps Corda', muscleGroup: 'triceps', equipment: 'Cabo', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e41', name: 'Tríceps Testa', muscleGroup: 'triceps', equipment: 'Barra W', defaultSets: 3, defaultReps: 10, icon: 'barbell' },
  { id: 'e42', name: 'Tríceps Francês', muscleGroup: 'triceps', equipment: 'Halter', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e43', name: 'Mergulho (Paralelas)', muscleGroup: 'triceps', equipment: 'Corpo', defaultSets: 3, defaultReps: 10, icon: 'body' },

  // ─── Pernas ───
  { id: 'e50', name: 'Agachamento Livre', muscleGroup: 'perna', equipment: 'Barra', defaultSets: 4, defaultReps: 10, icon: 'barbell' },
  { id: 'e51', name: 'Leg Press 45°', muscleGroup: 'perna', equipment: 'Máquina', defaultSets: 4, defaultReps: 12, icon: 'barbell' },
  { id: 'e52', name: 'Cadeira Extensora', muscleGroup: 'perna', equipment: 'Máquina', defaultSets: 3, defaultReps: 15, icon: 'barbell' },
  { id: 'e53', name: 'Mesa Flexora', muscleGroup: 'perna', equipment: 'Máquina', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'e54', name: 'Panturrilha em Pé', muscleGroup: 'perna', equipment: 'Máquina', defaultSets: 4, defaultReps: 15, icon: 'barbell' },
  { id: 'e55', name: 'Afundo (Passada)', muscleGroup: 'perna', equipment: 'Halteres', defaultSets: 3, defaultReps: 12, icon: 'walk' },
  { id: 'e56', name: 'Stiff', muscleGroup: 'perna', equipment: 'Barra', defaultSets: 3, defaultReps: 10, icon: 'barbell' },

  // ─── Glúteo ───
  { id: 'e60', name: 'Hip Thrust', muscleGroup: 'gluteo', equipment: 'Barra', defaultSets: 4, defaultReps: 12, icon: 'barbell' },
  { id: 'e61', name: 'Abdução de Quadril', muscleGroup: 'gluteo', equipment: 'Máquina', defaultSets: 3, defaultReps: 15, icon: 'barbell' },
  { id: 'e62', name: 'Elevação Pélvica', muscleGroup: 'gluteo', equipment: 'Corpo', defaultSets: 3, defaultReps: 15, icon: 'body' },

  // ─── Abdômen ───
  { id: 'e70', name: 'Abdominal Crunch', muscleGroup: 'abdomen', equipment: 'Corpo', defaultSets: 3, defaultReps: 20, icon: 'body' },
  { id: 'e71', name: 'Prancha Isométrica', muscleGroup: 'abdomen', equipment: 'Corpo', defaultSets: 3, defaultReps: 60, icon: 'body' },
  { id: 'e72', name: 'Abdominal Infra', muscleGroup: 'abdomen', equipment: 'Corpo', defaultSets: 3, defaultReps: 15, icon: 'body' },
  { id: 'e73', name: 'Russian Twist', muscleGroup: 'abdomen', equipment: 'Peso', defaultSets: 3, defaultReps: 20, icon: 'body' },

  // ─── Cardio ───
  { id: 'e80', name: 'Esteira', muscleGroup: 'cardio', equipment: 'Máquina', defaultSets: 1, defaultReps: 30, icon: 'walk' },
  { id: 'e81', name: 'Bicicleta Ergométrica', muscleGroup: 'cardio', equipment: 'Máquina', defaultSets: 1, defaultReps: 20, icon: 'bicycle' },
  { id: 'e82', name: 'Elíptico', muscleGroup: 'cardio', equipment: 'Máquina', defaultSets: 1, defaultReps: 20, icon: 'walk' },
  { id: 'e83', name: 'Pular Corda', muscleGroup: 'cardio', equipment: 'Corda', defaultSets: 3, defaultReps: 100, icon: 'flash' },
];

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

export const RECOMMENDED_WORKOUTS: RecommendedWorkout[] = [
  {
    id: 'rw01',
    name: 'Treino Push',
    description: 'Peito, Ombro e Tríceps para quem quer definição',
    focus: 'Peito / Ombro / Tríceps',
    difficulty: 'Intermediário',
    duration: '45 min',
    exercises: ['e01', 'e03', 'e20', 'e21', 'e40', 'e41'],
    icon: 'fitness',
    color: '#E76F51',
  },
  {
    id: 'rw02',
    name: 'Treino Pull',
    description: 'Costas e Bíceps para construir um V-taper',
    focus: 'Costas / Bíceps',
    difficulty: 'Intermediário',
    duration: '40 min',
    exercises: ['e10', 'e11', 'e13', 'e30', 'e31', 'e32'],
    icon: 'body',
    color: '#7CB342',
  },
  {
    id: 'rw03',
    name: 'Treino de Pernas',
    description: 'Pernas e glúteos completo',
    focus: 'Pernas / Glúteo',
    difficulty: 'Avançado',
    duration: '50 min',
    exercises: ['e50', 'e51', 'e52', 'e53', 'e55', 'e60'],
    icon: 'walk',
    color: '#F4A261',
  },
  {
    id: 'rw04',
    name: 'Full Body Iniciante',
    description: 'Treino para quem está começando',
    focus: 'Corpo inteiro',
    difficulty: 'Iniciante',
    duration: '30 min',
    exercises: ['e05', 'e14', 'e21', 'e30', 'e50', 'e70'],
    icon: 'flash',
    color: '#64B5F6',
  },
  {
    id: 'rw05',
    name: 'Core & Cardio',
    description: 'Abdômen forte e cardiovascular',
    focus: 'Abdômen / Cardio',
    difficulty: 'Iniciante',
    duration: '25 min',
    exercises: ['e70', 'e71', 'e72', 'e73', 'e80', 'e83'],
    icon: 'flame',
    color: '#E9C46A',
  },
  {
    id: 'rw06',
    name: 'Upper Body Power',
    description: 'Foco em força para membros superiores',
    focus: 'Peito / Costas / Ombro',
    difficulty: 'Avançado',
    duration: '55 min',
    exercises: ['e01', 'e02', 'e10', 'e11', 'e20', 'e43'],
    icon: 'trophy',
    color: '#FFD93D',
  },
];

// ─── Fitness Tips ───
export const FITNESS_TIPS = [
  { id: 't1', title: 'Hidratação é Chave', text: 'Beber água antes, durante e após o treino melhora a performance em até 25%.', icon: 'water' },
  { id: 't2', title: 'Sono e Recuperação', text: 'Dormir 7-9h por noite é essencial para a síntese proteica e recuperação muscular.', icon: 'moon' },
  { id: 't3', title: 'Proteína pós-treino', text: 'Consumir proteína em até 1h após o treino maximiza o ganho de massa muscular.', icon: 'nutrition' },
  { id: 't4', title: 'Progressão de Carga', text: 'Aumente a carga gradualmente (5-10%) a cada 2 semanas para continuar evoluindo.', icon: 'trending-up' },
  { id: 't5', title: 'Não pule o aquecimento', text: '5-10 minutos de aquecimento diminuem em 50% o risco de lesões durante o treino.', icon: 'flame' },
  { id: 't6', title: 'Carboidratos antes do treino', text: 'Carboidratos complexos 1-2h antes garantem energia suficiente para treinar pesado.', icon: 'flash' },
];
