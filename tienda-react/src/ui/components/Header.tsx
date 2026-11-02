import { Link, NavLink } from "react-router-dom";
import formatearPrecio from "../formato";
import { useCart } from "../../aplicacion/useCart";
import { useSesion } from "../../aplicacion/useSesion";

interface Props {
    nombre : string;
    eslogan?: string;
    resumen?:  string;
}
export default function Header ( {nombre , eslogan, resumen} : Props) {
    const {unidades, total} = useCart();
    const  {usuario, salir} = useSesion();
    return(
        <header className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">{nombre}</h1>
                <p className="text-sm text-gray-500">{eslogan}</p>
                <nav className="mt-2 flex gap-4">
                    <NavLink to="/" className={({isActive}) => (isActive ? 'font-bold underline' : 'hover:underline')}>Catalogo</NavLink>
                    <NavLink to="/checkout" className={({isActive}) => (isActive ? 'font-bold underline' : 'hover:underline')}>Checkout</NavLink>
                </nav>
            </div>
            <p>{unidades} productos - {formatearPrecio(total)}</p>
            <p>{ resumen ?? '🛒 0 productos'}</p>
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
