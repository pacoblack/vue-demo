import apiClient from '@/api';
import axios from 'axios';

export function sayHello(): Promise<axios.AxiosResponse> {
    return apiClient.get<{ message: string, time: string }>('/api/hello');
}

interface LoginData {
    username: string;
    password: string;
    email: string;
}

export function loginApi(data: LoginData): Promise<axios.AxiosResponse> {
    return apiClient.post('/api/auth/login', { username: data.username, password: data.password, email:data.email});
}