import apiClient from '@/api';

export function sayHello(): Promise<any> {
    return apiClient.get<{ message: string, time: string }>('/api/hello');
}

export function loginApi(data: any): Promise<any> {
    return apiClient.post('/api/auth/login', data);
}

export function getPublicKeyApi(): Promise<String> {
    return apiClient.get('/api/public-key');
}