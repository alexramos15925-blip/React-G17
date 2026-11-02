import { useContext } from "react";
import { FavoritosContext } from "./FavoritosContext";

export function useFavoritos() {
    const contexto = useContext(FavoritosContext);
    if(!contexto) throw new Error('useFavoritos solo funciona dentro de <FavoritosProvider>');
    return contexto;
}

