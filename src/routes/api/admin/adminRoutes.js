import express from "express";
const router = express.Router();

import {infoProducto, crearProductoAdmin} from '../../../controllers/api/productoControllers.js'

import { verificarAutenticacion, verificarAdmin } from '../../../middlewares/sesionMiddlewares.js'

// importaciones de controllers para las rutas 

import {adminInicioControllers,
        productosInicioControllers,
        categoriaCrearAdminControllers
        
} from '../../../controllers/api/admin/adminControllers.js'

// 🔹 Dashboard (solo autenticados)

// RUTAS NUEVAS PARA PROGRAMAR 

router.get('/' , verificarAutenticacion, verificarAdmin, adminInicioControllers);

// rutas para los productos

router.get('/productos', verificarAutenticacion, verificarAdmin, productosInicioControllers );

router.get("/producto/crear", verificarAutenticacion, verificarAdmin, crearProductoAdmin)

router.get("/producto/:id", verificarAutenticacion, verificarAdmin, infoProducto);

router.get("/categoria/crear", verificarAutenticacion, verificarAdmin, categoriaCrearAdminControllers)

// rutas para administrar a los clientes desde el panel del administrador 

import { clientesPendientesControllers,clientesPendientesListarControllers } from '../../../controllers/api/admin/clientesAdminControllers.js'

router.get('/clientes/pendientes', verificarAutenticacion, verificarAdmin, clientesPendientesControllers);

router.post('/clientes/pendientes' , verificarAutenticacion, verificarAdmin, clientesPendientesListarControllers);

import pool from "../../../models/bd.js";

router.put('/clientes/estado-modificar', verificarAdmin, async (req, res) => {
        try {
            const { id_usuario, estado } = req.body;
    
            // Validar datos
            if (!id_usuario || !['aprobado', 'rechazado'].includes(estado)) {
                return res.status(400).json({ error: 'Datos inválidos' });
            }
    
            // Actualizar en la base de datos
            const [result] = await pool.query(
                'UPDATE usuarios_aprobacion SET estado = ? WHERE id_usuario = UNHEX(?)',
                [estado, id_usuario.replace(/-/g, '')]
            );
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
    
            res.json({ mensaje: `Estado actualizado a ${estado}` });
    
        } catch (error) {
            console.error('Error en la ruta /estado:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
    

export default router;
