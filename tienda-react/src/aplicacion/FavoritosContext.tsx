import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

interface ValorFavoritos {
    favoritos : number[];
    alternar : (id : number) => void;
}

const CLAVE_FAVORITOS = 'tienda_favoritos';
export const FavoritosContext = createContext<ValorFavoritos | null>(null);

// PUNTO 4: lectura con validacion. Solo aceptamos ids numericos enteros y sin repetir.
function leerFavoritos() : number[] {
    try {
        const crudo : unknown = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS) ?? '[]');
        if(!Array.isArray(crudo)) return [];
        return [...new Set(crudo.filter((x): x is number => typeof x === 'number' && Number.isInteger(x)))];
    } catch (error) {
        console.warn('No se pudieron leer los favoritos guardados', error instanceof Error ? error.message : error);
        return [];
    }
}

export function FavoritosProvider({ children } : { children : ReactNode }) {
    // Estado minimo: solo los ids. El resto (cuantos son, si un producto es favorito) se calcula.
    const [favoritos, setFavoritos] = useState<number[]>(leerFavoritos);

    useEffect(() => {
        try {
            localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
        } catch (error) {
            console.warn('No se pudieron guardar los favoritos', error instanceof Error ? error.message : error);
        }
    }, [favoritos]);

    // useCallback: la funcion mantiene la misma referencia, asi el memo de ProductCard sirve
    const alternar = useCallback((id : number) => {
        setFavoritos((actual) =>
            actual.includes(id) ? actual.filter((f) => f !== id) : [...actual, id]
        );
    }, []);

    const valor = useMemo(() => ({ favoritos, alternar }), [favoritos, alternar]);

    return (
        <FavoritosContext.Provider value={valor}>
            {children}
        </FavoritosContext.Provider>
    );
}