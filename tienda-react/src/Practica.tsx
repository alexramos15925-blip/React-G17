import { useState } from "react";

// Tarea 5: el contador de react.dev, funcionando.

export default function Practica() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <section className="mb-6 rounded-xl border p-4">
      <h2 className="font-semibold">Práctica: contador con useState</h2>
      <button className="mt-2 rounded-full border px-4 py-1 text-sm" onClick={handleClick}>
        Hiciste clic {count} veces
      </button>
    </section>
  );
}

