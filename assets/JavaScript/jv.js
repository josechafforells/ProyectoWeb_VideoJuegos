const tarjetasMoba = document.querySelectorAll(".game-card");
const campoBusqueda = document.querySelector("#buscador");
const cuadrillaJuegos = document.querySelector(".games-grid");


if (cuadrillaJuegos) {
    cuadrillaJuegos.style.gridTemplateColumns =
        "repeat(auto-fill, minmax(280px, 1fr))";
}

if (campoBusqueda) {
    campoBusqueda.addEventListener("input", () => {
        const texto = campoBusqueda.value.toLowerCase().trim();

        tarjetasMoba.forEach((tarjeta) => {
            const titulo = tarjeta.querySelector("h2, h3");
            const nombre = titulo ? titulo.textContent.toLowerCase() : "";

            tarjeta.style.display = nombre.includes(texto) ? "" : "none";
        });
    });
}

const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (!movimientoReducido) {
    tarjetasMoba.forEach((tarjeta, indice) => {
        tarjeta.animate(
            [
                { opacity: 0, transform: "translateY(20px)" },
                { opacity: 1, transform: "translateY(0)" }
            ],
            {
                duration: 500,
                delay: indice * 100,
                easing: "ease-out"
            }
        );
    });
}

