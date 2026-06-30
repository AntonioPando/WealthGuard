INSERT INTO `usuario` (
`email`, `fecha_registro`, `fecha_ultimo_cambio_password`, 
  `foto_perfil`, `nick_usuario`, `nombre`, `password`, 
  `pregunta_seguridad`, `primer_apellido`, `respuesta_seguridad`, `segundo_apellido`
) VALUES 
('juan@email.com', NOW(6), NULL, NULL, 'juan99', 'Juan', '$2a$10$Aia8kJzgB9.3ajywpLI4jOAxCvw4AQ6maWr5nYeUgI4WS2LDawixG', '¿Mascota?', 'Pérez', 'Toby', 'García'),
('irenegarcia@gmail.com', NOW(6), NULL, NULL, 'ireneG', 'Irene', '$2a$10$Aia8kJzgB9.3ajywpLI4jOAxCvw4AQ6maWr5nYeUgI4WS2LDawixG', '¿Cuál es tu película favorita?', 'García', 'Titanic', 'Martinez'),
('maria.lopez@example.com', NOW(6), NULL, NULL, 'mariaL', 'María', '$2a$10$Aia8kJzgB9.3ajywpLI4jOAxCvw4AQ6maWr5nYeUgI4WS2LDawixG', '¿Ciudad de nacimiento?', 'López', 'Madrid', 'Sánchez'),
('pedro.ramos@example.com', NOW(6), NULL, NULL, 'pedroR', 'Pedro', '$2a$10$Aia8kJzgB9.3ajywpLI4jOAxCvw4AQ6maWr5nYeUgI4WS2LDawixG', '¿Color favorito?', 'Ramos', 'Azul', 'Gómez'),
('ana.fernandez@example.com', NOW(6), NULL, NULL, 'anaF', 'Ana', '$2a$10$Aia8kJzgB9.3ajywpLI4jOAxCvw4AQ6maWr5nYeUgI4WS2LDawixG', '¿Nombre de tu primera escuela?', 'Fernández', 'San José', 'Lopez');

INSERT INTO `categoria` (`nombre`, `icono`) VALUES 
('Vivienda', 'home'),
('Ocio', 'sports_esports'),
('Salario', 'payments'),
('Alimentación', 'restaurant'),
('Transporte', 'directions_car'),
('Salud', 'medical_services'),
('Educación', 'school'),
('Suscripciones', 'subscriptions'),
('Viajes', 'flight'),
('Regalos', 'redeem'),
('Otros', 'category');

INSERT INTO `tipo_recomendacion` (`mensaje`, `nombre`) VALUES 
('Has superado el 80% de tu presupuesto en Ocio. ¡Controla tus gastos!', 'Alerta de Gasto'),
('¡Estás a punto de conseguir tu meta de ahorro! Sigue así.', 'Meta Cercana'),
('Tienes un buen balance positivo este mes. Considera invertir.', 'Consejo Inversión');

-- Ingresos previos para asegurar saldos no negativos (5 ingresos por usuario, mayo 2026)
INSERT INTO `transaccion` (`cantidad`, `descripcion`, `fecha`, `tipo_transaccion`, `categoria_id`, `usuario_id`) VALUES
-- Usuario 1 (Juan)
(1000.00, 'Nómina', '2026-05-01 09:00:00', 1, 3, 1),
(300.00, 'Bizum recibido', '2026-05-05 12:00:00', 1, 3, 1),
(200.00, 'Ingreso extra', '2026-05-10 15:00:00', 1, 3, 1),
(300.00, 'Devolución', '2026-05-15 10:00:00', 1, 3, 1),
(200.00, 'Bizum', '2026-05-20 18:00:00', 1, 3, 1),
(1000.00, 'Nómina', '2026-06-01 09:00:00', 1, 3, 1),
(1000.00, 'Nómina', '2026-07-01 09:00:00', 1, 3, 1),
-- Usuario 2 (Irene)
(1000.00, 'Nómina', '2026-05-02 09:00:00', 1, 3, 2),
(300.00, 'Bizum recibido', '2026-05-06 12:30:00', 1, 3, 2),
(200.00, 'Ingreso extra', '2026-05-11 14:00:00', 1, 3, 2),
(300.00, 'Devolución', '2026-05-16 11:00:00', 1, 3, 2),
(200.00, 'Bizum', '2026-05-21 17:00:00', 1, 3, 2),
(1000.00, 'Nómina', '2026-06-02 09:00:00', 1, 3, 2),
(1000.00, 'Nómina', '2026-07-02 09:00:00', 1, 3, 2),
-- Usuario 3 (María)
(1000.00, 'Nómina', '2026-05-03 09:30:00', 1, 3, 3),
(300.00, 'Bizum recibido', '2026-05-07 12:10:00', 1, 3, 3),
(200.00, 'Ingreso extra', '2026-05-12 16:00:00', 1, 3, 3),
(300.00, 'Devolución', '2026-05-17 10:30:00', 1, 3, 3),
(200.00, 'Bizum', '2026-05-22 18:30:00', 1, 3, 3),
-- Usuario 4 (Pedro)
(1000.00, 'Nómina', '2026-05-04 08:50:00', 1, 3, 4),
(300.00, 'Bizum recibido', '2026-05-08 13:00:00', 1, 3, 4),
(200.00, 'Ingreso extra', '2026-05-13 15:30:00', 1, 3, 4),
(300.00, 'Devolución', '2026-05-18 09:45:00', 1, 3, 4),
(200.00, 'Bizum', '2026-05-23 19:00:00', 1, 3, 4),
(1000.00, 'Nómina', '2026-06-02 09:00:00', 1, 3, 4),
(1000.00, 'Nómina', '2026-07-02 09:00:00', 1, 3, 5),
-- Usuario 5 (Ana)
(1000.00, 'Nómina', '2026-05-05 09:10:00', 1, 3, 5),
(300.00, 'Bizum recibido', '2026-05-09 12:40:00', 1, 3, 5),
(200.00, 'Ingreso extra', '2026-05-14 14:20:00', 1, 3, 5),
(300.00, 'Devolución', '2026-05-19 11:15:00', 1, 3, 5),
(200.00, 'Bizum', '2026-05-24 18:20:00', 1, 3, 5),
(1000.00, 'Nómina', '2026-06-02 09:00:00', 1, 3, 5),
(1000.00, 'Nómina', '2026-07-02 09:00:00', 1, 3, 5);


-- Usuario 1 (Juan) - 20 gastos distribuidos en May/Jun/Jul 2026
INSERT INTO `transaccion` (`cantidad`, `descripcion`, `fecha`, `tipo_transaccion`, `categoria_id`, `usuario_id`) VALUES
(45.20, 'Compra supermercado', '2026-05-02 09:15:00', 0, 4, 1),
(600.00, 'PlayStation 5', '2026-05-07 09:15:00', 0, 2, 1),
(12.50, 'Café y snacks', '2026-05-05 11:30:00', 0, 4, 1),
(8.00, 'Transporte público', '2026-05-08 08:05:00', 0, 5, 1),
(25.00, 'Cena restaurante', '2026-05-11 20:10:00', 0, 4, 1),
(60.00, 'Gasolina', '2026-05-14 16:40:00', 0, 5, 1),
(9.99, 'Suscripción streaming', '2026-05-18 07:00:00', 0, 8, 1),
(15.00, 'Entrada cine', '2026-05-22 21:00:00', 0, 2, 1),
(500.00, 'iPad', '2026-06-22 21:00:00', 0, 2, 1),
(50.00, 'Compra online', '2026-06-03 14:20:00', 0, 11, 1),
(20.00, 'Taxi', '2026-06-06 22:10:00', 0, 5, 1),
(30.00, 'Farmacia', '2026-06-09 10:00:00', 0, 6, 1),
(75.00, 'Mantenimiento vivienda', '2026-06-12 09:00:00', 0, 1, 1),
(18.00, 'Almuerzo trabajo', '2026-06-16 13:15:00', 0, 4, 1),
(18.00, 'Almuerzo trabajo', '2026-06-16 13:15:00', 0, 4, 1),
(7.50, 'Café', '2026-06-20 09:30:00', 0, 4, 1),
(120.00, 'Compra electrónica', '2026-06-25 18:45:00', 0, 11, 1),
(18.00, 'Almuerzo trabajo', '2026-06-26 13:15:00', 0, 4, 1),
(35.00, 'Cena amigos', '2026-07-01 20:00:00', 0, 4, 1),
(14.00, 'App móvil (suscripción)', '2026-07-04 07:30:00', 0, 8, 1),
(22.00, 'Transporte - autobús', '2026-07-08 08:20:00', 0, 5, 1),
(55.00, 'Ropa', '2026-07-12 15:00:00', 0, 11, 1),
(28.00, 'Regalo', '2026-07-16 12:00:00', 0, 10, 1),
(11.20, 'Snack', '2026-07-20 16:30:00', 0, 4, 1),

-- Usuario 2 (Irene) - 20 gastos
(60.00, 'Compra supermercado', '2026-06-03 10:00:00', 0, 4, 2),
(14.00, 'Desayuno', '2026-06-06 08:30:00', 0, 4, 2),
(9.50, 'Transporte público', '2026-06-09 08:15:00', 0, 5, 2),
(28.00, 'Cena', '2026-06-12 20:30:00', 0, 4, 2),
(45.00, 'Gasolina', '2026-06-15 17:00:00', 0, 5, 2),
(6.99, 'Suscripción mensual', '2026-06-19 07:00:00', 0, 8, 2),
(20.00, 'Cine', '2026-06-23 21:30:00', 0, 2, 2),
(34.00, 'Compra ropa', '2026-05-04 16:00:00', 0, 11, 2),
(18.50, 'Taxi', '2026-05-07 23:10:00', 0, 5, 2),
(25.00, 'Farmacia', '2026-05-10 11:00:00', 0, 6, 2),
(95.00, 'Reparación hogar', '2026-05-13 10:00:00', 0, 1, 2),
(21.00, 'Almuerzo', '2026-05-17 13:00:00', 0, 4, 2),
(8.00, 'Café', '2026-05-21 09:00:00', 0, 4, 2),
(49.99, 'Electrónica pequeña', '2026-05-26 19:00:00', 0, 11, 2),
(32.00, 'Cena', '2026-06-02 20:15:00', 0, 4, 2),
(9.99, 'Suscripción', '2026-06-05 07:00:00', 0, 8, 2),
(16.00, 'Bus', '2026-06-09 08:10:00', 0, 5, 2),
(70.00, 'Ropa', '2026-06-13 15:20:00', 0, 11, 2),
(25.00, 'Regalo', '2026-06-17 11:30:00', 0, 10, 2),
(6.50, 'Snack', '2026-06-21 16:00:00', 0, 4, 2),

-- Usuario 3 (María) - 20 gastos
(52.00, 'Supermercado', '2026-06-04 10:30:00', 0, 4, 3),
(11.00, 'Desayuno', '2026-06-07 08:45:00', 0, 4, 3),
(7.00, 'Metro', '2026-06-10 08:00:00', 0, 5, 3),
(40.00, 'Restaurante', '2026-06-13 21:00:00', 0, 4, 3),
(55.00, 'Gasolina', '2026-06-16 17:30:00', 0, 5, 3),
(12.99, 'App suscripción', '2026-06-20 07:15:00', 0, 8, 3),
(18.00, 'Cine', '2026-06-24 20:00:00', 0, 2, 3),
(28.00, 'Compra online', '2026-05-05 15:00:00', 0, 11, 3),
(22.00, 'Taxi', '2026-05-08 22:30:00', 0, 5, 3),
(15.00, 'Farmacia', '2026-05-11 12:00:00', 0, 6, 3),
(85.00, 'Reparación', '2026-05-14 09:30:00', 0, 1, 3),
(19.00, 'Comida trabajo', '2026-05-18 13:20:00', 0, 4, 3),
(5.50, 'Café', '2026-05-22 09:10:00', 0, 4, 3),
(140.00, 'Electrónica', '2026-05-27 18:50:00', 0, 11, 3),
(38.00, 'Cena', '2026-06-03 20:40:00', 0, 4, 3),
(8.99, 'Suscripción', '2026-06-06 07:05:00', 0, 8, 3),
(13.00, 'Bus', '2026-06-10 08:30:00', 0, 5, 3),
(60.00, 'Ropa', '2026-06-14 16:00:00', 0, 11, 3),
(29.00, 'Regalo', '2026-06-18 12:40:00', 0, 10, 3),
(10.00, 'Snack', '2026-06-22 17:00:00', 0, 4, 3),

-- Usuario 4 (Pedro) - 20 gastos
(70.00, 'Compra supermercado', '2026-06-01 11:00:00', 0, 4, 4),
(13.50, 'Desayuno', '2026-06-05 08:20:00', 0, 4, 4),
(6.00, 'Transporte público', '2026-06-09 07:50:00', 0, 5, 4),
(45.00, 'Cena', '2026-06-13 21:30:00', 0, 4, 4),
(48.00, 'Gasolina', '2026-06-17 18:10:00', 0, 5, 4),
(11.99, 'Suscripción', '2026-06-21 07:30:00', 0, 8, 4),
(16.00, 'Cine', '2026-06-25 20:10:00', 0, 2, 4),
(27.00, 'Compra ropa', '2026-05-02 14:30:00', 0, 11, 4),
(19.00, 'Taxi', '2026-05-07 22:00:00', 0, 5, 4),
(23.00, 'Farmacia', '2026-05-11 11:40:00', 0, 6, 4),
(110.00, 'Reparación hogar', '2026-05-15 09:10:00', 0, 1, 4),
(17.00, 'Almuerzo', '2026-05-19 13:40:00', 0, 4, 4),
(6.00, 'Café', '2026-05-23 09:20:00', 0, 4, 4),
(55.00, 'Electrónica', '2026-05-28 19:30:00', 0, 11, 4),
(33.00, 'Cena', '2026-06-01 20:50:00', 0, 4, 4),
(10.99, 'Suscripción', '2026-06-05 07:10:00', 0, 8, 4),
(15.00, 'Bus', '2026-06-09 08:25:00', 0, 5, 4),
(80.00, 'Ropa', '2026-06-13 16:20:00', 0, 11, 4),
(20.00, 'Regalo', '2026-06-17 12:10:00', 0, 10, 4),
(9.50, 'Snack', '2026-06-21 16:45:00', 0, 4, 4),

-- Usuario 5 (Ana) - 20 gastos
(48.00, 'Supermercado', '2026-06-02 12:00:00', 0, 4, 5),
(10.00, 'Desayuno', '2026-06-06 08:00:00', 0, 4, 5),
(5.80, 'Metro', '2026-06-10 08:10:00', 0, 5, 5),
(29.00, 'Cena', '2026-06-13 20:20:00', 0, 4, 5),
(52.00, 'Gasolina', '2026-06-16 17:45:00', 0, 5, 5),
(7.99, 'App suscripción', '2026-06-20 07:05:00', 0, 8, 5),
(13.00, 'Cine', '2026-06-24 21:10:00', 0, 2, 5),
(31.00, 'Compra online', '2026-05-03 15:45:00', 0, 11, 5),
(18.00, 'Taxi', '2026-05-06 22:45:00', 0, 5, 5),
(12.00, 'Farmacia', '2026-05-10 10:30:00', 0, 6, 5),
(95.00, 'Reparación hogar', '2026-05-14 09:20:00', 0, 1, 5),
(20.00, 'Almuerzo', '2026-05-18 13:50:00', 0, 4, 5),
(6.50, 'Café', '2026-05-22 09:05:00', 0, 4, 5),
(59.99, 'Pequeño electrodoméstico', '2026-05-27 18:10:00', 0, 11, 5),
(36.00, 'Cena', '2026-06-02 20:05:00', 0, 4, 5),
(8.49, 'Suscripción', '2026-06-05 07:20:00', 0, 8, 5),
(14.00, 'Bus', '2026-06-10 08:05:00', 0, 5, 5),
(68.00, 'Ropa', '2026-06-14 15:50:00', 0, 11, 5),
(27.00, 'Regalo', '2026-06-18 12:25:00', 0, 10, 5),
(9.00, 'Snack', '2026-06-22 17:30:00', 0, 4, 5);

INSERT INTO `recomendacion` (`fecha_recomendacion`, `tipo_recomendacion_id`, `usuario_id`) VALUES 
(NOW(6), 1, 1),
(NOW(6), 2, 1),
(NOW(6), 3, 1);

INSERT INTO `presupuesto` (`fecha_inicio`, `fecha_fin`, `limite`, `categoria_id`, `usuario_id`) VALUES 
('2026-06-01 00:00:00', '2026-06-30 23:59:59', 100, 1, 1),
('2026-06-01 00:00:00', '2026-06-30 23:59:59', 200, 4, 1),
('2026-06-01 00:00:00', '2026-06-30 23:59:59', 400, 2, 1);

-- Objetivos por usuario para los últimos 3 meses (mayo, junio, julio 2026)
INSERT INTO `objetivo` (`cantidad_objetivo`, `fecha_inicio`, `fecha_fin`, `usuario_id`) VALUES
-- Usuario 1 (Juan)
(2000.00, '2026-05-01 00:00:00', '2026-05-31 23:59:59', 1),
(1500.00, '2026-06-01 00:00:00', '2026-06-30 23:59:59', 1),
(1800.00, '2026-07-01 00:00:00', '2026-07-31 23:59:59', 1),
-- Usuario 2 (Irene)
(1200.00, '2026-05-01 00:00:00', '2026-05-31 23:59:59', 2),
(1300.00, '2026-06-01 00:00:00', '2026-06-30 23:59:59', 2),
(1400.00, '2026-07-01 00:00:00', '2026-07-31 23:59:59', 2),
-- Usuario 3 (María)
(1000.00, '2026-05-01 00:00:00', '2026-05-31 23:59:59', 3),
(1100.00, '2026-06-01 00:00:00', '2026-06-30 23:59:59', 3),
(1200.00, '2026-07-01 00:00:00', '2026-07-31 23:59:59', 3),
-- Usuario 4 (Pedro)
(900.00, '2026-05-01 00:00:00', '2026-05-31 23:59:59', 4),
(1000.00, '2026-06-01 00:00:00', '2026-06-30 23:59:59', 4),
(1100.00, '2026-07-01 00:00:00', '2026-07-31 23:59:59', 4),
-- Usuario 5 (Ana)
(1600.00, '2026-05-01 00:00:00', '2026-05-31 23:59:59', 5),
(1700.00, '2026-06-01 00:00:00', '2026-06-30 23:59:59', 5),
(1800.00, '2026-07-01 00:00:00', '2026-07-31 23:59:59', 5);