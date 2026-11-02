import type { Opinion } from "../dominio/tipos";

const BASE = import.meta.env.VITE_API_URL;
const CLAVE_OPINIONES = 'tienda_opiniones';

// Forma de cada reseña tal como la entrega DummyJSON en GET /products/:id
interface ResenaAPI {
    rating : number;
    comment : string;
    date : string;
    reviewerName : string;
}

// NO capturamos el error. Lo dejamos subir para que el hook
// decida si muestra el estado 'error'. Asi nunca hay un catch que lo atrape
export async function obtenerOpinionesApi(idProducto : number, signal? : AbortSignal) : Promise<Opinion[]> {
    const r = await fetch(`${BASE}/products/${idProducto}`, { signal });
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = (await r.json()) as { reviews? : ResenaAPI[] };
    return (data.reviews ?? []).map((res, indice) => ({
        id : `api-${idProducto}-${indice}`,
        autor : res.reviewerName,
        puntuacion : res.rating,
        comentario : res.comment,
        fecha : res.date,
        propia : false
    }));
}

// Validacion. Lo que viene de localStorage es "desconocido",
// asi que comprobamos cada campo antes de confiar en el.
function esOpinion(x : unknown) : x is Opinion {
    if(typeof x !== 'object' || x === null) return false;
    const o = x as Record<string, unknown>;
    return (
        typeof o.id === 'string' &&
        typeof o.autor === 'string' &&
        typeof o.puntuacion === 'number' && o.puntuacion >= 1 && o.puntuacion <= 5 &&
        typeof o.comentario === 'string' &&
        typeof o.fecha === 'string' &&
        typeof o.propia === 'boolean'
    );
}

function leerTodas() : Record<string, unknown> {
    try {
        const crudo : unknown = JSON.parse(localStorage.getItem(CLAVE_OPINIONES) ?? '{}');
        return typeof crudo === 'object' && crudo !== null && !Array.isArray(crudo)
            ? (crudo as Record<string, unknown>)
            : {};
    } catch (error) {
        console.warn('No se pudieron leer las opiniones guardadas', error instanceof Error ? error.message : error);
        return {};
    }
}

function filtrarValidas(lista : unknown) : Opinion[] {
    return Array.isArray(lista) ? lista.filter(esOpinion) : [];
}

export function leerOpinionesPropias(idProducto : number) : Opinion[] {
    return filtrarValidas(leerTodas()[String(idProducto)]);
}

export function guardarOpinionPropia(idProducto : number, opinion : Opinion) {
    try {
        const todas = leerTodas();
        todas[String(idProducto)] = [...filtrarValidas(todas[String(idProducto)]), opinion];
        localStorage.setItem(CLAVE_OPINIONES, JSON.stringify(todas));
    } catch (error) {
        console.warn('No se pudo guardar la opinion', error instanceof Error ? error.message : error);
    }
}