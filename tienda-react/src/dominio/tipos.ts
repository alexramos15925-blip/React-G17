export interface Producto {
    id : number;
    nombre : string;
    marca: string;
    precio : number;
    imagen : string;
    stock : number;
    categoria : string;
}

export const NOMBRE_TIENDA = 'Tienda de Productos';
export type Categoria = 'todas'| 'laptops'|'audio'|'relojes'|'computadoras';
export type EstadoCarga = 'cargando' | 'listo' | 'error';

export interface ItemCarrito  {
    id: number;
    nombre : string;
    precio : number;
    cantidad : number;
}

export interface DatosEnvio {
    nombre: string;
    email : string; 
    direccion : string;
    telefono : string;
}

export interface Pedido {
    id: number;
    fecha : string;
    cliente : DatosEnvio;
    items : ItemCarrito[];
    total : number;
}

export interface Usuario {
    id : number; 
    nombre : string;
    email : string ; 
    token : string;
    expiraEn: number;
}

// Opiniones de productos (funcionalidad nueva)
export interface Opinion {
    id : string;
    autor : string;
    puntuacion : number; // de 1 a 5
    comentario : string;
    fecha : string;      
    propia : boolean;    // true si la escribio el usuario en esta tienda
}
 
// Lo que el formulario entrega: solo los datos que escribe el usuario
export type DatosOpinion = Pick<Opinion, 'autor' | 'puntuacion' | 'comentario'>;