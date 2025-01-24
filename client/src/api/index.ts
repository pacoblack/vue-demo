// src/api/index.ts
import axios from 'axios';

// 自定义请求配置接口
interface RequestConfig {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

class ApiClient {
  private static instance: ApiClient;
  private axiosConfig: any;

  private constructor(baseURL: string) {
    this.axiosConfig = {
      baseURL,
      headers: {
        'Content-Type': 'application/json', // 默认内容类型
        'aaa':'bbb'
      },
      timeout: 60000, // 默认超时时间 60 秒
    };
  }

  // 获取单例实例的方法
  public static getInstance(baseURL: string = ''): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(baseURL);
    }
    return ApiClient.instance;
  }

  // 发起请求的方法
  private async request<T>(config: RequestConfig): Promise<T> {
    try {
      const response = await axios({
        ...this.axiosConfig,
        url: config.url,
        method: config.method,
        data: config.data,
        headers: {
          ...this.axiosConfig.headers, // 默认头信息
          ...config.headers, // 用户提供的额外头信息
        },
        timeout: config.timeout || this.axiosConfig.timeout, // 超时时间
      });

      return response.data as T;
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  // 发起 GET 请求
  public async get<T>(url: string, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>({ url, method: 'get', headers: customHeaders });
  }

  // 发起 POST 请求
  public async post<T>(url: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>({ url, method: 'post', data, headers: customHeaders });
  }

  // 发起 PUT 请求
  public async put<T>(url: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>({ url, method: 'put', data, headers: customHeaders });
  }

  // 发起 DELETE 请求
  public async delete<T>(url: string, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>({ url, method: 'delete', headers: customHeaders });
  }
}

// 导出一个实例化的客户端，默认只配置 baseUrl
export default ApiClient.getInstance('http://localhost:5002'); // 替换为你的服务器 URL