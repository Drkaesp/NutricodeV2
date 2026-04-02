import { Exercise, FoodItem } from '@/constants/GameData';

const BASE_URL = 'https://nutricode-api.onrender.com';

function mapMuscleGroup(muscle?: string): any {
  if (!muscle) return 'outro';
  const m = muscle.toLowerCase();
  if (m.includes('peitoral') || m.includes('peito')) return 'peito';
  if (m.includes('costas') || m.includes('dorsais') || m.includes('latíssimo') || m.includes('meio-das-costas') || m.includes('inferior-das-costas')) return 'costas';
  if (m.includes('ombro') || m.includes('deltóide') || m.includes('ombros')) return 'ombro';
  if (m.includes('biceps') || m.includes('bíceps')) return 'biceps';
  if (m.includes('triceps') || m.includes('tríceps')) return 'triceps';
  if (m.includes('leg') || m.includes('perna') || m.includes('quadriceps') || m.includes('quadríceps') || m.includes('isquiotibiais') || m.includes('panturrilha') || m.includes('adutores') || m.includes('abdutores')) return 'perna';
  if (m.includes('gluteo') || m.includes('glúteo')) return 'gluteo';
  if (m.includes('abdom') || m.includes('abdômen') || m.includes('abdominal')) return 'abdomen';
  if (m.includes('cardio')) return 'cardio';
  return 'outro';
}

export interface ApiExercise {
  id: string;
  name: string;
  primaryMuscles?: string[];
  equipment?: string;
  images?: string[];
}

export async function fetchExercisesFromApi(): Promise<(Exercise & { images: string[] })[]> {
  try {
    const res = await fetch(`${BASE_URL}/exercicios`);
    const data = await res.json();
    return data.content.map((item: ApiExercise) => ({
      id: item.id,
      name: item.name,
      muscleGroup: mapMuscleGroup(item.primaryMuscles?.[0]),
      equipment: item.equipment || 'Corpo',
      defaultSets: 3,
      defaultReps: 12,
      icon: 'barbell',
      images: item.images || [],
    }));
  } catch (error) {
    console.error('Error fetching exercises', error);
    return [];
  }
}

export interface ApiFood {
  id: number;
  name: string;
  kcal: number;
  protein: number;
  carbohydrates: number;
  lipids: number;
  dietaryFiber: number;
}

export async function fetchFoodsFromApi(): Promise<FoodItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/alimentos`);
    const data = await res.json();
    return data.map((item: ApiFood) => ({
      id: item.id.toString(),
      name: item.name,
      category: 'outro', // Category isn't easily mapped, defaulting
      kcal: item.kcal || 0,
      protein: item.protein || 0,
      carbs: item.carbohydrates || 0,
      fat: item.lipids || 0,
      fiber: item.dietaryFiber || 0,
      icon: 'nutrition',
    }));
  } catch (error) {
    console.error('Error fetching foods', error);
    return [];
  }
}
