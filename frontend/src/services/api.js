const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Common network request wrapper for API communication.
 * Automatically injects JSON headers, handles auth token ingestion, and processes response formats.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      let errorMsg = 'Request failed';
      if (data?.detail) {
        // FastAPI often returns 'detail' as a string or array of errors
        errorMsg = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
      } else if (data?.message) {
        errorMsg = data.message;
      } else if (typeof data === 'string') {
        errorMsg = data;
      } else {
        errorMsg = response.statusText;
      }
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

export default api;
