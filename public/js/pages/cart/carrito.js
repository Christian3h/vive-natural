// pages/cart/carrito.js
import { obtenerCarrito } from "../../utils/cart/carrito.js";
import { formatoCOP } from "../../utils/formatoMoneda.js";
import { initSlider } from "../../components/cart/sliderCart.js";

export async function insertarCarrito() {
    const carrito = await obtenerCarrito();
    const carritoContainer = document.getElementById('carritoContainer');
    if (!carritoContainer) return;

    const carritoArray = await obtenerCarrito();
    const fragment = document.createDocumentFragment();
    let total = 0;
    carritoArray.forEach(item => {
        let contador = 0;
        const productoCard = document.createElement('div');
        productoCard.classList.add('producto-card');
        productoCard.innerHTML = `
            <p id="productoId" style="display: none;">${item.productoId}</p>
            <div class="slider-container">
                <div class="slider">
                    ${item.imagenes.split(',').map(direccion => `
                        <div class="slide">
                            <img id="imagen${contador}" src="${direccion}" class="producto-imagen" loading="lazy" alt="${item.productoId}">
                        </div>
                    `).join('')}
                </div>
                <div class="buttons">
                    <button id="btn-prev">↑</button>
                    <button id="btn-next">↓</button>
                </div>
            </div>
            <div class="info-container">
                <div class="text-container">
                    <h2>${item.nombre}</h2>
                    <p>${item.descripcion}</p>
                    <p id="stockProducto">Stock: ${item.stock}</p>
                    <p>Precio: ${formatoCOP.format(item.precio)}</p>
                </div>
                <div class="botones-container">
                    <div class="cantidad-container cantidad-container">
                        <button id="restar" data-id="${item.productoId}" type="button" class="restar">-</button>
                        <input type="number" class="cantidad" min="1" max="${item.stock}" value="${item.cantidad}" />
                        <button id="sumar" data-id="${item.productoId}" type="button" class="sumar">+</button>
                    </div>
                    
                    <button class="eliminar-carrito boton-funcion" data-id="${item.productoId}">Eliminar</button>
                </div>
            </div>
        `;
        total += item.precio * item.cantidad;
        fragment.appendChild(productoCard);
        contador++;
    });

    carritoContainer.innerHTML = '';
    carritoContainer.appendChild(fragment);

    const totalContainer = document.getElementById('totalContainer');
    let h2TotalContainer = totalContainer.querySelector('h2');
    if (!h2TotalContainer) {
    h2TotalContainer = document.createElement('h2');
    totalContainer.appendChild(h2TotalContainer);
    }
    h2TotalContainer.innerHTML = `Total: ${formatoCOP.format(total)}`;

    initSlider();


}



await insertarCarrito();
