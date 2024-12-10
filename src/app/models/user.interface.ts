export interface UserResponse{
    mensaje: string,
    usuario: User
}

export interface User{
    codigo: number,
    username: string,
    password: string,
    estado: number,
}