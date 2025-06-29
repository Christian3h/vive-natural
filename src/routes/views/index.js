import express from 'express';

const router = express.Router();


// rutas de los usuarios, tienda, index, contacto y demas 
import users from './users/usersRoutes.js'
router.use('/', users)

// rutas para el login 
import login from './login/loginRoutes.js'
router.use('/', login)

//rutas para el admin
import admin from './admin/adminRoutes.js'
router.use('/admin',admin)

// rutas para los pagos 
import pages from './sales/paymentsRoutes.js'
router.use('/', pages)


export default router;