const BASE_URL = "/api";

type Options = RequestInit & {
  params?: Record<string, any>;
};

export const apiClient = async (endpoint: string, options: Options = {}) => {
  const { params, ...rest } = options;

  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...rest,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};