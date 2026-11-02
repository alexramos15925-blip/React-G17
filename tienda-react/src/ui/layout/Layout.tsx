import { useState } from "react";
import Header from "../components/Header";
import PanelCarrito from "../components/PanelCarrito";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { NOMBRE_TIENDA } from "../../dominio/tipos";


export default function () {
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    return (
        <main className="mx-auto max-w-5xl p-6">
            <Header nombre={NOMBRE_TIENDA} eslogan="Una Vida Tecnologica"/>
            <button className="mb-4 text-sm" 
            onClick={() => setCarritoAbierto(!carritoAbierto)}>
                {carritoAbierto ? 'Ocultar carrito' : 'Ver carrito'}
            </button>
            {carritoAbierto && (<PanelCarrito/>)}
            <Outlet/>
            <Footer nombre={NOMBRE_TIENDA}/>
        </main>
    )
}