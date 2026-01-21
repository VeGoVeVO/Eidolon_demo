/**
 * API Client with automatic token refresh
 * Handles 401 errors by attempting to refresh the token
 */

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise(resolve => {
      subscribeToRefresh(newToken => {
        resolve(newToken);
      });
    });
  }

  isRefreshing = true;

  try {
    const currentToken = localStorage.getItem('virtual_tryon_token');
    if (!currentToken) {
      throw new Error('No token available');
    }

    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('virtual_tryon_token', data.session_token);
      isRefreshing = false;
      notifyRefreshSubscribers(data.session_token);
      return data.session_token;
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    isRefreshing = false;
    // Clear stored credentials on refresh failure
    localStorage.removeItem('virtual_tryon_token');
    localStorage.removeItem('virtual_tryon_user');
    throw error;
  }
};

export const apiCall = async (url, options = {}) => {
  let token = localStorage.getItem('virtual_tryon_token');

  if (!token) {
    throw new Error('No authentication token available');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  let response = await fetch(url, {
    ...options,
    headers
  });

  // If 401, try to refresh token and retry
  if (response.status === 401) {
    try {
      const newToken = await refreshToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, {
        ...options,
        headers
      });
    } catch (error) {
      console.error('Failed to refresh token, user needs to login again');
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('sessionExpired'));
      throw error;
    }
  }

  return response;
};

export default apiCall;

