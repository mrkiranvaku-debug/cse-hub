import api from "./api";
import type { Session, SessionInput } from "../types";
import { demoSessions } from "../data/demoData";

export interface SessionFilters {
  categoryId?: number;
  q?: string;
}

export const sessionService = {
  getAll: (filters: SessionFilters = {}) =>
    api
      .get<Session[]>("/sessions", { params: filters })
      .then((r) => r.data)
      .catch(() => {
        let sessions = [...demoSessions];

        if (filters.categoryId !== undefined) {
          sessions = sessions.filter(
            (session) => session.categoryId === filters.categoryId,
          );
        }

        if (filters.q) {
          const query = filters.q.toLowerCase();

          sessions = sessions.filter(
            (session) =>
              session.title.toLowerCase().includes(query) ||
              session.content?.toLowerCase().includes(query) ||
              session.tags.some((tag) => tag.toLowerCase().includes(query)),
          );
        }

        return sessions;
      }),

  getById: (id: number) =>
    api
      .get<Session>(`/sessions/${id}`)
      .then((r) => r.data)
      .catch(() => {
        const session = demoSessions.find((session) => session.id === id);

        if (!session) {
          throw new Error("Session not found");
        }

        return session;
      }),
  create: (data: SessionInput) =>
    api.post<Session>("/sessions", data).then((r) => r.data),

  update: (id: number, data: SessionInput) =>
    api.put<Session>(`/sessions/${id}`, data).then((r) => r.data),

  remove: (id: number) => api.delete(`/sessions/${id}`),
};
