document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".producto-crear");

    if (!form) {
        console.error("❌ Error: No se encontró el formulario con la clase .producto-crear");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData();

        // Verificar que los elementos existen antes de acceder a su valor
        const nombre = form.querySelector("[name='nombre']");
        const descripcion = form.querySelector("[name='descripcion']");
        const precio = form.querySelector("[name='precio']");
        const stock = form.querySelector("[name='stock']");
        const categoria = form.querySelector("#categoria");
        const subCategoria = form.querySelector("#subCategoria");
        const fileInput = form.querySelector("[name='imagen']");

        if (!nombre || !descripcion || !precio || !stock || !categoria || !subCategoria) {
            console.error("❌ Error: No se encontraron todos los campos del formulario.");
            alert("Error: Algunos campos del formulario no existen.");
            return;
        }

        formData.append("nombre", nombre.value.trim());
        formData.append("descripcion", descripcion.value.trim());
        formData.append("precio", precio.value.trim());
        formData.append("stock", stock.value.trim());

        // Validar que el usuario haya seleccionado una categoría y subcategoría
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

        // 📌 **Corrección: Asegurar que las imágenes se envían correctamente**
        if (fileInput && fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append("imagenes", fileInput.files[i]); // ✅ Enviar correctamente la imagen
            }
        }

        // Debug: Mostrar datos antes de enviar
        console.log("📤 Datos enviados:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        
        const url = "/api/producto/crearProducto";
        
        try {
            const response = await fetch(url, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            const responseText = await response.text(); // Obtener respuesta como texto

            if (!response.ok) {
                throw new Error(`Error al crear el producto: ${response.status} - ${responseText}`);
            }

            const data = JSON.parse(responseText);
            alert("✅ Producto creado correctamente");
            window.location.href = "/sesion/admin/productos"; // Redirigir después de éxito
        } catch (error) {
            console.error("🚨 Error:", error);
            alert("❌ Hubo un problema al crear el producto. Revisa la consola para más detalles.");
        }
    });
});
