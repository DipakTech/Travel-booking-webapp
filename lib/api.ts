import { retryWithBackoff } from "./retry";

/**
 * Default fetch options for all API requests
 */
const defaultOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * API client with methods for different HTTP methods
 */
const api = {
  /**
   * GET request
   */
  get: async <T>(url: string, options?: RequestInit): Promise<T> => {
    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        method: "GET",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.message || `Request failed with status ${response.status}`,
        );
      }

      return response.json();
    });
  },

  /**
   * POST request
   */
  post: async <T>(
    url: string,
    data: any,
    options?: RequestInit,
  ): Promise<T> => {
    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.message || `Request failed with status ${response.status}`,
        );
      }

      return response.json();
    });
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data: any, options?: RequestInit): Promise<T> => {
    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.message || `Request failed with status ${response.status}`,
        );
      }

      return response.json();
    });
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string, options?: RequestInit): Promise<T> => {
    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.message || `Request failed with status ${response.status}`,
        );
      }

      return response.json();
    });
  },

  /**
   * PATCH request
   */
  patch: async <T>(
    url: string,
    data: any,
    options?: RequestInit,
  ): Promise<T> => {
    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.message || `Request failed with status ${response.status}`,
        );
      }

      return response.json();
    });
  },

  async upload<T>(
    url: string,
    file: File,
    fieldName = "file",
    options = {},
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.post<T>(url, formData, {
      ...options,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
