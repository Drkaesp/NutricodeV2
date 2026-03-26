import { FoodItem } from "@/constants/GameData";

/**
 * Serviço de integração com a API NutriCode (backend em Render).
 *
 * Swagger:
 * - GET /alimentos (operationId: listarTodos)
 * - GET /alimentos/buscar?nome=... (operationId: buscarPorNome)
 * - GET /alimentos/{id} (operationId: buscarPorId)
 */

const BASE_URL = "https://nutricode-api.onrender.com";

/** Formato de resposta retornado pela API */
interface AlimentoAPI {
  id: number;
  name: string;
  kcal: number;
  protein: number;
  carbohydrates: number;
  lipids: number;
  dietaryFiber: number;
}

/** Converte um alimento da API para o formato usado no app (FoodItem) */
function mapToFoodItem(item: AlimentoAPI): FoodItem {
  return {
    id: String(item.id),
    name: item.name,
    category: "outro",
    kcal: item.kcal,
    protein: item.protein,
    carbs: item.carbohydrates,
    fat: item.lipids,
    fiber: item.dietaryFiber,
    icon: "nutrition",
  };
}

/**
 * Lista completa (não filtrada) de alimentos.
 * GET /alimentos
 */
export async function listarTodosAlimentos(): Promise<FoodItem[]> {
  const response = await fetch(`${BASE_URL}/alimentos`);
  if (!response.ok) {
    throw new Error(`Erro ao listar alimentos: HTTP ${response.status}`);
  }

  const data: AlimentoAPI[] = await response.json();
  return data.map(mapToFoodItem);
}

/**
 * Busca alimentos pelo nome na API Nutricode.
 * GET /alimentos/buscar?nome={query}
 */
export async function searchAlimentos(query: string): Promise<FoodItem[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `${BASE_URL}/alimentos/buscar?nome=${encodeURIComponent(query.trim())}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro na busca: ${response.status}`);
  }

  const data: AlimentoAPI[] = await response.json();
  return data.map(mapToFoodItem);
}

/**
 * Busca um alimento específico por ID.
 * GET /alimentos/{id}
 */
export async function getAlimentoById(id: number): Promise<FoodItem | null> {
  const url = `${BASE_URL}/alimentos/${id}`;
  const response = await fetch(url);

  if (!response.ok) return null;

  const data: AlimentoAPI = await response.json();
  return mapToFoodItem(data);
}
