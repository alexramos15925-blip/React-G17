import type { ItemCarrito, Producto } from "./tipos";

export function agregarItem (producto : Producto, items : ItemCarrito[]) : ItemCarrito[] {
    const existente = items.find((i) => i.id === producto.id);
    if(existente) {
        const respuesta = items.map((i) => (
            i.id === producto.id ? {...i, cantidad : i.cantidad + 1} : i
        ));
        return respuesta;
    }
    const respuesta = [...items, {
        id : producto.id,
        nombre : producto.nombre,
        precio : producto.precio,
        cantidad : 1
    }];
    return respuesta;
}

export function quitarItem (items : ItemCarrito[], id : number) : ItemCarrito[] {
    return items.filter((i) => i.id !== id);
}

export function cambiarCantidadItem (items : ItemCarrito[], id: number, cantidad: number) : ItemCarrito[] {
    if(cantidad < 1) return quitarItem(items, id);
    return items.map((item) => (
        item.id === id ? {...item, cantidad} : item
    ))
}

export type AccionCarrito = 
    | {tipo : 'agregar'; producto: Producto}
    | {tipo : 'quitar'; id: number}
    | {tipo : 'cambiarCantidad'; id : number ; cantidad : number}
    | {tipo : 'vaciar'}

export function reducirCarrito (items : ItemCarrito[], accion: AccionCarrito) : ItemCarrito [] {
    switch(accion.tipo) {
        case 'agregar' : 
            return agregarItem( accion.producto ,items); 
        case 'quitar' :
            return quitarItem(items, accion.id);
        case 'cambiarCantidad' : 
            return cambiarCantidadItem(items, accion.id, accion.cantidad);
        case 'vaciar' :
            return [];
    }
}