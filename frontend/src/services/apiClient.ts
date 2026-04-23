const BASE_URL = "/api";

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

export const SESSION_KEYS = {
  userId: "netflix_user_id",
  uploadedAt: "netflix_uploaded_at",
};

/** Returns true if the session is valid (uploaded within last 30 min) */
export const isSessionValid = (): boolean => {
  const userId = localStorage.getItem(SESSION_KEYS.userId);
  const uploadedAt = localStorage.getItem(SESSION_KEYS.uploadedAt);

  if (!userId || !uploadedAt) return false;

  const elapsed = Date.now() - parseInt(uploadedAt, 10);
  return elapsed < SESSION_TTL_MS;
};

/** Clears all session data from localStorage */
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEYS.userId);
  localStorage.removeItem(SESSION_KEYS.uploadedAt);
};

/** Returns remaining session time in minutes (0 if expired) */
export const sessionMinutesRemaining = (): number => {
  const uploadedAt = localStorage.getItem(SESSION_KEYS.uploadedAt);
  if (!uploadedAt) return 0;
  const remaining = SESSION_TTL_MS - (Date.now() - parseInt(uploadedAt, 10));
  return Math.max(0, Math.round(remaining / 60000));
};

type Options = RequestInit & {
  params?: Record<string, any>;
};

export const apiClient = async (endpoint: string, options: Options = {}) => {
  // Check session validity on every API call
  if (!isSessionValid()) {
    clearSession();
    window.location.href = "/upload";
    throw new Error("Session expired. Please re-upload your Netflix data.");
  }

  const { params, ...rest } = options;
  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const userId = localStorage.getItem(SESSION_KEYS.userId);

  // Hard-inject the identity header to prevent proxy stripping
  const headers = {
    ...(rest.headers || { "Content-Type": "application/json" }),
    "X-User-ID": userId || "guest",
  };

  const response = await fetch(url, {
    ...rest,
    headers,
  });



  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};