import { apiClient } from "./client";
import { mockDashboard } from "@/mock/dashboard";


export const dashboardApi = {
  get: () => apiClient.get("/dashboard").then((r) => r.data),
};
