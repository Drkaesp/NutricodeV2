import AsyncStorage from '@react-native-async-storage/async-storage';

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

  locks.set(chave, novaPromise.catch(() => {}));
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
