import { Link, useLocation, useParams } from "react-router-dom";
import type { Producto } from "../../dominio/tipos";
import { useOpiniones } from "../../aplicacion/useOpiniones";
import { useSesion } from "../../aplicacion/useSesion";
import TarjetaOpinion from "../components/TarjetaOpinion";
import FormularioOpinion from "../components/FormularioOpinion";

interface Props {
    productos : Producto[];
}

// PUNTO 6: pagina que vive en la ruta /producto/:id/opiniones
export default function Opiniones({ productos } : Props) {
    const { id } = useParams();                 // el :id de la URL llega como texto
    const idProducto = Number(id);
    const ubicacion = useLocation();
    const { usuario } = useSesion();            // PUNTO 9: leemos la sesion para decidir si puede opinar
    const { opiniones, promedio, estado, reintentar, agregar } = useOpiniones(idProducto);

    // Si el catalogo aun no cargo, mostramos un titulo generico en vez de "no encontrado"
    const titulo = productos.find((p) => p.id === idProducto)?.nombre ?? `producto ${id}`;

    return (
        <section className="flex max-w-2xl flex-col gap-4">
            <Link to="/" className="text-sm underline">Volver al catalogo</Link>
            <h1 className="text-2xl font-bold">Opiniones de {titulo}</h1>

            {/* PUNTO 5: los tres estados + boton para reintentar */}
            {estado === 'cargando' && <p className="text-sm text-gray-500">Cargando opiniones...</p>}
            {estado === 'error' && (
                <p className="text-sm text-red-600" role="alert">
                    No pudimos cargar las opiniones de la tienda.
                    <button className="ml-2 underline" onClick={reintentar}>Reintentar</button>
                </p>
            )}

            {/* PUNTO 2: "> 0 &&" evita que React escriba un 0 en pantalla */}
            {opiniones.length > 0 && (
                <p className="text-sm">
                    Promedio: <b>{promedio.toFixed(1)}</b> / 5 ({opiniones.length} {opiniones.length === 1 ? 'opinion' : 'opiniones'})
                </p>
            )}
            {estado === 'listo' && opiniones.length === 0 && (
                <p className="text-gray-500">Aun no hay opiniones. Se el primero en opinar.</p>
            )}

            <ul className="flex flex-col gap-3">
                {opiniones.map((o) => (
                    <TarjetaOpinion key={o.id} opinion={o} />
                ))}
            </ul>

            {usuario ? (
                <FormularioOpinion autor={usuario.nombre} onEnviar={agregar} />
            ) : (
                <p className="text-sm">
                    Para dejar tu opinion{' '}
                    <Link to="/login" state={{ desde : ubicacion.pathname }} className="underline">inicia sesion</Link>.
                </p>
            )}
        </section>
    );
}