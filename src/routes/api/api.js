import express from 'express'

const router = express.Router()

// rutas productos

import productoRoutes from './productoRoutes.js'
router.use('/producto', productoRoutes)

// rutas validar stock

import carritoRoutes from './carritoRoutes.js'
router.use('/carrito', carritoRoutes)

// rutas categorias

import categoriaRoutes from './categoriaRoutes.js'
router.use('/categoria', categoriaRoutes)

export default router