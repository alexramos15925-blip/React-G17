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
function ProductCard({ producto, onAgregar, esFavorito, onAlternarFavorito } : Props) {
  const agotado = producto.stock === 0;
  return (
    // "relative" hace que el corazon (absolute) quede dentro de la tarjeta y no en la esquina de la pagina.
    // "w-full" deja que el ancho lo decida la grilla de Home.
    <article className={`relative flex h-full w-full flex-col rounded-xl border p-3 sm:p-4 ${agotado ? 'opacity-50' : ''}`}>
        <button
          type="button"
          onClick={() => onAlternarFavorito(producto.id)}
          aria-label={esFavorito ? `Quitar ${producto.nombre} de favoritos` : `Marcar ${producto.nombre} como favorito`}
          aria-pressed={esFavorito}
          className={`absolute right-2 top-2 text-2xl leading-none ${esFavorito ? 'text-red-500' : 'text-gray-400'}`}
        >
          {esFavorito ? '♥' : '♡'}
        </button>
        <img src={producto.imagen} alt={producto.nombre} className="mb-3 aspect-square w-full object-contain" />
        <p className="text-sm text-gray-500">{producto.marca}</p>
        <h2 className="font-semibold">{producto.nombre}</h2>
        <p className="text-sm">{
            producto.stock === 0 ? 'Agotado' : `${producto.stock} disponibles`
        }</p>
        <EtiquetaStock stock={producto.stock}/>
        <p className="text-xs text-gray-500">{(producto.precio * 1.18).toFixed(2)} con IGV</p>
        <p className="mt-2">{formatearPrecio(producto.precio)}</p>
        {/* "mt-auto" empuja el boton al fondo para que todas las tarjetas de una fila queden alineadas */}
        <button className="mt-auto w-full rounded-full border px-2 py-1 text-xs sm:text-sm" disabled={producto.stock===0}
        onClick={() => onAgregar(producto)}
        >
          {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
    </article>
  )
}

export default memo(ProductCard);