import api from "./api";
import type { Category, CategoryInput } from "../types";
import { demoCategories } from "../data/demoData";

export const categoryService = {
  getAll: () =>
    api
      .get<Category[]>("/categories")
      .then((r) => r.data)
      .catch(() => demoCategories),

  getById: (id: number) =>
    api
      .get<Category>(`/categories/${id}`)
      .then((r) => r.data)
      .catch(() => demoCategories.find((category) => category.id === id)),

  create: (data: CategoryInput) =>
    api.post<Category>("/categories", data).then((r) => r.data),

  update: (id: number, data: CategoryInput) =>
    api.put<Category>(`/categories/${id}`, data).then((r) => r.data),

  /** reassignToId: required if the category still has resources/sessions attached. */
  remove: (id: number, reassignToId?: number) =>
    api.delete(`/categories/${id}`, {
      params: reassignToId ? { reassignToId } : {},
    }),

  reorder: (orderedIds: number[]) =>
    api.put<Category[]>("/categories/reorder", orderedIds).then((r) => r.data),
};
