export interface User {
    name: string;
    email: string;
    password: string;
    city: string;
    phone: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}