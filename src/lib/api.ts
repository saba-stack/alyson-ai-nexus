import { supabase } from "@/integrations/supabase/client";

const API_BASE_URL = "https://reasonable-acceptance-production.up.railway.app";

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}/${path.replace(/^\//, "")}`;

  // Attach the authenticated user's bearer token so the backend can
  // independently verify identity. Falls back to no Authorization header
  // when the user isn't signed in (request will be rejected server-side).
  const { data: { session } } = await supabase.auth.getSession();
  const authHeader: Record<string, string> = session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {};

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

// API functions for each endpoint

export async function fetchCities() {
  try {
    const res = await apiFetch<{ success: boolean; data: any[] }>("api/cities");
    return res.data || [];
  } catch {
    return null;
  }
}

export async function fetchArticles(params?: { cityId?: string; status?: string; limit?: number }) {
  try {
    const query = new URLSearchParams();
    if (params?.cityId) query.set("cityId", params.cityId);
    if (params?.status) query.set("status", params.status);
    if (params?.limit) query.set("limit", String(params.limit));
    const res = await apiFetch<{ success: boolean; data: any[] }>(`api/articles?${query}`);
    return res.data || [];
  } catch {
    return null;
  }
}

export async function fetchDashboardMetrics() {
  try {
    const res = await apiFetch<{ success: boolean; data: any }>("api/analytics/overview");
    return res.data || null;
  } catch {
    return null;
  }
}

export async function fetchSubscribers(cityId?: string) {
  try {
    const query = cityId ? `?cityId=${cityId}` : "";
    const res = await apiFetch<{ success: boolean; data: any[] }>(`api/subscribers${query}`);
    return res.data || [];
  } catch {
    return null;
  }
}

export async function fetchCampaigns() {
  try {
    const res = await apiFetch<{ success: boolean; data: any[] }>("api/emails/campaigns");
    return res.data || [];
  } catch {
    return null;
  }
}

export async function fetchModerationQueue() {
  try {
    const res = await apiFetch<{ success: boolean; data: any[] }>("api/moderation/queue");
    return res.data || [];
  } catch {
    return null;
  }
}

export async function fetchRankings(cityId?: string) {
  try {
    const query = cityId ? `/${cityId}` : "";
    const res = await apiFetch<{ success: boolean; data: any[] }>(`api/ranking${query}`);
    return res.data || [];
  } catch {
    return null;
  }
}

export async function fetchIntegrations() {
  try {
    const res = await apiFetch<{ success: boolean; data: any[] }>("api/integrations");
    return res.data || [];
  } catch {
    return null;
  }
}

export { API_BASE_URL };
