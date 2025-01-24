import apiClient from '@/api';

export function sayHello(): Promise<any> {
    return apiClient.get<{ message: string, time: string }>('/api/hello');
}

interface LoginData {
    username: string;
    password: string;
    email: string;
}

export function loginApi(data: LoginData): Promise<any> {
    return apiClient.post('/api/auth/login', { username: data.username, password: data.password, email:data.email});
}

export function getPublicKeyApi(): Promise<String> {
    return apiClient.get('/api/public-key');
}