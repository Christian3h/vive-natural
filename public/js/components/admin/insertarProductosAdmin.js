import { formatoCOP } from "../../utils/formatoMoneda.js";

export async function insertarProductosAdmin(productos) {
    const productosContainer = document.getElementById('productosContainer');
    if (!productosContainer) return console.error("No se encontró el contenedor de productos.");

    const fragment = document.createDocumentFragment();
    let contador = 0; // Para IDs únicos de imágenes

    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.classList.add('producto-card');

        // Verifica si `producto.imagenes` es un array o una cadena
        let imagenes = [];
        if (producto.imagenes) {
            imagenes = Array.isArray(producto.imagenes)
                ? producto.imagenes
                : producto.imagenes.split(',');

            imagenes = [...new Set(imagenes.map(img => img.trim()))]; // Limpia duplicados y espacios
        }

        // depurar
        // console.log("ID del producto (hex):", producto.producto_id_hex); 

        productoCard.innerHTML = `
            <div class="text-container">
                <h3>${producto.producto_nombre}</h3>
                <p>${producto.producto_descripcion}</p>
                <p>Precio: ${formatoCOP.format(producto.precio_activo)}</p>
                <p>Stock: ${producto.producto_stock}</p>
            </div>
            <div class="slider-container">
                <div class="slider">
                    ${imagenes.map(direccion => `
                        <div class="slide">
                            <img id="imagen${contador++}" src="${direccion}" class="producto-imagen" loading="lazy" alt="${producto.productoId || ''}">
                        </div>
                    `).join('')}
                </div>
                <div class="buttons">
                    <button id="btn-prev">↑</button>
                    <button id="btn-next">↓</button>
                </div>
            </div>
            <div class="botones-container">
                <button class="Editar boton-funcion"
                    data-id="${producto.producto_id_hex}"
                    data-stock="${producto.producto_stock}"
                    data-precio="${producto.precio_activo}">Editar</button>
                <button class="Eliminar boton-funcion"
                    data-id="${producto.producto_id_hex}">Eliminar</button>
            </div>
        `;

        fragment.appendChild(productoCard);
    });

    productosContainer.innerHTML = '';
    productosContainer.appendChild(fragment);
};
