interface Props {
    nombre : string;
}

export default function Footer ( { nombre } : Props ) {
    return (
        <footer className="mt-8 border-t pt-4 text-sm text-gray-500">
            {nombre} - Proyecto del bloque de React
        </footer>
    )
}