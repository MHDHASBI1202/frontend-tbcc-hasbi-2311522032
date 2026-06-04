import axios, { AxiosInstance } from 'axios';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
  timestamp: number;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export class ApiService {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/');
      return response.status === 200 || response.status === 404;
    } catch (error) {
      return false;
    }
  }

  async getRecords(resource: string, page: number = 1, limit: number = 10) {
    try {
      const startTime = performance.now();
      const response = await this.axiosInstance.get(`/${resource}`, {
        params: { page, limit },
      });
      const endTime = performance.now();

      return {
        data: Array.isArray(response.data) ? response.data : response.data.items || [],
        total: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
        responseTime: endTime - startTime,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch records'
      );
    }
  }

  async createRecord(resource: string, data: any) {
    try {
      const startTime = performance.now();
      const response = await this.axiosInstance.post(`/${resource}`, data);
      const endTime = performance.now();

      return {
        data: response.data,
        responseTime: endTime - startTime,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create record'
      );
    }
  }

  async updateRecord(resource: string, id: string | number, data: any) {
    try {
      const startTime = performance.now();
      const response = await this.axiosInstance.put(`/${resource}/${id}`, data);
      const endTime = performance.now();

      return {
        data: response.data,
        responseTime: endTime - startTime,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update record'
      );
    }
  }

  async deleteRecord(resource: string, id: string | number) {
    try {
      const startTime = performance.now();
      const response = await this.axiosInstance.delete(`/${resource}/${id}`);
      const endTime = performance.now();

      return {
        data: response.data,
        responseTime: endTime - startTime,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete record'
      );
    }
  }

  async searchRecords(resource: string, query: string, limit: number = 10) {
    try {
      const startTime = performance.now();
      const response = await this.axiosInstance.get(`/${resource}`, {
        params: { search: query, limit },
      });
      const endTime = performance.now();

      return {
        data: Array.isArray(response.data) ? response.data : response.data.items || [],
        responseTime: endTime - startTime,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to search records'
      );
    }
  }
}

let apiServiceInstance: ApiService | null = null;

export function getApiService(baseUrl: string): ApiService {
  if (!apiServiceInstance) {
    apiServiceInstance = new ApiService(baseUrl);
  } else {
    apiServiceInstance.setBaseUrl(baseUrl);
  }
  return apiServiceInstance;
}
