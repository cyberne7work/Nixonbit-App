import { useAuth } from '@clerk/clerk-expo';

// Base URL for your backend API
const EXPO_PUBLIC_API_BASE_URL =  process.env.EXPO_PUBLIC_API_BASE_URL!;// Replace with your actual backend URL

// Define a generic type for API responses
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data: any = null,
  token?: string // Token is now an optional parameter
): Promise<T> => {
    console.log("API_BASE_URL", EXPO_PUBLIC_API_BASE_URL);
    console.log('endpoint', endpoint);
    console.log('method', method);
    console.log('data', data);
    console.log('token', token);
  // Note: useAuth must be called within a component or custom hook.
  // We'll handle token retrieval outside this function for flexibility.


  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    console.log(`${EXPO_PUBLIC_API_BASE_URL}${endpoint}`)
    const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    const result = (await response.json()) as T;
    return result;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

// Helper function to get the Clerk token (must be called within a Clerk context)
export const getAuthToken = async (): Promise<string> => {
  const { getToken } = useAuth();
  const token = await getToken();
  if (!token) {
    return '';
  }
  return token;
};

// Specific API methods for convenience
export const fetchSecureData = async (): Promise<ApiResponse<any>> => {
  return apiRequest<ApiResponse<any>>('/secure-endpoint');
};

export const postData = async (data: any): Promise<ApiResponse<any>> => {
  return apiRequest<ApiResponse<any>>('/secure-endpoint', 'POST', data);
};

// Add more specific API calls as needed
// export const updateData = async (id: string, data: any): Promise<ApiResponse<any>> => {
//   return apiRequest<ApiResponse<any>>(`/secure-endpoint/${id}`, 'PUT', data);
// };