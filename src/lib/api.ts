export const API_BASE_URL = "https://reasonable-acceptance-production.up.railway.app";
const NORMALIZED_API_BASE_URL = API_BASE_URL.replace(/\/$/, "");

export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${NORMALIZED_API_BASE_URL}/${path.replace(/^\//, "")}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}
