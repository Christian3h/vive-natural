import {    crearProductoService, 
            listarProductosService, 
            listarProductoService, 
            eliminarProductoService,
            actualizarProductoService,
            consultarInfoProducto,
            categoriaSubCategoria
        } from '../../services/api/productoServices.js';

export async function crearProducto(req, res) {
    try {  
        const { nombre, descripcion, categoria, id_subcategoria, precio, stock, costo } = req.body;
        const imagenes = req.files;
        const resultado = await crearProductoService({ nombre, descripcion, categoria, id_subcategoria, precio, stock, imagenes, costo});
        res.json(resultado);

    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ 
            error: 'Error al crear el producto', 
            detalle: error.message 
        });
    }
};

export async function listarProductos(req, res) {
    try {
        const { categoria, subcategoria } = req.body; 
        const resultado = await listarProductosService(categoria || null, subcategoria || null);
        res.json(resultado);
    } catch (error) {
        console.error('Error al listar los productos:', error);
        res.status(500).json({ 
            error: 'Error al listar los productos', 
            detalle: error.message 
        });
    }
}

export async function listarProducto(req, res) {
    try {
        const { id } = req.params;
        const resultado = await listarProductoService(id);
        res.json(resultado);
    } catch (error) {
        console.error('Error al listar el producto:', error);
        res.status(500).json({ 
            error: 'Error al listar el producto', 
            detalle: error.message 
        });
    }
}

export async function  eliminarProducto (req, res){
    try {
        const { id } = req.params;
        const resultado = await eliminarProductoService(id);
        res.json(resultado);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ 
            error: 'Error al eliminar el producto', 
            detalle: error.message 
        });
    }
}

export async function  actualizarProducto(req, res) {
    try {
        const { id } = req.params;
        const { nombre, descripcion, categoria, id_subcategoria, precio, stock, imagenes_delete } = req.body;
        const imagenes = req.files;
        const resultado = await actualizarProductoService(id, 
            {   nombre, 
                descripcion, 
                categoria, 
                id_subcategoria, 
                precio, 
                stock, 
                imagenes, 
                imagenes_delete 
            });

        res.json(resultado);
    }catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ 
            error: 'Error al actualizar el producto', 
            detalle: error.message 
        });
    }
}

export async function infoProducto(req, res) {
    try {
        const producto = await consultarInfoProducto(req.params.id);
        res.render('admin/productos/productoEditar', {
            usuario: req.user,
            producto: producto
        });
    } catch (error) {
        res.send("<p>Producto no encontrado</p>");
    }
}  

export async function crearProductoAdmin(req, res) {
    const { categorias, subcategorias } = await categoriaSubCategoria(); 
    res.render('admin/productos/productosCrear', {
        usuario: req.user,
        categorias,
        subcategorias
    })
}

