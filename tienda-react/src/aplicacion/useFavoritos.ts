import { useCallback, useEffect, useState } from "react";

const CLAVE_FAVORITOS = 'tienda_favoritos';

function leerFavoritos() : number[] {
    try {
        const crudo : unknown = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS) ?? '[]');
        return Array.isArray(crudo) ? (crudo as number[]) : [];
    } catch {
        return [];
    }
}

export function useFavoritos() {
    const [favoritos, setFavoritos] = useState<number[]>(leerFavoritos);

    useEffect(() => {
        try {
            localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
        } catch (error) {
            console.warn('No se pudieron guardar los favoritos', error instanceof Error ? error.message : error);
        }
    }, [favoritos]);

    const alternar = useCallback((id : number) => {
        setFavoritos((actual) =>
            actual.includes(id) ? actual.filter((f) => f !== id) : [...actual, id]
        );
    }, []);

    return { favoritos, alternar };
}