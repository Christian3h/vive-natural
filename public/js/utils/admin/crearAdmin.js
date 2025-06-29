import { createProductAdmin } from '../../fetch/utils/admin/crearAdminFetch.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".producto-crear");

    if (!form) {
        console.error("❌ Error: No se encontró el formulario con la clase .producto-crear");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData();

        const nombre = form.querySelector("[name='nombre']");
        const descripcion = form.querySelector("[name='descripcion']");
        const descripcionLarga = form.querySelector("[name='descripcionLarga']");
        const precio = form.querySelector("[name='precio']");
        const costo = form.querySelector("[name='costo']");
        const stock = form.querySelector("[name='stock']");
        const categoria = form.querySelector("#categoria");
        const subCategoria = form.querySelector("#subCategoria");
        const fileInput = form.querySelector("[name='imagen']");

        if (!nombre || !descripcion || !descripcionLarga || !precio || !stock || !categoria || !subCategoria || !costo) {
            console.error("❌ Error: No se encontraron todos los campos del formulario.");
            alert("Error: Algunos campos del formulario no existen.");
            return;
        }

        formData.append("nombre", nombre.value.trim());
        formData.append("descripcion", descripcion.value.trim());
        formData.append("precio", precio.value.trim());
        formData.append("costo", costo.value.trim());
        formData.append("stock", stock.value.trim());
        const descripcionLargaValor = descripcionLarga.value.trim();
        formData.append("descripcion_larga", descripcionLargaValor);

        if (!categoria.value) {
            alert("Por favor, selecciona una categoría válida.");
            return;
        }
        if (!subCategoria.value) {
            alert("Por favor, selecciona una subcategoría válida.");
            return;
        }

        formData.append("categoria", categoria.value);
        formData.append("id_subcategoria", subCategoria.value);

        if (fileInput && fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append("imagenes", fileInput.files[i]);
            }
        }

        // Debug: Mostrar datos antes de enviar
        console.log("📤 Datos enviados:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        
        try {
            const data = await createProductAdmin(formData);
            alert("✅ Producto creado correctamente");
            window.location.href = "/admin/products/overview";
        } catch (error) {
            console.error("🚨 Error:", error);
            alert("❌ Hubo un problema al crear el producto. Revisa la consola para más detalles.");
        }
    });
});
