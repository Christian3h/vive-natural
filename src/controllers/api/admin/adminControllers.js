// codigo remasterizado 

export async function adminInicioControllers(req, res) {
    res.render('admin/dashboard', {
        usuario: req.user
    });
}

// parte para todo el tema de los productos

export async function productosInicioControllers(req, res) {
    res.render('admin/productos/dashboardProductos', {
        usuario: req.user
    });
    
}


// export async function dashboardAdminControllers(req, res) {
//     res.render('admin/dashboard', { 
//        usuario: req.user
//     });
// }

// export async function dashboardSeccionAdminControllers(req, res) {
//     const { seccion } = req.params;
//     const validSections = ["finanzas", "productos", "categorias"];
  
//     if (!validSections.includes(seccion)) {
//       return res.status(404).send("<p>Sección no encontrada</p>");
//     }
  
//     res.render(`admin/${seccion}`);
// }

export async function categoriaCrearAdminControllers (req, res) {
    res.render('admin/productos/crearCategoria', {
        usuario: req.user
    })
}

import {categoriaSubCategoria } from '../../../services/api/productoServices.js'

export async function subCategoriaCrearAdminControllers (req, res){
    const { categorias, subcategorias } = await categoriaSubCategoria();
    res.render('admin/productos/crearSubCategoria', {
        usuario: req.user,
        categorias,
        subcategorias
    })
}