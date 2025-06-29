-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: vive_natural
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrito_usuarios`
--

DROP TABLE IF EXISTS `carrito_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_usuarios` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` binary(16) NOT NULL,
  `id_producto` binary(16) NOT NULL,
  `cantidad` int NOT NULL DEFAULT 1,
  `actualizado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_usuario_producto` (`id_usuario`,`id_producto`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=405 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito_usuarios`
--

LOCK TABLES `carrito_usuarios` WRITE;
/*!40000 ALTER TABLE `carrito_usuarios` DISABLE KEYS */;
INSERT INTO `carrito_usuarios` VALUES (257,_binary '\rȑ��[C���_\�[X2\�',_binary '��\�N8���E�525ϟ',3,'2025-06-10 00:25:57'),(259,_binary '!F�$�G����\�<\�m`',_binary '��\�N8���E�525ϟ',4,'2025-06-10 00:26:08'),(373,_binary '�C#�;qOO�\�ʿ���&',_binary '��\�N8���E�525ϟ',3,'2025-06-11 10:32:49'),(403,_binary '�fh\�\0GӜ�\�\�%�e',_binary '��\�N8���E�525ϟ',11,'2025-06-13 00:59:56');
/*!40000 ALTER TABLE `carrito_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'vitamina');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id_detalle` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_pedido` int NOT NULL,
  `producto_id` binary(16) NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` int NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES (1,1,_binary '��\�N8���E�525ϟ',11,15000),(2,2,_binary '��\�N8���E�525ϟ',4,15000),(3,3,_binary '��\�N8���E�525ϟ',11,15000);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `envios`
--

DROP TABLE IF EXISTS `envios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `envios` (
  `id_envio` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` binary(16) NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `numero` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `ciudad` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_envio` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `envios`
--

LOCK TABLES `envios` WRITE;
/*!40000 ALTER TABLE `envios` DISABLE KEYS */;
INSERT INTO `envios` VALUES (1,_binary '!F�$�G����\�<\�m`','Christian Martinez','3178079672','sogamoso','calle 10-28 83','2025-05-24 06:30:25'),(2,_binary '�fh\�\0GӜ�\�\�%�e','gantia','3178079672','sogamoso','calle 10','2025-05-24 08:22:23'),(3,_binary '�C#�;qOO�\�ʿ���&','Christian Martinez','3178079672','Duitama','calle 10','2025-06-10 18:20:30');
/*!40000 ALTER TABLE `envios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenes_productos`
--

DROP TABLE IF EXISTS `imagenes_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenes_productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_producto` binary(16) NOT NULL,
  `ruta_imagen` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `imagenes_productos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenes_productos`
--

LOCK TABLES `imagenes_productos` WRITE;
/*!40000 ALTER TABLE `imagenes_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `imagenes_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pago` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_pedido` int NOT NULL,
  `monto` int NOT NULL,
  `metodo_pago` ENUM('efectivo','transferencia','tarjeta_credito','tarjeta_debito') NOT NULL,
  `fecha_pago` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` ENUM('pendiente','completado','rechazado','reembolsado') NOT NULL DEFAULT 'pendiente',
  `referencia` varchar(100),
  `comprobante` varchar(255),
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,1,165000,'efectivo','2025-05-24 13:19:07','completado',NULL,NULL),(2,2,60000,'efectivo','2025-05-24 13:26:16','completado',NULL,NULL),(3,3,165000,'efectivo','2025-06-12 19:59:37','pendiente',NULL,NULL);
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos_abono`
--

DROP TABLE IF EXISTS `pagos_abono`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos_abono` (
  `id_abono` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_pago` int NOT NULL,
  `monto_abono` decimal(10,2) NOT NULL,
  `fecha_abono` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `metodo_abono` ENUM('efectivo','transferencia','payU','tarjeta') NOT NULL,
  FOREIGN KEY (id_pago) REFERENCES pagos(id_pago) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos_abono`
--

LOCK TABLES `pagos_abono` WRITE;
/*!40000 ALTER TABLE `pagos_abono` DISABLE KEYS */;
INSERT INTO `pagos_abono` VALUES (1,1,165000.00,'2025-05-24 13:24:16','tarjeta'),(2,2,30000.00,'2025-05-24 13:26:55','efectivo'),(3,2,30000.00,'2025-05-25 13:23:01','efectivo');
/*!40000 ALTER TABLE `pagos_abono` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` binary(16) NOT NULL,
  `metodo_pago` varchar(20) NOT NULL,
  `id_envio` int,
  `cuotas` int,
  `fecha_limite` date,
  `fecha_creacion` datetime,
  `precio` int,
  `estado` enum('pendiente','cancelado','aprobado') NOT NULL DEFAULT 'pendiente',
  `comentarios` text,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_envio) REFERENCES envios(id_envio)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,'07816668DE0047D39C0BAFD3C2258365','payU',2,1,NULL,'2025-05-24 13:18:03',165000,'aprobado',NULL,'2025-05-24 18:19:07'),(2,'0721468D249747B69A8BB7DC3CDF6D60','cuotas',1,3,'2025-05-14','2025-05-24 13:25:58',60000,'aprobado',NULL,'2025-05-24 18:26:16'),(3,'07816668DE0047D39C0BAFD3C2258365','contado',2,1,NULL,'2025-06-09 16:36:20',165000,'cancelado',NULL,'2025-06-13 00:59:37');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `precios`
--

DROP TABLE IF EXISTS `precios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `precios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_producto` binary(16) NOT NULL,
  `precio` int NOT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `precios_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `precios`
--

LOCK TABLES `precios` WRITE;
/*!40000 ALTER TABLE `precios` DISABLE KEYS */;
INSERT INTO `precios` VALUES (1,_binary '��\�N8���E�525ϟ',15000,'2025-05-24 06:17:08',0),(2,_binary '��\�N8���E�525ϟ',15000,NULL,0),(3,_binary '��\�N8���E�525ϟ',15000,NULL,0),(4,_binary '��\�N8���E�525ϟ',15000,NULL,0),(5,_binary '��\�N8���E�525ϟ',15000,NULL,0),(6,_binary '��\�N8���E�525ϟ',15000,NULL,1);
/*!40000 ALTER TABLE `precios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` binary(16) NOT NULL PRIMARY KEY,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(1000),
  `estado` tinyint(1) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` date,
  `id_categoria` int NOT NULL,
  `id_subcategoria` int,
  `costo` decimal(10,2),
  FOREIGN KEY (id_categoria) REFERENCES categoria(id),
  FOREIGN KEY (id_subcategoria) REFERENCES subcategoria(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (_binary '��\�N8���E�525ϟ','vitamina','esto es una vitamina muy vitaminosa',1,1,'2025-05-24',1,1,10000.00);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seguimiento_pedidos`
--

DROP TABLE IF EXISTS `seguimiento_pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguimiento_pedidos` (
  `id_seguimiento` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_pedido` int NOT NULL,
  `estado` enum('pendiente','cancelado','pagado') NOT NULL,
  `fecha_cambio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comentario` text,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seguimiento_pedidos`
--

LOCK TABLES `seguimiento_pedidos` WRITE;
/*!40000 ALTER TABLE `seguimiento_pedidos` DISABLE KEYS */;
INSERT INTO `seguimiento_pedidos` VALUES (1,1,'pendiente','2025-05-24 06:30:41','sin comentarios'),(2,1,'pagado','2025-05-24 06:31:49',NULL),(3,2,'pagado','2025-05-24 06:37:01','sin comentarios'),(4,3,'pendiente','2025-05-24 06:37:26','sin comentarios'),(5,4,'pagado','2025-05-24 08:19:35','sin comentarios'),(6,5,'pagado','2025-05-24 13:06:42','sin comentarios'),(7,6,'pagado','2025-05-24 13:07:22','sin comentarios'),(8,7,'pagado','2025-05-24 13:12:15','sin comentarios'),(9,1,'pagado','2025-05-24 13:18:03','sin comentarios'),(10,2,'pagado','2025-05-24 13:25:58','sin comentarios'),(11,1,'pagado','2025-05-24 13:28:32',NULL),(12,2,'pagado','2025-05-25 13:22:44',NULL),(13,3,'pendiente','2025-06-09 16:36:20','sin comentarios'),(14,3,'cancelado','2025-06-12 19:59:52',NULL);
/*!40000 ALTER TABLE `seguimiento_pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_producto` binary(16) NOT NULL,
  `cantidad` int NOT NULL,
  `ultima_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_producto) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,_binary '��\�N8���E�525ϟ',20,'2025-05-24 06:17:08'),(2,_binary '��\�N8���E�525ϟ',19,'2025-05-24 06:30:41'),(3,_binary '��\�N8���E�525ϟ',18,'2025-05-24 06:37:01'),(4,_binary '��\�N8���E�525ϟ',17,'2025-05-24 06:37:26'),(5,_binary '��\�N8���E�525ϟ',5,'2025-05-24 08:19:35'),(6,_binary '��\�N8���E�525ϟ',20,'2025-05-24 08:24:35'),(7,_binary '��\�N8���E�525ϟ',18,'2025-05-24 13:06:42'),(8,_binary '��\�N8���E�525ϟ',16,'2025-05-24 13:07:22'),(9,_binary '��\�N8���E�525ϟ',11,'2025-05-24 13:12:15'),(10,_binary '��\�N8���E�525ϟ',0,'2025-05-24 13:18:03'),(11,_binary '��\�N8���E�525ϟ',4,'2025-05-24 13:25:23'),(12,_binary '��\�N8���E�525ϟ',0,'2025-05-24 13:25:58'),(13,_binary '��\�N8���E�525ϟ',0,'2025-05-25 05:34:36'),(14,_binary '��\�N8���E�525ϟ',13,'2025-05-25 05:34:44'),(15,_binary '��\�N8���E�525ϟ',2,'2025-06-09 16:36:20'),(16,_binary '��\�N8���E�525ϟ',2,'2025-06-11 17:26:10'),(17,_binary '��\�N8���E�525ϟ',13,'2025-06-12 19:59:37');
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategoria`
--

DROP TABLE IF EXISTS `subcategoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_categoria` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `subcategoria_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategoria`
--

LOCK TABLES `subcategoria` WRITE;
/*!40000 ALTER TABLE `subcategoria` DISABLE KEYS */;
INSERT INTO `subcategoria` VALUES (1,'colageno',1);
/*!40000 ALTER TABLE `subcategoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` binary(16) NOT NULL PRIMARY KEY,
  `google_id` varchar(255) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_picture` varchar(500),
  `rol` ENUM('usuario','admin') NOT NULL DEFAULT 'usuario'
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (_binary '!F�$�G����\�<\�m`','109910752836011292400','Christian Martinez','christianmartinez3h@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocIrdB3vNYBQDG2ALucr0HoL6ZJGLyxXOn5_JUUnQC0MnUJ9Cg=s96-c','usuario'),(_binary '�fh\�\0GӜ�\�\�%�e','100310930508473137537','Gantia','gantia1999@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocLQ_GRzLky4lFi4qqenHb1AiLTZJF7WBAeAyOUzpgEBG__Eiww=s96-c','admin'),(_binary '\rȑ��[C���_\�[X2\�','112353765003074795569','Prigma Software','prigmasoftware@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocI99hj4kT0tNwgusdQoKMrMDmrLg7McRPFhiAuyx9o8F360aA=s96-c','usuario'),(_binary '�C#�;qOO�\�ʿ���&','117240478737344584781','Christian Martinez','cristianmartinezhurtado@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocKdxZnJrC_OQwIJ4YaQfVr5rwS-uGWO1PCF7KakVZaL5KHABko=s96-c','usuario');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `


/*
 Descripción profesional del funcionamiento de la base de datos
> Descripción funcional de la base de datos de compras y usuarios
>
> El sistema de base de datos está diseñado para gestionar un flujo de ventas con dos modalidades de pago: pasarela directa y pago con aprobación administrativa.
>
> - Usuarios: Los usuarios se registran y pueden ser aprobados o rechazados por un administrador antes de poder realizar compras, lo que se gestiona en la tabla usuarios_aprobacion.
>
> - Carrito y productos: Los usuarios pueden agregar productos a su carrito (carrito_usuarios). Los productos están organizados en categorías y subcategorías.
>
> - Pedidos: Cuando un usuario realiza una compra, se genera un pedido en la tabla pedidos, que puede estar en estado pendiente, aprobado o cancelado. El detalle de cada pedido (productos, cantidades, precios) se almacena en detalle_pedido.
>
> - Pagos: Cada pedido puede tener uno o varios pagos asociados (pagos y pagos_abono), permitiendo pagos completos o en cuotas. El estado del pago puede ser pendiente, completado, rechazado o reembolsado.
>
> - Aprobación de compras: Para compras que requieren aprobación, el pedido queda en estado pendiente hasta que un administrador lo aprueba o rechaza. Si se aprueba, se descuenta el stock del producto; si se rechaza, el stock se devuelve.
>
> - Envíos: Los datos de envío se almacenan en la tabla envios, vinculados al usuario y al pedido.
>
> - Stock: El stock de cada producto se actualiza automáticamente según las compras aprobadas y pagadas.
>
> - Seguimiento: Todos los cambios de estado de los pedidos se registran en la tabla seguimiento_pedidos, permitiendo un historial completo de cada transacción.
>
> Esta estructura permite reportes claros sobre ventas, pagos, usuarios aprobados, pedidos pendientes y el historial de cada operación, facilitando la gestión y auditoría del negocio.

*/