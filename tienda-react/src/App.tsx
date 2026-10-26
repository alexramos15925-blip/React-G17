import { useState, useEffect } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ProductCard from "./components/ProductCard"
import type {EstadoCarga, ItemCarrito, Producto} from "./tipos"
import { agregarItem, quitarItem } from "./carrito"
import formatearPrecio from "./formato"
import { obtenerProductos } from "./api"
import SkeletonCard from "./components/SkeletonCard"
import Practica from "./Practica"

const CLAVE_CARRITO = 'tienda_carrito';
// Tarea 1: Cambias el nombre aquí y se actualiza en el header, el footer
const nombreTienda = 'Vida Tech';
export default function App() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>(leerCarrito);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todas');
  const [termino, setTermino] = useState('');

  const [productos, setProductos] = useState<Producto[]>([]);
  const [estado, setEstado] = useState<EstadoCarga>('cargando');
  const [esRespaldo, setEsRespaldo] = useState(false);
  const categorias = ['todas', ...new Set(productos.map(p => p.categoria))];
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    const controlador = new AbortController();
    async function cargar () {
      try {
        const resultado = await obtenerProductos();
        setProductos(resultado.productos);
        setEsRespaldo(resultado.esRespaldo);
        setEstado('listo');
      } catch (error) {
        if(error instanceof DOMException && error.name === 'AbortError') return;
        console.warn('Fallo imprevisto al cargar');
        setEstado('error');
      }
    }
    cargar();
    return () => controlador.abort();
  },[intento])
  useEffect( () => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
      console.warn('No se pudo guardar el carrito', error instanceof Error ? error.message : error);
    }
  }, [carrito]);
  
  const busqueda = termino.trim().toLowerCase();  

  const visibles = productos.filter( (p) => (
    (categoriaActiva === 'todas' || p.categoria === categoriaActiva) && 
    (busqueda === '' || p.nombre.toLowerCase().includes(busqueda) || 
    p.marca.toLowerCase().includes(busqueda))
  ));
  
  useEffect(() => {
    document.title = `${nombreTienda} - ${visibles.length} resultados`;
  },[visibles.length]);

  function agregarAlCarrito(producto : Producto) {
    setCarrito(agregarItem(producto, carrito))
  }
  function leerCarrito() : ItemCarrito[] {
    try {
      const crudo : unknown = JSON.parse(localStorage.getItem(CLAVE_CARRITO) ?? '[]');
      return Array.isArray(crudo) ? (crudo as ItemCarrito[]) : [];
    } catch (error) {
      return [];
    }
  }
  const unidades = carrito.reduce((suma, i) => suma + i.cantidad, 0);
  const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  
  return (
    <main className="mx-auto max-w-5xl p-6">
      <Header nombre={nombreTienda} eslogan="Una Vida Tecnologica" 
      resumen={`🛒 ${unidades} productos - ${formatearPrecio(total)}`}/>
      {/* PROPS */}
      <nav className="mb-4 flex gap-2" aria-label="Filtrar por categoria">
        {
          categorias.map((c) => (
            <button key={c} onClick={() => setCategoriaActiva(c)} 
            className={`rounded-full border px-3 py-1 text-sm ${ c === categoriaActiva ? 'bg-black text-white' : ''}`}>{c}
            </button>
          ))
        }
      </nav>
      <input type="search" placeholder="Buscar por nombre o marca..." 
            className="mb-4 w-64 rounded-lg border px-3 py-2 text-sm"
            value={termino} aria-label="Buscar productos"
            onChange={(e) => setTermino(e.target.value)}
            />
      {estado === 'listo' && visibles.length === 0 && (
        <p className="text-gray-500">{
          busqueda !== '' ? `No encontramos productos para "${termino.trim()}"` : 'No hay productos en esta categoria'
        }</p>
      )}
      {
        esRespaldo && (
          <p className="mb-4 rounded-lg border border-orange-300 bg-orange-500 p-2 text-sm">
            Mostrando el catalogo Local, no pudimos conectar con la tienda.
            <button className="ml-2 underline" onClick={() => {setIntento(intento + 1); setEstado('cargando')}}>Reintentar</button>
          </p>
        )
      }
      <p className="mb-4 text-sm text-gray-500">{visibles.length} productos</p>
      {estado === 'cargando' && (
        <section className="flex flex-wrap gap-4">
          {Array.from({length : 8}).map((_, indice) => (
            <SkeletonCard key={indice}/>
          ))}
        </section>
      )}
      {estado === 'error' && <p className="text-red-600">No pudimos cargar los productos</p>}
      {estado === 'listo' && (
          <section>
          {
            visibles.map((p) => <ProductCard producto={p} key={p.id} onAgregar={agregarAlCarrito}/>)
          }
          </section>
        )
      }
      <button className="mb-4 text-sm" onClick={() => setCarritoAbierto(!carritoAbierto)}>{carritoAbierto ? 'Ocultar carrito' : 'Ver carrito'}</button>
      
      {carritoAbierto && (<section className="mb-6 rounded-xl border p-4">
        <h2 className="font-semibold">Tu carrito</h2>
        {carrito.length === 0 && <p className="text-sm text-gray-500">Tu carrito esta vacio</p>}
        <ul>
          {
            carrito.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-1 text-sm">
                <span>{item.nombre} x {item.cantidad}</span>
                <button onClick={() => setCarrito(quitarItem(carrito, item.id))} aria-label="Quitar del barrito">X</button>
              </li>
            ))
          }
        </ul>
        {
          carrito.length > 0 && (
            <button className="mt-2 text-sm underline" onClick={() => setCarrito([])}>Vaciar carrito</button>
          )
        }
      </section>)}
      <Practica/>
      <Footer nombre={nombreTienda}/>
    
    </main>
  )
}
