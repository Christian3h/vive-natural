import { formatoCOP } from '../../utils/formatoMoneda.js';

export function crearProductoCard(producto, display, contador) {
    // Verifica si `producto.imagenes` es un array o una cadena y elimina duplicados
    let imagenes = [];
    if (producto.imagenes) {
        imagenes = Array.isArray(producto.imagenes) 
            ? producto.imagenes 
            : producto.imagenes.split(','); // Si es una string, la convertimos en array
        
        imagenes = [...new Set(imagenes.map(img => img.trim()))]; // Elimina duplicados y limpia espacios
    }


    const productoCard = document.createElement('div');
    productoCard.classList.add('producto-card');
    
    productoCard.innerHTML = `
        <div class="text-container">
            <h3>${producto.producto_nombre}</h3>
            <p>${producto.producto_descripcion}</p>
            <p>Categoria: ${producto.categoria_nombre}</p>
            <p>Precio: ${formatoCOP.format(producto.precio_activo)}</p>
            <p id="stockProducto">Stock: ${producto.producto_stock}</p>
        </div>
        <div class="slider-container">
            <div class="slider">
                ${imagenes.map(direccion => `
                    <div class="slide">
                        <img id="imagen${contador}" src="${direccion}" class="producto-imagen" loading="lazy" alt="${producto.productoId}">
                    </div>
                `).join('')}
            </div>
            <div class="buttons">
                <button id="btn-prev">↑</button>
                <button id="btn-next">↓</button>
            </div>
        </div>
        <div class="botones-container">
            <div class="cantidad-container">
                <button type="button" class="restar">-</button>
                <input type="number" class="cantidad" min="1" max="${producto.producto_stock}" value="1" />
                <button type="button" class="sumar">+</button>
            </div>
            <button class="agregar-carrito boton-funcion" 
                data-id="${producto.producto_id_hex}" 
                data-stock="${producto.producto_stock}" 
                data-precio="${producto.precio_activo}" 
                data-imagenes="${imagenes.join(',')}"
                data-nombre="${producto.producto_nombre}"
                data-descripcion="${producto.producto_descripcion}">
                Agregar al carrito
            </button>

            <button class="ver-mas boton-funcion" data-id="${producto.producto_id_hex}" style="display: ${display};" > Ver mas </button>
        </div>
    `;

    return productoCard;
}
