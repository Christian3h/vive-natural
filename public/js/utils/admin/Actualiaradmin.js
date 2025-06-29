import { updateProductAdmin } from '../../fetch/utils/admin/actualizarAdminFetch.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const deleteButtons = document.querySelectorAll(".fotos-editar button");
    const deletedImages = new Set();

    // Obtener ID del producto desde la URL
    const urlSegments = window.location.pathname.split("/");
    const productoId = urlSegments[urlSegments.length - 2];

    // Marcar imágenes para eliminar
    deleteButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const imgContainer = button.closest(".fotos");
            const img = imgContainer.querySelector("img");
            img.style.opacity = "0.5"; // Oscurecer la imagen
            deletedImages.add(button.dataset.id);
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData();

        // Obtener valores del formulario manualmente
        formData.append("nombre", form.querySelector("#nombreProducto").value.trim());
        formData.append("descripcion", form.querySelector("#descripcionProducto").value.trim());
        
        const descripcionLargaValue = form.querySelector("#descripcionLarga").value.trim();
        console.log('Valor capturado para descripcion_larga en frontend:', descripcionLargaValue);
        formData.append("descripcion_larga", descripcionLargaValue);

        formData.append("categoria", form.querySelector("#categoria").value.trim());
        formData.append("id_subcategoria", form.querySelector("#subCategoriaProducto").value.trim());
        formData.append("precio", form.querySelector("#precioProducto").value.trim());
        formData.append("stock", form.querySelector("#stockProducto").value.trim());

        // Agregar imágenes a eliminar
        if (deletedImages.size > 0) {
            formData.append("imagenes_delete", JSON.stringify(Array.from(deletedImages)));
        }

        // 📌 **Corrección: Enviar imágenes correctamente**
        const fileInput = form.querySelector("#imagenProducto");
        if (fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append("imagenes", fileInput.files[i]); // ✅ Enviar correctamente la imagen
            }
        }
        try {
            const data = await updateProductAdmin(productoId, formData); // Usar la nueva función
            alert("✅ Producto actualizado correctamente");
            window.location.href = `/admin/products/overview`;
        } catch (error) {
            console.error("🚨 Error:", error);
            alert("❌ Hubo un problema al actualizar el producto. Revisa la consola para más detalles.");
        }
    });
});
