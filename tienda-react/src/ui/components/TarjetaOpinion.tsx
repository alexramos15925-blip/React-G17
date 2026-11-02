import { memo } from "react";
import type { Opinion } from "../../dominio/tipos";

interface Props {
    opinion : Opinion;
}

// Uso de memo. Es un componente "puro" (mismos props = mismo resultado),
// se repite en una lista y su unico prop (opinion) mantiene la misma referencia mientras
// no cambie. Asi, al agregar una opinion nueva solo se dibuja la nueva, no todas.
function TarjetaOpinion({ opinion } : Props) {
    const estrellas = Math.max(0, Math.min(5, Math.round(opinion.puntuacion)));
    return (
        <li className="rounded-xl border p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">
                    {opinion.autor}
                    {opinion.propia && <span className="ml-2 text-xs font-normal text-gray-500">(tu opinion)</span>}
                </p>
                <p className="text-yellow-500" aria-label={`${estrellas} de 5 estrellas`}>
                    {'★'.repeat(estrellas)}{'☆'.repeat(5 - estrellas)}
                </p>
            </div>
            <p className="mt-1">{opinion.comentario}</p>
            <p className="mt-1 text-xs text-gray-500">{new Date(opinion.fecha).toLocaleDateString('es-PE')}</p>
        </li>
    );
}

export default memo(TarjetaOpinion);