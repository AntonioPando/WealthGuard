CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `fecha_ultimo_cambio_password` datetime(6) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `nick_usuario` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pregunta_seguridad` varchar(255) NOT NULL,
  `primer_apellido` varchar(255) NOT NULL,
  `respuesta_seguridad` varchar(255) NOT NULL,
  `segundo_apellido` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tipo_recomendacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mensaje` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `icono` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `transaccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` double NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha` datetime(6) NOT NULL,
  `tipo_transaccion` bit(1) NOT NULL,
  `categoria_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKk7db1p3y2mxyhrflylujs3bx7` (`categoria_id`),
  KEY `FKe4k4dkaj7tcpfnup7hkljdj4u` (`usuario_id`),
  CONSTRAINT `FKe4k4dkaj7tcpfnup7hkljdj4u` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FKk7db1p3y2mxyhrflylujs3bx7` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recomendacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_recomendacion` datetime(6) NOT NULL,
  `tipo_recomendacion_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKi4cen0nayxp6wh5sp59gsxdm2` (`tipo_recomendacion_id`),
  KEY `FKne7a1ljufhhh9043x5dtwmbow` (`usuario_id`),
  CONSTRAINT `FKi4cen0nayxp6wh5sp59gsxdm2` FOREIGN KEY (`tipo_recomendacion_id`) REFERENCES `tipo_recomendacion` (`id`),
  CONSTRAINT `FKne7a1ljufhhh9043x5dtwmbow` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `presupuesto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_fin` datetime(6) NOT NULL,
  `fecha_inicio` datetime(6) NOT NULL,
  `limite` double NOT NULL,
  `categoria_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3fglw7gm8tjjyxhpeq9s8hu1m` (`categoria_id`),
  KEY `FKl902xsrmvqx3rsyrvu57eyno` (`usuario_id`),
  CONSTRAINT `FK3fglw7gm8tjjyxhpeq9s8hu1m` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`),
  CONSTRAINT `FKl902xsrmvqx3rsyrvu57eyno` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `objetivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad_objetivo` double NOT NULL,
  `fecha_inicio` datetime(6) NOT NULL,
  `fecha_fin` datetime(6) NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_usuario_objetivo` (`usuario_id`),
  CONSTRAINT `FK_usuario_objetivo` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;