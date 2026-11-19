
// TARJETA DE FAVORITOS
    const tarjetasFavoritos = document.querySelectorAll(".game-card");
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

    function actualizarNumeroFavoritos() {
        document
            .querySelectorAll("#contadorFavoritos, .menu-lateral-favoritos .badge-favoritos")
            .forEach((el) => {
                el.textContent = favoritos.length;
            });
    }

    function guardar() {
        try {
            localStorage.setItem(
                "nexusFavoritos",
                JSON.stringify(favoritos)
            );
        } catch (error) {}
    }
    function mostrarFavoritos() {
        actualizarNumeroFavoritos();

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
        tarjetasFavoritos.forEach((tarjeta) => {
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

    tarjetasFavoritos.forEach((tarjeta) => {
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
    /*favoritos*/
    // =====================================
    // PANEL LATERAL DE FAVORITOS (BLINDADO)
    // =====================================
    const abrirFav = document.getElementById("abrirFavoritos");
    const cerrarFav = document.getElementById("cerrarFavoritos");
    const panelFav = document.getElementById("panelFavoritos");
    const fondoFav = document.getElementById("fondoFavoritos");

    function abrirPanelFavoritos() {
        // Cierra el panel del carrito si estuviera abierto
        const panelCarr = document.getElementById("panelCarrito");
        const fondoCarr = document.getElementById("fondoCarrito");
        if (panelCarr) {
            panelCarr.classList.remove("abierto");
            panelCarr.classList.remove("activo");
        }
        if (fondoCarr) {
            fondoCarr.classList.remove("activo");
        }

        if (panelFav) {
            panelFav.classList.add("activo");
            panelFav.classList.add("abierto");
        }
        if (fondoFav) {
            fondoFav.classList.add("activo");
        }
    }

    function cerrarPanelFavoritos() {
        if (panelFav) {
            panelFav.classList.remove("activo");
            panelFav.classList.remove("abierto");
        }
        if (fondoFav) {
            fondoFav.classList.remove("activo");
        }
    }

    // Mantener compatibilidad si en otra parte llaman a cerrarPanel()
    window.cerrarPanel = cerrarPanelFavoritos;

    if (abrirFav) {
        abrirFav.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            abrirPanelFavoritos();
        });
    }

    if (cerrarFav) {
        cerrarFav.addEventListener("click", (e) => {
            e.preventDefault();
            cerrarPanelFavoritos();
        });
    }

    if (fondoFav) {
        fondoFav.addEventListener("click", cerrarPanelFavoritos);
    }

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            cerrarPanelFavoritos();
        }
    });
    // =========================================================
// FAVORITOS (PANEL LATERAL BLINDADO) + TEMA SOL / LUNA
// =========================================================
(function () {
    function obtenerElementosFavoritos() {
        return {
            panel: document.getElementById("panelFavoritos"),
            fondo: document.getElementById("fondoFavoritos")
        };
    }

    function cerrarCarritoSiExiste() {
        const panelCarrito = document.getElementById("panelCarrito");
        const fondoCarrito = document.getElementById("fondoCarrito");
        if (panelCarrito) {
            panelCarrito.classList.remove("abierto");
            panelCarrito.classList.remove("activo");
        }
        if (fondoCarrito) {
            fondoCarrito.classList.remove("activo");
        }
    }

    function abrirPanelFavoritos() {
        cerrarCarritoSiExiste();
        const { panel, fondo } = obtenerElementosFavoritos();
        if (panel) {
            panel.classList.add("activo");
            panel.classList.add("abierto");
        }
        if (fondo) {
            fondo.classList.add("activo");
        }
    }

    function cerrarPanelFavoritos() {
        const { panel, fondo } = obtenerElementosFavoritos();
        if (panel) {
            panel.classList.remove("activo");
            panel.classList.remove("abierto");
        }
        if (fondo) {
            fondo.classList.remove("activo");
        }
    }

    window.cerrarPanel = cerrarPanelFavoritos;

    // Delegación en captura para que siempre abra/cierre favoritos
    document.addEventListener("click", (e) => {
        const btnAbrirFav = e.target.closest("#abrirFavoritos, .menu-lateral-favoritos:not(.menu-lateral-carrito)");
        if (btnAbrirFav) {
            e.preventDefault();
            e.stopPropagation();
            abrirPanelFavoritos();
            return;
        }

        const btnCerrarFav = e.target.closest("#cerrarFavoritos");
        if (btnCerrarFav) {
            e.preventDefault();
            e.stopPropagation();
            cerrarPanelFavoritos();
            return;
        }

        const fondoFav = e.target.closest("#fondoFavoritos, .fondo-favoritos");
        if (fondoFav) {
            cerrarPanelFavoritos();
        }
    }, true);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cerrarPanelFavoritos();
        }
    });

    // =========================================================
    // BOTÓN DE TEMA (SOLO SOL 🌞 Y LUNA 🌙, SIN TEXTO)
    // =========================================================
    function actualizarIconoTema() {
        const botonTema = document.getElementById("btnTema");
        if (!botonTema) return;
        const esBlanco = document.body.classList.contains("tema-blanco");
        botonTema.textContent = esBlanco ? "🌞" : "🌙";
        botonTema.setAttribute("aria-label", esBlanco ? "Cambiar a tema oscuro" : "Cambiar a tema claro");
    }

    function aplicarTema(tema) {
        const esBlanco = tema === "blanco";
        document.body.classList.toggle("tema-blanco", esBlanco);
        try {
            localStorage.setItem("nexusTema", tema);
        } catch (error) {}
        actualizarIconoTema();
    }

    document.addEventListener("DOMContentLoaded", () => {
        let temaGuardado = "oscuro";
        try {
            temaGuardado = localStorage.getItem("nexusTema") || "oscuro";
        } catch (error) {}
        aplicarTema(temaGuardado);
    });

    document.addEventListener("click", (e) => {
        const botonTema = e.target.closest("#btnTema, .btn-tema");
        if (!botonTema) return;
        e.preventDefault();
        e.stopPropagation();
        const nuevoTema = document.body.classList.contains("tema-blanco")
            ? "oscuro"
            : "blanco";
        aplicarTema(nuevoTema);
    }, true);
})();