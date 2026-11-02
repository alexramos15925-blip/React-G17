import { useState, type FormEvent } from "react"
import { useSesion } from "../../aplicacion/useSesion";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    const {entrar} = useSesion();
    const navegar = useNavigate();
    const ubicacion = useLocation();
    const desde = (ubicacion.state as {desde? : string} | null)?.desde ?? '/';

    async function manejarEnvio(e : FormEvent) {
        e.preventDefault();
        setError('');
        setEnviando(true);
        try {
            await entrar(usuario, password);
            navegar(desde, {replace: true});
        } catch (error) {
            setError(error instanceof Error ? error.message : 'No se pudo iniciar sesion.');
        } finally {
            setEnviando(false);
        }
    }
    return(
        <form onSubmit={manejarEnvio} className="mx-auto flex max-w-sm flex-col gap-3">
            <h1 className="text-2xl font-bold">Inicia Sesion</h1>
            <label className="flex flex-col text-sm">
                Usuario
                <input type="text" className="rounded border px-3 py-2" value={usuario} 
                onChange={(e) => setUsuario(e.target.value)}/>
            </label>
            <label className="flex flex-col text-sm">
                Contrasenia
                <input type="password" className="rounded border px-3 py-2"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="rounded-full border px-4 py-2" 
            disabled={enviando}>
                {enviando ? 'Entrando...' : 'Entrar'}
            </button>
        </form>
    )
}