import AsyncStorage from '@react-native-async-storage/async-storage';
// ─── API Remota (NutriCode API) ──────────────────────────

const API_BASE_URL = 'https://nutricode-api.onrender.com';

// Interface baseada nos atributos que seu MealFood e Refeicao já utilizam.
// Ajuste os nomes das propriedades se o seu Swagger retornar em português (ex: calorias, carboidratos).
export interface AlimentoAPI {
  id: string; // ou number, dependendo do seu backend
  nome: string;
  porcao: number; // ex: gramas
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

/**
 * Busca a lista de todos os alimentos disponíveis no backend.
 * Baseado no endpoint do AlimentoController (listarTodos).
 */
export async function fetchTodosAlimentos(): Promise<AlimentoAPI[]> {
  try {
    // Nota: O caminho exato pode ser /alimentos ou /api/alimentos. 
    // Verifique no seu Swagger o "Request URL" exato.
    const response = await fetch(`${API_BASE_URL}/alimentos`);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data: AlimentoAPI[] = await response.json();
    return data;
  } catch (error) {
    console.error('Falha ao buscar alimentos da API:', error);
    // Retorna array vazio em caso de erro para não quebrar o app
    return [];
  }
}

/**
 * Busca um alimento específico por ID, caso precise mostrar detalhes.
 */
export async function fetchAlimentoPorId(id: string): Promise<AlimentoAPI | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/alimentos/${id}`);
    if (!response.ok) throw new Error('Alimento não encontrado');
    return await response.json();
  } catch (error) {
    console.error(`Falha ao buscar alimento ${id}:`, error);
    return null;
  }
}

/**
 * Utilitários de armazenamento local — NutriCode v2
 * Gerencia dados de água, treino, alimentação e plano semanal.
 * Usa chaves com data para isolar dados diários.
 */

// ─── Helpers ─────────────────────────────────────────────

function chaveHoje(prefixo: string): string {
  return `${prefixo}_${new Date().toISOString().split('T')[0]}`;
}

/**
 * Wrapper seguro para leitura + modificação + escrita no AsyncStorage.
 * Evita race conditions quando múltiplas chamadas concorrentes fazem
 * read-modify-write na mesma chave.
 */
const locks = new Map<string, Promise<void>>();

async function readModifyWrite<T>(
  chave: string,
  valorPadrao: T,
  modificador: (atual: T) => T
): Promise<T> {
  const anterior = locks.get(chave) ?? Promise.resolve();

  let resultado: T;
  const novaPromise = anterior.then(async () => {
    const dados = await AsyncStorage.getItem(chave);
    const atual: T = dados ? JSON.parse(dados) : valorPadrao;
    resultado = modificador(atual);
    await AsyncStorage.setItem(chave, JSON.stringify(resultado));
  });

  locks.set(chave, novaPromise.catch(() => { }));
  await novaPromise;
  return resultado!;
}

// ─── Água ────────────────────────────────────────────────

export async function getTodayWater(): Promise<number> {
  const dados = await AsyncStorage.getItem(chaveHoje('@agua'));
  return dados ? parseInt(dados, 10) : 0;
}

export async function addWater(ml: number): Promise<number> {
  const chave = chaveHoje('@agua');
  return readModifyWrite(chave, 0, (atual) => Math.max(0, atual + ml));
}

export async function setTodayWater(ml: number): Promise<void> {
  await AsyncStorage.setItem(chaveHoje('@agua'), String(Math.max(0, ml)));
}

export interface WaterLog {
  date: string;   // YYYY-MM-DD
  intakeMl: number;
}

export async function getWaterLog(dias: number = 30): Promise<WaterLog[]> {
  const logs: WaterLog[] = [];
  for (let i = dias - 1; i >= 0; i--) {
    const data = new Date();
    data.setDate(data.getDate() - i);
    const chaveData = data.toISOString().split('T')[0];
    const dados = await AsyncStorage.getItem(`@agua_${chaveData}`);
    logs.push({ date: chaveData, intakeMl: dados ? parseInt(dados, 10) : 0 });
  }
  return logs;
}

// ─── Treino (Exercícios do Dia) ──────────────────────────

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  completed?: boolean;
}

export interface DailyWorkout {
  exercises: WorkoutExercise[];
  completed: boolean;
  time: string;
}

export async function getTodayWorkout(): Promise<DailyWorkout> {
  const dados = await AsyncStorage.getItem(chaveHoje('@treino'));
  return dados ? JSON.parse(dados) : { exercises: [], completed: false, time: '' };
}

export async function saveTodayWorkout(treino: DailyWorkout): Promise<void> {
  await AsyncStorage.setItem(chaveHoje('@treino'), JSON.stringify(treino));
}

export async function addExerciseToday(exercicio: WorkoutExercise): Promise<DailyWorkout> {
  const chave = chaveHoje('@treino');
  return readModifyWrite(
    chave,
    { exercises: [], completed: false, time: '' } as DailyWorkout,
    (atual) => ({
      ...atual,
      exercises: [...atual.exercises, exercicio],
    })
  );
}

export async function removeExerciseToday(exerciseId: string): Promise<DailyWorkout> {
  const chave = chaveHoje('@treino');
  return readModifyWrite(
    chave,
    { exercises: [], completed: false, time: '' } as DailyWorkout,
    (atual) => ({
      ...atual,
      exercises: atual.exercises.filter((e) => e.exerciseId !== exerciseId),
    })
  );
}

// ─── Plano Semanal de Treino ─────────────────────────────

export interface WeeklyPlan {
  [dia: string]: DailyWorkout;
}

export async function getWorkoutPlan(): Promise<WeeklyPlan> {
  const dados = await AsyncStorage.getItem('@plano_semanal');
  if (dados) return JSON.parse(dados);

  const planoVazio: WeeklyPlan = {};
  const dias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
  for (const dia of dias) {
    planoVazio[dia] = { exercises: [], completed: false, time: '' };
  }
  return planoVazio;
}

export async function saveWorkoutPlan(plano: WeeklyPlan): Promise<void> {
  await AsyncStorage.setItem('@plano_semanal', JSON.stringify(plano));
}

// ─── Alimentação ─────────────────────────────────────────

export interface Refeicao {
  id: string;
  tipo: string;
  nome: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  hora: string;
}

export async function getTodayMeals(): Promise<Refeicao[]> {
  const dados = await AsyncStorage.getItem(chaveHoje('@refeicoes'));
  return dados ? JSON.parse(dados) : [];
}

export async function addMeal(refeicao: Refeicao): Promise<Refeicao[]> {
  const chave = chaveHoje('@refeicoes');
  return readModifyWrite(chave, [] as Refeicao[], (atual) => [...atual, refeicao]);
}

export async function removeMeal(id: string): Promise<Refeicao[]> {
  const chave = chaveHoje('@refeicoes');
  return readModifyWrite(chave, [] as Refeicao[], (atual) =>
    atual.filter((r) => r.id !== id)
  );
}

export async function getTodayCalories(): Promise<number> {
  const refeicoes = await getTodayMeals();
  return refeicoes.reduce((total, r) => total + r.calorias, 0);
}

// ─── Plano Semanal de Alimentação ────────────────────────

export interface MealFood {
  foodId: string;
  name: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealSlotData {
  foods: MealFood[];
}

export interface MealPlan {
  [dia: string]: { [slot: string]: MealSlotData };
}

/** Alias used by page.tsx */
export type WeeklyMealPlan = MealPlan;

export async function getMealPlan(): Promise<MealPlan> {
  const dados = await AsyncStorage.getItem('@plano_alimentar');
  if (dados) return JSON.parse(dados);

  const planoVazio: MealPlan = {};
  const dias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
  for (const dia of dias) {
    planoVazio[dia] = {};
  }
  return planoVazio;
}

export async function saveMealPlan(plano: MealPlan): Promise<void> {
  await AsyncStorage.setItem('@plano_alimentar', JSON.stringify(plano));
}
