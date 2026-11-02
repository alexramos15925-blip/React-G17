import { useState, type ChangeEvent, type FormEvent } from "react";
import type { DatosOpinion } from "../../dominio/tipos";

interface Props {
    autor : string;
    onEnviar : (datos : DatosOpinion) => void;
}

type Campo = 'puntuacion' | 'comentario';
type Errores = Partial<Record<Campo, string>>;

// Una regla de validacion por campo
function validar(puntuacion : string, comentario : string) : Errores {
    const errores : Errores = {};
    const numero = Number(puntuacion);
    if(!Number.isInteger(numero) || numero < 1 || numero > 5) errores.puntuacion = 'Elige una puntuacion de 1 a 5';
    if(comentario.trim().length < 10) errores.comentario = 'Escribe al menos 10 caracteres';
    return errores;
}

export default function FormularioOpinion({ autor, onEnviar } : Props) {
    // Formulario controlado: React es dueño del valor de cada campo
    const [puntuacion, setPuntuacion] = useState('');
    const [comentario, setComentario] = useState('');
    const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});

    const errores = validar(puntuacion, comentario);
    const hayErrores = Object.keys(errores).length > 0;

    const marcar = (campo : Campo) => () => setTocados((t) => ({ ...t, [campo] : true }));

    function enviar(e : FormEvent) {
        e.preventDefault();
        setTocados({ puntuacion : true, comentario : true });
        if(hayErrores) return;
        onEnviar({ autor, puntuacion : Number(puntuacion), comentario });
        setPuntuacion('');
        setComentario('');
        setTocados({});
    }

    return (
        <form className="flex flex-col gap-3 rounded-xl border p-4" onSubmit={enviar} noValidate>
            <h2 className="font-semibold">Deja tu opinion</h2>
            <p className="text-sm text-gray-500">Opinas como <b>{autor}</b></p>
            <label className="flex flex-col text-sm">
                Puntuacion
                <select className="rounded border px-3 py-2" value={puntuacion}
                    onChange={(e : ChangeEvent<HTMLSelectElement>) => setPuntuacion(e.target.value)}
                    onBlur={marcar('puntuacion')}>
                    <option value="">Elige...</option>
                    {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'estrella' : 'estrellas'}</option>
                    ))}
                </select>
                {tocados.puntuacion && errores.puntuacion && (
                    <span className="text-xs text-red-600">{errores.puntuacion}</span>
                )}
            </label>
            <label className="flex flex-col text-sm">
                Comentario
                <textarea className="rounded border px-3 py-2" rows={3} maxLength={300} value={comentario}
                    onChange={(e : ChangeEvent<HTMLTextAreaElement>) => setComentario(e.target.value)}
                    onBlur={marcar('comentario')}/>
                {tocados.comentario && errores.comentario && (
                    <span className="text-xs text-red-600">{errores.comentario}</span>
                )}
            </label>
            <button type="submit" className="rounded-full border px-4 py-2">Publicar opinion</button>
        </form>
    );
}