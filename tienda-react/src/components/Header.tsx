
interface Props {
    nombre : string;
    eslogan?: string;
    resumen?:  string;
}
export default function Header ( {nombre , eslogan, resumen} : Props) {
    return(
        <header className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">{nombre}</h1>
                <p className="text-sm text-gray-500">{eslogan}</p>
            </div>
            <p>{ resumen ?? '🛒 0 productos'}</p>
        </header>
    )
}