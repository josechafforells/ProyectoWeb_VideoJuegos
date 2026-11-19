
document.addEventListener("DOMContentLoaded", () => {

    // ANIMACIÓN DE LAS TARJETAS

    const tarjetas = document.querySelectorAll(".game-card");

    tarjetas.forEach((tarjeta) => {
        tarjeta.classList.add("animacion");
    });

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.1 });

    tarjetas.forEach((tarjeta) => {
        observador.observe(tarjeta);
    });


    // SISTEMA DE FAVORITOS

    let favoritos = [];

    try {
        favoritos = JSON.parse(
            localStorage.getItem("nexusFavoritos") || "[]"
        );

        if (!Array.isArray(favoritos)) favoritos = [];

    } catch (error) {
        favoritos = [];
    }

    const listaFavoritos = document.getElementById("listaFavoritos");
    const contador = document.getElementById("contadorFavoritos");

    function guardar() {
        localStorage.setItem(
            "nexusFavoritos",
            JSON.stringify(favoritos)
        );
    }

    function mostrarFavoritos() {

        if (contador) {
            contador.textContent = favoritos.length;
        }

        if (!listaFavoritos) return;

        listaFavoritos.innerHTML = "";

        if (favoritos.length === 0) {
            listaFavoritos.innerHTML =
                '<p class="favoritos-vacio">Todavía no tienes videojuegos favoritos.</p>';
            return;
        }

        favoritos.forEach((juego) => {

            const tarjeta = document.createElement("article");
            tarjeta.className = "favorito-item";

            tarjeta.innerHTML = `
                <img src="${juego.imagen}" alt="">
                <h3></h3>
                <p></p>
                <div class="favorito-acciones">
                    <a class="enlace-ver-mas">Ver más</a>
                    <button class="btn-eliminar-favorito"
                            type="button">Quitar</button>
                </div>
            `;

            tarjeta.querySelector("h3").textContent = juego.nombre;
            tarjeta.querySelector("p").textContent = juego.precio;

            tarjeta.querySelector(".enlace-ver-mas").href =
                juego.enlace || "#";

            tarjeta.querySelector(".btn-eliminar-favorito")
                .addEventListener("click", () => {
                    quitarFavorito(juego.nombre);
                });

            listaFavoritos.appendChild(tarjeta);
        });
    }

    function actualizarCorazones() {

        tarjetas.forEach((tarjeta) => {

            const boton = tarjeta.querySelector(".btn-favorito");
            const titulo = tarjeta.querySelector(".game-info h3");

            if (!boton || !titulo) return;

            const nombre = titulo.textContent.trim();

            const existe = favoritos.some(
                juego => juego.nombre === nombre
            );

            boton.textContent = existe ? "♥" : "♡";
            boton.classList.toggle("activo", existe);

            boton.setAttribute(
                "aria-label",
                existe ? "Quitar de favoritos" : "Agregar a favoritos"
            );

            boton.setAttribute("aria-pressed", existe);
        });
    }

    function quitarFavorito(nombre) {

        favoritos = favoritos.filter(
            juego => juego.nombre !== nombre
        );

        guardar();
        actualizarCorazones();
        mostrarFavoritos();
    }

    tarjetas.forEach((tarjeta) => {

        const titulo = tarjeta.querySelector(".game-info h3");
        const imagen = tarjeta.querySelector(".game-img");
        const precio = tarjeta.querySelector(".game-price");
        const enlace = tarjeta.querySelector(".btn-card");

        if (!titulo || !imagen) return;

        if (tarjeta.querySelector(".btn-favorito")) return;

        tarjeta.style.position = "relative";

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "btn-favorito";
        boton.textContent = "♡";

        boton.setAttribute("aria-label", "Agregar a favoritos");
        boton.setAttribute("aria-pressed", "false");

        boton.style.position = "absolute";
        boton.style.top = "15px";
        boton.style.right = "15px";
        boton.style.zIndex = "100";
        boton.style.width = "43px";
        boton.style.height = "43px";
        boton.style.border = "1px solid #62e6a7";
        boton.style.borderRadius = "50%";
        boton.style.background = "#080d18";
        boton.style.fontSize = "30px";
        boton.style.cursor = "pointer";
        boton.style.display = "flex";
        boton.style.alignItems = "center";
        boton.style.justifyContent = "center";
        boton.style.padding = "0";

        tarjeta.appendChild(boton);

        boton.addEventListener("click", () => {

            const nombre = titulo.textContent.trim();

            const existe = favoritos.some(
                juego => juego.nombre === nombre
            );

            if (existe) {

                quitarFavorito(nombre);

            } else {

                favoritos.push({
                    nombre: nombre,
                    imagen: imagen.getAttribute("src"),
                    precio: precio ? precio.textContent.trim() : "",
                    enlace: enlace ? enlace.getAttribute("href") : "#"
                });

                guardar();
                actualizarCorazones();
                mostrarFavoritos();
            }
        });
    });


    // PANEL LATERAL DE FAVORITOS

    const abrir = document.getElementById("abrirFavoritos");
    const cerrar = document.getElementById("cerrarFavoritos");
    const panel = document.getElementById("panelFavoritos");
    const fondo = document.getElementById("fondoFavoritos");

    if (abrir && panel && fondo) {
        abrir.addEventListener("click", () => {
            panel.classList.add("activo");
            fondo.classList.add("activo");
        });
    }

    function cerrarPanel() {
        if (panel && fondo) {
            panel.classList.remove("activo");
            fondo.classList.remove("activo");
        }
    }

    if (cerrar) {
        cerrar.addEventListener("click", cerrarPanel);
    }

    if (fondo) {
        fondo.addEventListener("click", cerrarPanel);
    }

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            cerrarPanel();
        }
    });

    actualizarCorazones();
    mostrarFavoritos();

});


// TEMA BLANCO Y OSCURO

const botonTema = document.getElementById("btnTema");

function aplicarTema(tema) {
    document.body.classList.toggle("tema-blanco", tema === "blanco");
    localStorage.setItem("nexusTema", tema);

    if (botonTema) {
        botonTema.textContent = tema === "blanco" ? "☀️" : "🌙";
    }
}

const temaGuardado = localStorage.getItem("nexusTema") || "oscuro";
aplicarTema(temaGuardado);

if (botonTema) {
    botonTema.addEventListener("click", () => {
        const nuevoTema = document.body.classList.contains("tema-blanco")
            ? "oscuro"
            : "blanco";

        aplicarTema(nuevoTema);
    });
}
