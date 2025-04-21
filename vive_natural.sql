-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 20-04-2025 a las 00:57:52
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `vive_natural`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_usuarios`
--

CREATE TABLE `carrito_usuarios` (
  `id` int(11) NOT NULL,
  `id_usuario` binary(16) NOT NULL,
  `id_producto` binary(16) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito_usuarios`
--

INSERT INTO `carrito_usuarios` (`id`, `id_usuario`, `id_producto`, `cantidad`, `actualizado_en`) VALUES
(84, 0x22363050191a4cd798b2e4db8256aee2, 0x5af5c5231bb811f0aecdc0353235cf9f, 6, '2025-04-19 20:54:29'),
(99, 0xbf6d2ec6496e46e59c0cf83ebb77fd1d, 0x5af5c5231bb811f0aecdc0353235cf9f, 1, '2025-04-19 21:15:46'),
(113, 0xc8eb3c73770f4d9bbd0115f592b931eb, 0x5af5c5231bb811f0aecdc0353235cf9f, 6, '2025-04-19 22:29:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `nombre`) VALUES
(1, 'vitamina');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `id_detalle` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `producto_id` binary(16) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` int(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`id_detalle`, `id_pedido`, `producto_id`, `cantidad`, `precio_unitario`) VALUES
(27, 28, 0x5af5c5231bb811f0aecdc0353235cf9f, 6, 20000),
(28, 29, 0x5af5c5231bb811f0aecdc0353235cf9f, 6, 20000),
(29, 30, 0x5af5c5231bb811f0aecdc0353235cf9f, 6, 20000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envios`
--

CREATE TABLE `envios` (
  `id_envio` int(11) NOT NULL,
  `id_usuario` binary(16) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `numero` varchar(15) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `direccion` varchar(500) NOT NULL,
  `fecha_envio` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `envios`
--

INSERT INTO `envios` (`id_envio`, `id_usuario`, `nombre`, `numero`, `ciudad`, `direccion`, `fecha_envio`) VALUES
(6, 0x22363050191a4cd798b2e4db8256aee2, 'Christian', '31708079682', 'sogamoso', 'calle siempre viva', '2025-04-19 15:54:51'),
(7, 0xbf6d2ec6496e46e59c0cf83ebb77fd1d, 'Magnesio', '3178079672', 'Sogamoso', 'avenida siempre viva ', '2025-04-19 16:11:26'),
(8, 0xc8eb3c73770f4d9bbd0115f592b931eb, 'gantia', '3178079672', 'sogamoso', '3178079672', '2025-04-19 16:22:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_productos`
--

CREATE TABLE `imagenes_productos` (
  `id` int(11) NOT NULL,
  `id_producto` binary(16) NOT NULL,
  `ruta_imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes_productos`
--

INSERT INTO `imagenes_productos` (`id`, `id_producto`, `ruta_imagen`) VALUES
(1, 0x5af5c5231bb811f0aecdc0353235cf9f, '5af5c5231bb811f0aecdc0353235cf9f_0.webp'),
(2, 0x5af5c5231bb811f0aecdc0353235cf9f, '5af5c5231bb811f0aecdc0353235cf9f_1.webp');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `monto` int(11) NOT NULL,
  `metodo_pago` enum('efectivo','transferencia','tarjeta_credito','tarjeta_debito') NOT NULL,
  `fecha_pago` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','completado','rechazado','reembolsado') NOT NULL DEFAULT 'pendiente',
  `referencia` varchar(100) DEFAULT NULL,
  `comprobante` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos_abono`
--

CREATE TABLE `pagos_abono` (
  `id_abono` int(11) NOT NULL,
  `id_pago` int(11) NOT NULL,
  `monto_abono` decimal(10,2) NOT NULL,
  `fecha_abono` datetime NOT NULL DEFAULT current_timestamp(),
  `metodo_abono` enum('efectivo','transferencia') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` varchar(100) NOT NULL,
  `metodo_pago` varchar(20) NOT NULL,
  `id_envio` int(11) DEFAULT NULL,
  `cuotas` int(11) DEFAULT NULL,
  `fecha_limite` date DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `precio` int(11) DEFAULT NULL,
  `estado` enum('pendiente','cancelado','aprobado') NOT NULL DEFAULT 'pendiente',
  `comentarios` text DEFAULT NULL,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_usuario`, `metodo_pago`, `id_envio`, `cuotas`, `fecha_limite`, `fecha_creacion`, `precio`, `estado`, `comentarios`, `fecha_actualizacion`) VALUES
(28, 'C8EB3C73770F4D9BBD0115F592B931EB', 'efectivo', 8, 5, '2025-04-17', '2025-04-19 16:22:47', 20000, 'aprobado', NULL, '2025-04-19 22:35:27'),
(29, 'C8EB3C73770F4D9BBD0115F592B931EB', 'efectivo', 8, 1, NULL, '2025-04-19 17:29:16', 20000, 'pendiente', NULL, '2025-04-19 22:29:16'),
(30, 'C8EB3C73770F4D9BBD0115F592B931EB', 'efectivo', 8, 6, '2025-04-03', '2025-04-19 17:29:31', 20000, 'aprobado', NULL, '2025-04-19 22:38:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `precios`
--

CREATE TABLE `precios` (
  `id` int(11) NOT NULL,
  `id_producto` binary(16) NOT NULL,
  `precio` int(20) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `precios`
--

INSERT INTO `precios` (`id`, `id_producto`, `precio`, `fecha_creacion`, `activo`) VALUES
(1, 0x5af5c5231bb811f0aecdc0353235cf9f, 20000, '2025-04-17 13:18:26', 0),
(2, 0x5af5c5231bb811f0aecdc0353235cf9f, 20000, '2025-04-17 13:18:39', 0),
(3, 0x5af5c5231bb811f0aecdc0353235cf9f, 20000, '2025-04-19 15:19:24', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` binary(16) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` date NOT NULL DEFAULT current_timestamp(),
  `id_categoria` int(11) NOT NULL,
  `id_subcategoria` int(11) DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `estado`, `activo`, `fecha_creacion`, `id_categoria`, `id_subcategoria`, `costo`) VALUES
(0x5af5c5231bb811f0aecdc0353235cf9f, 'Magnesio', 'vitamina', 1, 1, '2025-04-17', 1, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento_pedidos`
--

CREATE TABLE `seguimiento_pedidos` (
  `id_seguimiento` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `estado` enum('pendiente','cancelado','pagado') NOT NULL,
  `fecha_cambio` datetime NOT NULL DEFAULT current_timestamp(),
  `comentario` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seguimiento_pedidos`
--

INSERT INTO `seguimiento_pedidos` (`id_seguimiento`, `id_pedido`, `estado`, `fecha_cambio`, `comentario`) VALUES
(4, 28, 'pendiente', '2025-04-19 16:22:47', 'sin comentarios'),
(5, 29, 'pendiente', '2025-04-19 17:29:16', 'sin comentarios'),
(6, 30, 'pendiente', '2025-04-19 17:29:31', 'sin comentarios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `id_producto` binary(16) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `ultima_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `stock`
--

INSERT INTO `stock` (`id`, `id_producto`, `cantidad`, `ultima_actualizacion`) VALUES
(1, 0x5af5c5231bb811f0aecdc0353235cf9f, 5, '2025-04-17 13:18:26'),
(2, 0x5af5c5231bb811f0aecdc0353235cf9f, 5, '2025-04-17 13:18:39'),
(3, 0x5af5c5231bb811f0aecdc0353235cf9f, 2, '2025-04-17 13:24:24'),
(4, 0x5af5c5231bb811f0aecdc0353235cf9f, 5, '2025-04-17 22:32:39'),
(5, 0x5af5c5231bb811f0aecdc0353235cf9f, 8, '2025-04-17 22:33:51'),
(6, 0x5af5c5231bb811f0aecdc0353235cf9f, 11, '2025-04-17 22:34:47'),
(7, 0x5af5c5231bb811f0aecdc0353235cf9f, 14, '2025-04-17 22:35:18'),
(8, 0x5af5c5231bb811f0aecdc0353235cf9f, 17, '2025-04-17 22:36:34'),
(9, 0x5af5c5231bb811f0aecdc0353235cf9f, 20, '2025-04-17 22:37:27'),
(10, 0x5af5c5231bb811f0aecdc0353235cf9f, 5, '2025-04-17 22:39:53'),
(11, 0x5af5c5231bb811f0aecdc0353235cf9f, 20, '2025-04-17 22:40:32'),
(12, 0x5af5c5231bb811f0aecdc0353235cf9f, 5, '2025-04-17 22:41:03'),
(13, 0x5af5c5231bb811f0aecdc0353235cf9f, 4, '2025-04-17 22:59:48'),
(14, 0x5af5c5231bb811f0aecdc0353235cf9f, 5, '2025-04-17 23:00:11'),
(15, 0x5af5c5231bb811f0aecdc0353235cf9f, 20, '2025-04-17 23:00:24'),
(16, 0x5af5c5231bb811f0aecdc0353235cf9f, 35, '2025-04-17 23:00:29'),
(17, 0x5af5c5231bb811f0aecdc0353235cf9f, 33, '2025-04-17 23:05:23'),
(18, 0x5af5c5231bb811f0aecdc0353235cf9f, 73, '2025-04-17 23:34:20'),
(19, 0x5af5c5231bb811f0aecdc0353235cf9f, 72, '2025-04-18 00:10:52'),
(20, 0x5af5c5231bb811f0aecdc0353235cf9f, 73, '2025-04-18 00:11:40'),
(21, 0x5af5c5231bb811f0aecdc0353235cf9f, 75, '2025-04-18 00:11:57'),
(22, 0x5af5c5231bb811f0aecdc0353235cf9f, 76, '2025-04-18 00:14:53'),
(23, 0x5af5c5231bb811f0aecdc0353235cf9f, 77, '2025-04-18 00:16:51'),
(24, 0x5af5c5231bb811f0aecdc0353235cf9f, 78, '2025-04-18 02:45:03'),
(25, 0x5af5c5231bb811f0aecdc0353235cf9f, 77, '2025-04-18 02:50:38'),
(26, 0x5af5c5231bb811f0aecdc0353235cf9f, 78, '2025-04-18 02:53:50'),
(27, 0x5af5c5231bb811f0aecdc0353235cf9f, 77, '2025-04-18 02:54:19'),
(28, 0x5af5c5231bb811f0aecdc0353235cf9f, 76, '2025-04-18 02:56:07'),
(29, 0x5af5c5231bb811f0aecdc0353235cf9f, 59, '2025-04-18 02:57:16'),
(30, 0x5af5c5231bb811f0aecdc0353235cf9f, 76, '2025-04-18 02:57:36'),
(31, 0x5af5c5231bb811f0aecdc0353235cf9f, 77, '2025-04-18 02:57:48'),
(32, 0x5af5c5231bb811f0aecdc0353235cf9f, 78, '2025-04-18 02:57:52'),
(33, 0x5af5c5231bb811f0aecdc0353235cf9f, 61, '2025-04-18 03:25:05'),
(34, 0x5af5c5231bb811f0aecdc0353235cf9f, 44, '2025-04-18 03:50:39'),
(35, 0x5af5c5231bb811f0aecdc0353235cf9f, 27, '2025-04-18 03:54:55'),
(36, 0x5af5c5231bb811f0aecdc0353235cf9f, 10, '2025-04-18 03:56:31'),
(37, 0x5af5c5231bb811f0aecdc0353235cf9f, 9, '2025-04-18 10:40:45'),
(38, 0x5af5c5231bb811f0aecdc0353235cf9f, 8, '2025-04-18 11:45:07'),
(39, 0x5af5c5231bb811f0aecdc0353235cf9f, 2, '2025-04-19 13:16:31'),
(40, 0x5af5c5231bb811f0aecdc0353235cf9f, 0, '2025-04-19 15:13:29'),
(41, 0x5af5c5231bb811f0aecdc0353235cf9f, 1000000000, '2025-04-19 15:19:24'),
(42, 0x5af5c5231bb811f0aecdc0353235cf9f, 999999994, '2025-04-19 15:26:26'),
(43, 0x5af5c5231bb811f0aecdc0353235cf9f, 999999988, '2025-04-19 15:48:01'),
(44, 0x5af5c5231bb811f0aecdc0353235cf9f, 999999982, '2025-04-19 16:22:47'),
(45, 0x5af5c5231bb811f0aecdc0353235cf9f, 999999976, '2025-04-19 17:29:16'),
(46, 0x5af5c5231bb811f0aecdc0353235cf9f, 999999970, '2025-04-19 17:29:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategoria`
--

CREATE TABLE `subcategoria` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subcategoria`
--

INSERT INTO `subcategoria` (`id`, `nombre`, `id_categoria`) VALUES
(1, 'vitamina', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` binary(16) NOT NULL,
  `google_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `rol` enum('usuario','admin') NOT NULL DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `google_id`, `name`, `email`, `profile_picture`, `rol`) VALUES
(0x22363050191a4cd798b2e4db8256aee2, '109910752836011292400', 'Christian Martinez', 'christianmartinez3h@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocIrdB3vNYBQDG2ALucr0HoL6ZJGLyxXOn5_JUUnQC0MnUJ9Cg=s96-c', 'usuario'),
(0xbf6d2ec6496e46e59c0cf83ebb77fd1d, '117240478737344584781', 'Christian Martinez', 'cristianmartinezhurtado@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocKdxZnJrC_OQwIJ4YaQfVr5rwS-uGWO1PCF7KakVZaL5KHABko=s96-c', 'admin'),
(0xc8eb3c73770f4d9bbd0115f592b931eb, '100310930508473137537', 'Gantia', 'gantia1999@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocLQ_GRzLky4lFi4qqenHb1AiLTZJF7WBAeAyOUzpgEBG__Eiww=s96-c', 'usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_aprobacion`
--

CREATE TABLE `usuarios_aprobacion` (
  `id_usuario` binary(16) NOT NULL,
  `estado` enum('pendiente','aprobado','rechazado') NOT NULL DEFAULT 'pendiente',
  `aprobado_por` binary(16) DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios_aprobacion`
--

INSERT INTO `usuarios_aprobacion` (`id_usuario`, `estado`, `aprobado_por`, `fecha_aprobacion`) VALUES
(0x22363050191a4cd798b2e4db8256aee2, 'aprobado', NULL, NULL),
(0xbf6d2ec6496e46e59c0cf83ebb77fd1d, 'aprobado', NULL, NULL),
(0xc8eb3c73770f4d9bbd0115f592b931eb, 'aprobado', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito_usuarios`
--
ALTER TABLE `carrito_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_usuario_producto` (`id_usuario`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `fk_detalle_producto` (`producto_id`);

--
-- Indices de la tabla `envios`
--
ALTER TABLE `envios`
  ADD PRIMARY KEY (`id_envio`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `imagenes_productos`
--
ALTER TABLE `imagenes_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `fk_pago_pedido` (`id_pedido`);

--
-- Indices de la tabla `pagos_abono`
--
ALTER TABLE `pagos_abono`
  ADD PRIMARY KEY (`id_abono`),
  ADD KEY `id_pago` (`id_pago`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `fk_pedidos_envios` (`id_envio`);

--
-- Indices de la tabla `precios`
--
ALTER TABLE `precios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_categoria` (`id_categoria`),
  ADD KEY `fk_productos_subcategoria` (`id_subcategoria`);

--
-- Indices de la tabla `seguimiento_pedidos`
--
ALTER TABLE `seguimiento_pedidos`
  ADD PRIMARY KEY (`id_seguimiento`),
  ADD KEY `fk_seguimiento_pedido` (`id_pedido`);

--
-- Indices de la tabla `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `google_id` (`google_id`);

--
-- Indices de la tabla `usuarios_aprobacion`
--
ALTER TABLE `usuarios_aprobacion`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `aprobado_por` (`aprobado_por`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito_usuarios`
--
ALTER TABLE `carrito_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `envios`
--
ALTER TABLE `envios`
  MODIFY `id_envio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `imagenes_productos`
--
ALTER TABLE `imagenes_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `pagos_abono`
--
ALTER TABLE `pagos_abono`
  MODIFY `id_abono` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `precios`
--
ALTER TABLE `precios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `seguimiento_pedidos`
--
ALTER TABLE `seguimiento_pedidos`
  MODIFY `id_seguimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `subcategoria`
--
ALTER TABLE `subcategoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito_usuarios`
--
ALTER TABLE `carrito_usuarios`
  ADD CONSTRAINT `carrito_usuarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carrito_usuarios_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `envios`
--
ALTER TABLE `envios`
  ADD CONSTRAINT `envios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenes_productos`
--
ALTER TABLE `imagenes_productos`
  ADD CONSTRAINT `imagenes_productos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pago_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pagos_abono`
--
ALTER TABLE `pagos_abono`
  ADD CONSTRAINT `pagos_abono_ibfk_1` FOREIGN KEY (`id_pago`) REFERENCES `pagos` (`id_pago`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedidos_envios` FOREIGN KEY (`id_envio`) REFERENCES `envios` (`id_envio`);

--
-- Filtros para la tabla `precios`
--
ALTER TABLE `precios`
  ADD CONSTRAINT `precios_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_subcategoria` FOREIGN KEY (`id_subcategoria`) REFERENCES `subcategoria` (`id`),
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`);

--
-- Filtros para la tabla `seguimiento_pedidos`
--
ALTER TABLE `seguimiento_pedidos`
  ADD CONSTRAINT `fk_seguimiento_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD CONSTRAINT `subcategoria_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`);

--
-- Filtros para la tabla `usuarios_aprobacion`
--
ALTER TABLE `usuarios_aprobacion`
  ADD CONSTRAINT `usuarios_aprobacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuarios_aprobacion_ibfk_2` FOREIGN KEY (`aprobado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;