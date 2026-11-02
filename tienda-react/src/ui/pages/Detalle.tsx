import { Link, useParams } from "react-router-dom";
import type { Producto } from "../../dominio/tipos";
import EtiquetaStock from "../components/EtiquetaStock";
import formatearPrecio from "../formato";
import { useCart } from "../../aplicacion/useCart";

interface Props {
    productos : Producto [];
}
export default function Detalle ( {productos} : Props) {
    const {id} = useParams();
    const {agregar} = useCart();
    const producto = productos.find( (p) => p.id === Number(id));
    if(!producto) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Producto no encontrado</p>
                <Link to="/">Volver al catalogo</Link>
            </div>
        )
    }
    return (
        <article className="flex flex-wrap gap-8 p-6">
            <img src={producto.imagen} alt={producto.nombre} className="w-72 rounded-xl object-contain" />
            <div>
                <p className="text-sm text-gray-500">{producto.marca}</p>
                <h1 className="text-2xl font-bold">{producto.nombre}</h1>
                <EtiquetaStock stock={producto.stock}></EtiquetaStock>
                <p className="mt-2 text-xl">{formatearPrecio(producto.precio * 1.18)} con IGV</p>
                <button className="mt-4 rounded-full border px-4 py-1"
                onClick={() => agregar(producto)}
                >
                    {
                        producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'
                    }
                </button>
            </div>
        </article>
    )
}