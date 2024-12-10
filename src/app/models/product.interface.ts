export interface ProductResponse{
    mensaje: string,
    resultado: Product[]
}

export interface Product{

    id_producto: number,
    producto: string,
    categoria: string,
    precio: number,
    cantidad: number,
    descripcion: string,
}