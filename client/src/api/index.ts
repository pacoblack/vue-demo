// src/api/index.ts
import axios from 'axios';

interface ApiResponse<T> {
  data: T;
}

class ApiClient {
  private static instance: ApiClient;
  private readonly baseURL: string;

  private constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // 单例模式，确保只有一个API客户端实例
  public static getInstance(baseURL: string = 'http://localhost:5002'): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(baseURL);
    }
    return ApiClient.instance;
  }

  // GET 请求
  public async get<T>(url: string, options?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.get(`${this.baseURL}${url}`, options);
      return response.data;
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  // POST 请求
  public async post<T>(url: string, data?: any, options?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.post(`${this.baseURL}${url}`, data, options);
      return response.data;
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  // PUT 请求
  public async put<T>(url: string, data?: any, options?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.put(`${this.baseURL}${url}`, data, options);
      return response.data;
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  // DELETE 请求
  public async delete<T>(url: string, options?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.delete(`${this.baseURL}${url}`, options);
      return response.data;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }
}

const apiClient = ApiClient.getInstance();

export default apiClient;