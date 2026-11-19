document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("nexusCarrito") || "[]");

    function guardarCarrito() {
        localStorage.setItem("nexusCarrito", JSON.stringify(carrito));
        actualizarContador();
    }

    function actualizarContador() {
        const contadores = document.querySelectorAll("#contadorCarrito");
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contadores.forEach(c => c.textContent = totalItems);
    }

    // Agregar botones "Añadir" automáticamente a cada tarjeta de juego sin tocar el HTML de las cards
    const tarjetas = document.querySelectorAll(".game-card");
    tarjetas.forEach(tarjeta => {
        const footer = tarjeta.querySelector(".game-footer");
        const titulo = tarjeta.querySelector(".game-info h3");
        const precioEl = tarjeta.querySelector(".game-price");
        const imgEl = tarjeta.querySelector(".game-img");

        if (!footer || !titulo || !precioEl) return;

        const btnAgregar = document.createElement("button");
        btnAgregar.type = "button";
        btnAgregar.className = "btn btn-primary";
        btnAgregar.style.padding = "8px 12px";
        btnAgregar.innerHTML = '<i class="fa-solid fa-cart-plus"></i>';
        btnAgregar.title = "Agregar al carrito";

        btnAgregar.addEventListener("click", () => {
            const nombre = titulo.textContent.trim();
            const precioTexto = precioEl.textContent.replace("S/", "").trim();
            const precio = parseFloat(precioTexto) || 0;
            const imagen = imgEl ? imgEl.getAttribute("src") : "";

            const existente = carrito.find(item => item.nombre === nombre);
            if (existente) {
                existente.cantidad += 1;
            } else {
                carrito.push({ nombre, precio, imagen, cantidad: 1 });
            }

            guardarCarrito();
            btnAgregar.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => {
                btnAgregar.innerHTML = '<i class="fa-solid fa-cart-plus"></i>';
            }, 900);
        });

        footer.appendChild(btnAgregar);
    });

    // Renderizar la vista de carrito.html si estamos en esa página
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
            const subtotal = item.precio * item.cantidad;
            sumaTotal += subtotal;

            const fila = document.createElement("div");
            fila.className = "carrito-item";
            fila.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-info">
                    <h4>${item.nombre}</h4>
                    <p>S/ ${item.precio.toFixed(2)} x ${item.cantidad} = <strong>S/ ${subtotal.toFixed(2)}</strong></p>
                </div>
                <button class="btn-quitar" type="button" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
            `;

            fila.querySelector(".btn-quitar").addEventListener("click", () => {
                carrito.splice(index, 1);
                guardarCarrito();
                renderizarCarrito();
            });

            listaCarrito.appendChild(fila);
        });

        totalCarrito.textContent = `S/ ${sumaTotal.toFixed(2)}`;
    }

    const btnVaciar = document.getElementById("btnVaciar");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", () => {
            carrito = [];
            guardarCarrito();
            renderizarCarrito();
        });
    }

    const btnFinalizar = document.getElementById("btnFinalizar");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }
            alert("¡Compra realizada con éxito! Gracias por comprar en Nexus Games.");
            carrito = [];
            guardarCarrito();
            renderizarCarrito();
        });
    }

    actualizarContador();
    renderizarCarrito();
});