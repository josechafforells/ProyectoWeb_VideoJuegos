document.addEventListener("DOMContentLoaded", () => {
    let carrito = [];

    try {
        const guardado = JSON.parse(localStorage.getItem("nexusCarrito") || "[]");
        carrito = Array.isArray(guardado) ? guardado : [];
    } catch (error) {
        carrito = [];
    }

    function alternarPanelCarrito(abrir) {
        const panel = document.getElementById("panelCarrito");
        const fondo = document.getElementById("fondoCarrito");
        if (!panel) return;
        panel.classList.toggle("abierto", Boolean(abrir));
        if (fondo) {
            fondo.classList.toggle("activo", Boolean(abrir));
        }
    }

    function actualizarContador() {
        const contadores = document.querySelectorAll("#contadorCarrito");
        const totalItems = carrito.reduce((acc, item) => acc + (Number(item.cantidad) || 1), 0);
        contadores.forEach((c) => {
            c.textContent = totalItems;
        });
    }

    function renderizarCarritoLateral() {
        const listaLateral = document.getElementById("listaCarritoLateral");
        const totalLateral = document.getElementById("totalCarritoLateral");
        const estadoLateral = document.getElementById("estadoCarritoLateral");
        if (!listaLateral || !totalLateral || !estadoLateral) return;

        const totalUnidades = carrito.reduce((acc, item) => acc + (Number(item.cantidad) || 1), 0);

        if (carrito.length === 0 || totalUnidades === 0) {
            estadoLateral.textContent = "El carrito está vacío";
            listaLateral.innerHTML = '<p class="carrito-vacio-msg">Todavía no tienes videojuegos en el carrito.</p>';
            totalLateral.textContent = "S/ 0.00";
            return;
        }

        estadoLateral.textContent = `${totalUnidades} ${totalUnidades === 1 ? "juego listo" : "juegos listos"} para comprar`;
        let suma = 0;

        listaLateral.innerHTML = carrito
            .map((item, index) => {
                const precioNum = Number(item.precio) || 0;
                const cantNum = Number(item.cantidad) || 1;
                const subtotal = precioNum * cantNum;
                suma += subtotal;

                return `
                    <div class="carrito-lateral-item">
                        ${item.imagen ? `<img src="${item.imagen}" alt="${item.nombre}">` : ""}
                        <div class="carrito-lateral-info">
                            <strong title="${item.nombre}">${item.nombre}</strong>
                            <span class="carrito-lateral-meta">S/ ${precioNum.toFixed(2)} c/u</span>
                            <span class="carrito-lateral-subtotal">S/ ${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="carrito-lateral-controles">
                            <div class="carrito-cant-grupo">
                                <button type="button" class="btn-cant-lateral" data-accion="restar" data-index="${index}" title="Restar">−</button>
                                <span>${cantNum}</span>
                                <button type="button" class="btn-cant-lateral" data-accion="sumar" data-index="${index}" title="Sumar">+</button>
                            </div>
                            <button type="button" class="btn btn-secondary btn-quitar-lateral" data-index="${index}" title="Quitar">×</button>
                        </div>
                    </div>
                `;
            })
            .join("");

        listaLateral.querySelectorAll(".btn-cant-lateral").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                const idx = Number(btn.dataset.index);
                const accion = btn.dataset.accion;
                if (!carrito[idx]) return;

                if (accion === "sumar") {
                    carrito[idx].cantidad = (Number(carrito[idx].cantidad) || 1) + 1;
                } else if (accion === "restar") {
                    const nuevaCant = (Number(carrito[idx].cantidad) || 1) - 1;
                    if (nuevaCant <= 0) {
                        carrito.splice(idx, 1);
                    } else {
                        carrito[idx].cantidad = nuevaCant;
                    }
                }
                guardarCarrito();
            });
        });

        listaLateral.querySelectorAll(".btn-quitar-lateral").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                const idx = Number(btn.dataset.index);
                carrito.splice(idx, 1);
                guardarCarrito();
            });
        });

        totalLateral.textContent = `S/ ${suma.toFixed(2)}`;
    }

    const listaCarrito = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");

    function renderizarCarrito() {
        if (!listaCarrito || !totalCarrito) return;

        listaCarrito.innerHTML = "";
        if (carrito.length === 0) {
            listaCarrito.innerHTML = "<p>Tu carrito está vacío. Ve al catálogo para agregar videojuegos.</p>";
            totalCarrito.textContent = "S/ 0.00";
            return;
        }

        let sumaTotal = 0;

        carrito.forEach((item, index) => {
            const precioNum = Number(item.precio) || 0;
            const cantNum = Number(item.cantidad) || 1;
            const subtotal = precioNum * cantNum;
            sumaTotal += subtotal;

            const fila = document.createElement("div");
            fila.className = "carrito-item";
            fila.innerHTML = `
                <img src="${item.imagen || ""}" alt="${item.nombre}">
                <div class="carrito-info">
                    <h4>${item.nombre}</h4>
                    <p>S/ ${precioNum.toFixed(2)} x ${cantNum} = <strong>S/ ${subtotal.toFixed(2)}</strong></p>
                </div>
                <button class="btn-quitar" type="button" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
            `;

            fila.querySelector(".btn-quitar").addEventListener("click", () => {
                carrito.splice(index, 1);
                guardarCarrito();
            });

            listaCarrito.appendChild(fila);
        });

        totalCarrito.textContent = `S/ ${sumaTotal.toFixed(2)}`;
    }

    function guardarCarrito() {
        try {
            localStorage.setItem("nexusCarrito", JSON.stringify(carrito));
        } catch (error) {}
        actualizarContador();
        renderizarCarritoLateral();
        renderizarCarrito();
    }

    function agregarProducto(boton) {
        const tarjeta = boton.closest(".game-card");
        const tituloEl = tarjeta ? tarjeta.querySelector(".game-info h3") : null;
        const precioEl = tarjeta ? tarjeta.querySelector(".game-price") : null;
        const imgEl = tarjeta ? tarjeta.querySelector(".game-img") : null;

        const nombre = (boton.getAttribute("data-nombre") || (tituloEl ? tituloEl.textContent : "") || "Juego").trim();
        const precioTexto = boton.getAttribute("data-precio") || (precioEl ? precioEl.textContent : "0");
        const precio = parseFloat(String(precioTexto).replace(/[^0-9.]/g, "")) || 0;
        const imagen = boton.getAttribute("data-imagen") || (imgEl ? imgEl.getAttribute("src") : "") || "";

        const existente = carrito.find((item) => item.nombre === nombre);
        if (existente) {
            existente.cantidad = (Number(existente.cantidad) || 1) + 1;
        } else {
            carrito.push({ nombre, precio, imagen, cantidad: 1 });
        }

        guardarCarrito();

        const textoPrevio = boton.innerHTML;
        boton.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
        setTimeout(() => {
            boton.innerHTML = textoPrevio;
        }, 800);
    }

    // Fase de captura (true) para que ningún otro script bloquee el clic
    document.addEventListener("click", (e) => {
        const btnAgregar = e.target.closest(".btn-agregar-juego, .btn-agregar-auto");
        if (btnAgregar) {
            e.preventDefault();
            e.stopPropagation();
            agregarProducto(btnAgregar);
            return;
        }

        const btnAbrir = e.target.closest("#abrirCarritoLateral, .btn-carrito-header, .btn-carrito-azul");
        if (btnAbrir) {
            e.preventDefault();
            e.stopPropagation();
            renderizarCarritoLateral();
            alternarPanelCarrito(true);
            return;
        }

        if (e.target.closest("#cerrarCarritoLateral") || e.target.id === "fondoCarrito") {
            e.preventDefault();
            alternarPanelCarrito(false);
            return;
        }

        if (e.target.closest("#vaciarCarritoLateral, #btnVaciar")) {
            e.preventDefault();
            carrito = [];
            guardarCarrito();
            return;
        }

        if (e.target.closest("#btnFinalizar")) {
            e.preventDefault();
            if (carrito.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }
            alert("¡Compra realizada con éxito! Gracias por comprar en Nexus Games.");
            carrito = [];
            guardarCarrito();
        }
    }, true);

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            alternarPanelCarrito(false);
        }
    });

    actualizarContador();
    renderizarCarritoLateral();
    renderizarCarrito();
});