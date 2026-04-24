export interface User {
    id: number;
    email: string;
    created_at: string;
}


export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}



export interface LoginRequest {
    email: string;
    password: string
}

export interface SignupRequest {
    email: string;
    password: string;
    password_confirmation: string;
}

