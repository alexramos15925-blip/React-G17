import { useEffect, useMemo, useState } from "react";
import type { EstadoCarga, Producto } from "../../dominio/tipos";
import { NOMBRE_TIENDA } from "../../dominio/tipos";
import SkeletonCard from "../components/SkeletonCard";
import ProductCard from "../components/ProductCard";
import { useCart } from "../../aplicacion/useCart";
import { useFavoritos } from "../../aplicacion/useFavoritos";

interface Props {
    esRespaldo : boolean ;
    OnReintentar : () => void;
    productos : Producto[];
    estado : EstadoCarga;
}

// Cambio 3: grilla responsiva. 2 columnas en celular, 3 en tablet, 4 en pantalla grande.
const GRILLA = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

export function Home ( {esRespaldo, OnReintentar, productos, estado} : Props) {
    const {agregar} = useCart();
    const {favoritos, alternar} = useFavoritos();
    // Cambio 4: la categoria 'favoritos' va despues de 'todas'
    const categorias = ['todas', 'favoritos', ...new Set(productos.map(p => p.categoria))];
    const [categoriaActiva, setCategoriaActiva] = useState<string>('todas');
    const [termino, setTermino] = useState('');
    const busqueda = termino.trim().toLowerCase();
    const visibles = useMemo( () => productos.filter( (p) => {
        const coincideCategoria =
            categoriaActiva === 'todas' ||
            (categoriaActiva === 'favoritos' ? favoritos.includes(p.id) : p.categoria === categoriaActiva);
        const coincideBusqueda =
            busqueda === '' ||
            p.nombre.toLowerCase().includes(busqueda) ||
            p.marca.toLowerCase().includes(busqueda);
        return coincideCategoria && coincideBusqueda;
    }), [productos, categoriaActiva, busqueda, favoritos]);
    useEffect(() => {
        document.title = `${NOMBRE_TIENDA} - ${visibles.length} resultados`;
    },[visibles.length]);

    return (
        <>
            {
                esRespaldo && (
                    <p className="mb-4 rounded-lg border border-orange-300 bg-orange-500 p-2 text-sm">
                        Mostrando el catalogo Local, no pudimos conectar con la tienda.
                    <button className="ml-2 underline" onClick={OnReintentar}>Reintentar</button>
                    </p>
                )
            }
            {/* flex-wrap: en el celular las categorias bajan a otra linea en vez de salirse de la pantalla */}
            <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
                {
                categorias.map((c) => (
                    <button key={c} onClick={() => setCategoriaActiva(c)}
                    className={`rounded-full border px-3 py-1 text-sm ${ c === categoriaActiva ? 'bg-black text-white' : ''}`}>
                        {c === 'favoritos' ? `♥ favoritos (${favoritos.length})` : c}
                    </button>
                ))
                }
            </nav>
            <input type="search" placeholder="Buscar por nombre o marca..."
                className="mb-4 w-full max-w-64 rounded-lg border px-3 py-2 text-sm"
                value={termino} aria-label="Buscar productos"
                onChange={(e) => setTermino(e.target.value)}
            />
            {estado === 'cargando' && (
                <section className={GRILLA}>
                    {Array.from({length : 8}).map((_, indice) => (
                        <SkeletonCard key={indice}/>
                    ))}
                </section>
            )}
            {estado === 'error' && <p className="text-red-600">No pudimos cargar los productos</p>}
            <p className="mb-4 text-sm text-gray-500">{visibles.length} productos</p>
            {estado === 'listo' && visibles.length === 0 && (
                <p className="text-gray-500">{
                    busqueda !== '' ? `No encontramos productos para "${termino.trim()}"` :
                    categoriaActiva === 'favoritos' ? 'Aun no marcaste ningun favorito' :
                    'No hay productos en esta categoria'
                }</p>
            )}
            {estado === 'listo' && (
                <section className={GRILLA}>
                {
                    visibles.map((p) => (
                        <ProductCard
                            producto={p}
                            key={p.id}
                            onAgregar={agregar}
                            esFavorito={favoritos.includes(p.id)}
                            onAlternarFavorito={alternar}
                        />
                    ))
                }
                </section>
                )
            }
        </>
    )
}