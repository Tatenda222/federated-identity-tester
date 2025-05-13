import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export const API_BASE_URL = 'http://localhost:5000';

export const apiRequest = async (
  method: string,
  endpoint: string,
  body?: any
): Promise<Response> => {
  console.log(`API Request: ${method} ${endpoint}`); // Debug log
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add the authentication token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Auth token found and added to headers'); // Debug log
  } else {
    console.log('No auth token found'); // Debug log
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`API Response: ${response.status} ${response.statusText}`); // Debug log

    if (!response.ok) {
      if (response.status === 401) {
        console.log('Unauthorized response (401), clearing tokens'); // Debug log
        // Clear the token if we get an unauthorized response
        localStorage.removeItem('auth_token');
        localStorage.removeItem('main_app_token');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('API request error:', error); // Debug log
    throw error;
  }
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
