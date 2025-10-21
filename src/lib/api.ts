let authToken: string | null = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) window.localStorage.setItem('authToken', token);
    else window.localStorage.removeItem('authToken');
  }
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  const url = typeof input === 'string' && input.startsWith('/') ? `${apiBase}${input}` : input;
  const headers = new Headers(init.headers || {});

  // Do not set a default Content-Type when body is FormData or when the caller supplied one.
  const body = init.body as any;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!isFormData && !headers.get('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (authToken) headers.set('Authorization', `Bearer ${authToken}`);
  const res = await fetch(url, { ...init, headers });
  return res;
}

export default {
  setAuthToken,
  apiFetch,
};
