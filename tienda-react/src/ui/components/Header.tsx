import { Link, NavLink } from "react-router-dom";
import formatearPrecio from "../formato";
import { useCart } from "../../aplicacion/useCart";
import { useSesion } from "../../aplicacion/useSesion";
import { useFavoritos } from "../../aplicacion/useFavoritos";

interface Props {
    nombre : string;
    eslogan?: string;
}
export default function Header ( {nombre , eslogan} : Props) {
    const {unidades, total} = useCart();
    const  {usuario, salir} = useSesion();
    const { favoritos } = useFavoritos();
    return(
        <header className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <div>
                {/*el nombre de la tienda ahora es un enlace al inicio */}
                <h1 className="text-3xl font-bold">
                    <Link to="/">{nombre}</Link>
                </h1>
                <p className="text-sm text-gray-500">{eslogan}</p>
                <nav className="mt-2 flex gap-4">
                    <NavLink to="/" className={({isActive}) => (isActive ? 'font-bold underline' : 'hover:underline')}>Catalogo</NavLink>
                    <NavLink to="/checkout" className={({isActive}) => (isActive ? 'font-bold underline' : 'hover:underline')}>Checkout</NavLink>
                </nav>
            </div>
            {/* Un solo resumen, con el carrito, los productos y el total juntos */}
            <div className="flex items-center gap-3">
                <p>🛒 {unidades} productos - {formatearPrecio(total)}</p>
                {/* "> 0 &&" evita que aparezca un 0 suelto cuando no hay favoritos */}
                {favoritos.length > 0 && (
                    <p className="text-red-500" aria-label={`${favoritos.length} favoritos`}>♥ {favoritos.length}</p>
                )}
            </div>
            {
                usuario ? (
                    <p className="text-sm">Hola, {usuario.nombre}
                        <button className="ml-2 underline" onClick={salir}>Salir</button>
                    </p>
                ) : (
                    <Link to="/login" className="text-sm underline">Inicie Sesion</Link>
                )
            }
        </header>
    )
}