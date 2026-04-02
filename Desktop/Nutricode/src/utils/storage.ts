import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

// ─── Keys ───
const USERS_KEY = "USERS_V1";
const CURRENT_USER_KEY = "CURRENT_USER_V1";
const WORKOUT_PLAN_KEY = "WORKOUT_PLAN_V1";
const MEAL_PLAN_KEY = "MEAL_PLAN_V1";
const WATER_LOG_KEY = "WATER_LOG_V1";

// ─── Password Hashing ───
export async function hashPassword(password: string) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
}

// ─── User CRUD ───
export async function getUsers() {
  const json = await AsyncStorage.getItem(USERS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveUsers(users: any[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function addUser(user: { nome: string; email: string; senhaHash: string }) {
  const users = await getUsers();
  const exists = users.some((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) throw new Error("Email já cadastrado!");
  const id = Date.now().toString();
  users.push({ id, ...user, totalXP: 0, streak: 0 });
  await saveUsers(users);
}

export async function saveCurrentUser(user: any) {
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export async function getCurrentUser() {
  const json = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return json ? JSON.parse(json) : null;
}

export async function clearCurrentUser() {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function deleteUser(email: string) {
  const users = await getUsers();
  const filtered = users.filter((u: any) => u.email.toLowerCase() !== email.toLowerCase());
  await saveUsers(filtered);
}

export async function deleteAllUsers() {
  await AsyncStorage.removeItem(USERS_KEY);
}

// ─── Workout Plan ───
export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  images?: string[];
}

export interface DayWorkout {
  exercises: WorkoutExercise[];
  time: string;
  completed: boolean;
}

export type WeeklyWorkoutPlan = Record<string, DayWorkout>;

export async function getWorkoutPlan(): Promise<WeeklyWorkoutPlan> {
  const json = await AsyncStorage.getItem(WORKOUT_PLAN_KEY);
  return json ? JSON.parse(json) : {
    seg: { exercises: [], time: '', completed: false },
    ter: { exercises: [], time: '', completed: false },
    qua: { exercises: [], time: '', completed: false },
    qui: { exercises: [], time: '', completed: false },
    sex: { exercises: [], time: '', completed: false },
    sab: { exercises: [], time: '', completed: false },
    dom: { exercises: [], time: '', completed: false },
  };
}

export async function saveWorkoutPlan(plan: WeeklyWorkoutPlan) {
  await AsyncStorage.setItem(WORKOUT_PLAN_KEY, JSON.stringify(plan));
}

// ─── Meal Plan ───
export interface MealFood {
  foodId: string;
  name: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealSlot {
  foods: MealFood[];
}

export interface DayMeals {
  cafe: MealSlot;
  almoco: MealSlot;
  lanche: MealSlot;
  janta: MealSlot;
}

export type WeeklyMealPlan = Record<string, DayMeals>;

const emptyDayMeals: DayMeals = {
  cafe: { foods: [] },
  almoco: { foods: [] },
  lanche: { foods: [] },
  janta: { foods: [] },
};

export async function getMealPlan(): Promise<WeeklyMealPlan> {
  const json = await AsyncStorage.getItem(MEAL_PLAN_KEY);
  return json ? JSON.parse(json) : {
    seg: { ...emptyDayMeals },
    ter: { ...emptyDayMeals },
    qua: { ...emptyDayMeals },
    qui: { ...emptyDayMeals },
    sex: { ...emptyDayMeals },
    sab: { ...emptyDayMeals },
    dom: { ...emptyDayMeals },
  };
}

export async function saveMealPlan(plan: WeeklyMealPlan) {
  await AsyncStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
}

// ─── Water Log ───
export interface WaterLog {
  date: string; // YYYY-MM-DD
  intakeMl: number;
}

export async function getWaterLog(): Promise<WaterLog[]> {
  const json = await AsyncStorage.getItem(WATER_LOG_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveWaterLog(logs: WaterLog[]) {
  await AsyncStorage.setItem(WATER_LOG_KEY, JSON.stringify(logs));
}

export async function getTodayWater(): Promise<number> {
  const logs = await getWaterLog();
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);
  return todayLog?.intakeMl || 0;
}

export async function addWater(ml: number): Promise<number> {
  const logs = await getWaterLog();
  const today = new Date().toISOString().split('T')[0];
  const idx = logs.findIndex(l => l.date === today);
  if (idx >= 0) {
    logs[idx].intakeMl += ml;
  } else {
    logs.push({ date: today, intakeMl: ml });
  }
  // Keep only last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  const filtered = logs.filter(l => l.date >= cutoffStr);
  await saveWaterLog(filtered);
  const todayLog = filtered.find(l => l.date === today);
  return todayLog?.intakeMl || 0;
}
