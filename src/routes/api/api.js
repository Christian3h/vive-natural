import express from 'express'

const router = express.Router()

// Importar las nuevas rutas organizadas
import authRoutes from './auth/index.js'
import productRoutes from './products/productRoutes.js'
import salesRoutes from './sales/salesRoutes.js'
import userRoutes from './users/userRoutes.js'
import adminRoutes from '../views/admin/adminRoutes.js'

// Rutas existentes que no se movieron de api/
import carritoRoutes from './cart/carritoRoutes.js'
import categoriaRoutes from './products/categoriaRoutes.js' // Esta ruta debería haberse movido a productRoutes.js si solo maneja categorías de productos.

// Usar las nuevas rutas
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/sales', salesRoutes)
router.use('/users', userRoutes)
router.use('/admin', adminRoutes)

// Rutas existentes (asegurarse de que estén bien ubicadas)
router.use('/cart', carritoRoutes)
router.use('/categories', categoriaRoutes) // Revisa si esta ruta aún es necesaria aquí o si debe estar en productRoutes.js

export default router