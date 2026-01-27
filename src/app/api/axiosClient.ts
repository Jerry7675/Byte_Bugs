import axios from 'axios';

let currentAccessToken = '';
let currentRefreshToken = '';

//load tokens if browser
if (typeof window !== 'undefined') {
  currentAccessToken = localStorage.getItem('accessToken') || '';
  currentRefreshToken = localStorage.getItem('refreshToken') || '';
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

//add token
api.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${currentAccessToken}`;
  }
  return config;
});

//refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && currentRefreshToken) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/refresh`,
          {
            refreshToken: currentRefreshToken,
          },
        );
        currentAccessToken = refreshResponse.data.accessToken;
        if (typeof window !== 'undefined') localStorage.setItem('accessToken', currentAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${currentAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        currentAccessToken = '';
        currentRefreshToken = '';
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export function setTokens(newAccessToken: string, newRefreshToken: string) {
  currentAccessToken = newAccessToken || '';
  currentRefreshToken = newRefreshToken || '';
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', currentAccessToken);
    localStorage.setItem('refreshToken', currentRefreshToken);
  }
}

export function clearTokens() {
  currentAccessToken = '';
  currentRefreshToken = '';
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export default api;
