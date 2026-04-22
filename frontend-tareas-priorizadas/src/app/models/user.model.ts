export interface User {
    id: number;
    email: string;
    created_at: string;
}


export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}



export interface SignUpRequest {
    email: string;
    password: string
}