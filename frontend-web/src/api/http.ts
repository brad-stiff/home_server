export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API error ${res.status}: ${message}`);
  }

  const json = await res.json();

  // If the backend wraps responses in { data: ... }
  if (json && typeof json === "object" && "data" in json) {
    return json.data as T;
  }

  return json as T;
}
