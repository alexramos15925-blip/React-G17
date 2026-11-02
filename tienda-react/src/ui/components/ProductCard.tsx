import formatearPrecio from "../formato";
import type { Producto } from "../../dominio/tipos";
import EtiquetaStock from "./EtiquetaStock";
import { memo } from "react";

interface Props {
  producto : Producto;
  onAgregar : (producto : Producto) => void;
  esFavorito : boolean;
  onAlternarFavorito : (id : number) => void;
}
// Tarea 2: Cada tarjeta tiene su boton para favorito
function ProductCard({ producto, onAgregar, esFavorito, onAlternarFavorito } : Props) {
  const agotado = producto.stock === 0;
  return (
    <article className={`w-64 rounded-xl border p-4 ${agotado && 'opacity-50'}`}>
        <button
          type="button"
          onClick={() => onAlternarFavorito(producto.id)}
          aria-label={esFavorito ? `Quitar ${producto.nombre} de favoritos` : `Marcar ${producto.nombre} como favorito`}
          className={`absolute right-3 top-3 text-2xl leading-none ${esFavorito ? 'text-red-500' : 'text-gray-400'}`}
        >
          {esFavorito ? '♥' : '♡'}
        </button>
        <img src={producto.imagen} alt={producto.nombre} className="mb-3 aspect-square object-contain" />
        <p className="text-sm text-gray-500">{producto.marca}</p>
        <h2 className="font-semibold">{producto.nombre}</h2>
        <p className="text-sm">{
            producto.stock === 0 ? 'Agotado' : `${producto.stock} disponibles`
        }</p>
        <EtiquetaStock stock={producto.stock}/>
        <p className="text-xs text-gray-500">{(producto.precio * 1.18).toFixed(2)} con IGV</p>
        <p className="mt-2">{formatearPrecio(producto.precio)}</p>
        <button className="mt-3 rounded-full border px-4 text-sm" disabled={producto.stock===0}
        onClick={() => onAgregar(producto)}
        >
          {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
    </article>
  )
}

export default memo(ProductCard);