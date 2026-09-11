import api from "./api";
import type { SiteSettings } from "../types";
import { demoSettings } from "../data/demoData";

export const settingsService = {
  get: () =>
    api
      .get<SiteSettings>("/settings")
      .then((r) => r.data)
      .catch(() => demoSettings),

  update: (data: Partial<SiteSettings>) =>
    api.put<SiteSettings>("/settings", data).then((r) => r.data),

  uploadBanner: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<SiteSettings>("/settings/banner", form).then((r) => r.data);
  },

  removeBanner: () =>
    api.delete<SiteSettings>("/settings/banner").then((r) => r.data),
};
