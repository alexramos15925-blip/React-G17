import { useCallback, useEffect, useMemo, useState } from "react";
import type { DatosOpinion, EstadoCarga, Opinion } from "../dominio/tipos";
import { guardarOpinionPropia, leerOpinionesPropias, obtenerOpinionesApi } from "../infraestructura/opiniones";

export function useOpiniones(idProducto : number) {
    const [opinionesApi, setOpinionesApi] = useState<Opinion[]>([]);
    // Las opiniones propias se leen (y validan) una sola vez, al abrir la pagina
    const [propias, setPropias] = useState<Opinion[]>(() => leerOpinionesPropias(idProducto));
    const [estado, setEstado] = useState<EstadoCarga>('cargando');
    const [intento, setIntento] = useState(0);

    // PUNTO 4 y 5: efecto con dependencias [idProducto, intento] y funcion de limpieza.
    useEffect(() => {
        const controlador = new AbortController();
        async function cargar() {
            try {
                const lista = await obtenerOpinionesApi(idProducto, controlador.signal);
                setOpinionesApi(lista);
                setEstado('listo');
            } catch (error) {
                // Si la peticion se cancelo a proposito (limpieza), no es un error real
                if(error instanceof DOMException && error.name === 'AbortError') return;
                console.warn('No se pudieron cargar las opiniones', error instanceof Error ? error.message : error);
                setEstado('error');
            }
        }
        cargar();
        return () => controlador.abort();
    }, [idProducto, intento]);

    const reintentar = useCallback(() => {
        setEstado('cargando');
        setIntento((n) => n + 1);
    }, []);

    const agregar = useCallback((datos : DatosOpinion) => {
        const nueva : Opinion = {
            id : `propia-${Date.now()}`,
            ...datos,
            comentario : datos.comentario.trim(),
            fecha : new Date().toISOString(),
            propia : true
        };
        guardarOpinionPropia(idProducto, nueva);
        setPropias((actual) => [...actual, nueva]);
    }, [idProducto]);

    // PUNTO 3: estos valores NO son estado, se derivan de lo que ya tenemos
    const opiniones = useMemo(
        () => [...propias, ...opinionesApi].sort((a, b) => b.fecha.localeCompare(a.fecha)),
        [propias, opinionesApi]
    );
    const promedio = useMemo(
        () => opiniones.length === 0 ? 0 : opiniones.reduce((suma, o) => suma + o.puntuacion, 0) / opiniones.length,
        [opiniones]
    );

    return { opiniones, promedio, estado, reintentar, agregar };
}