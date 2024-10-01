create database admincolon;

use admincolon;

CREATE TABLE `alergiasdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deportistaId` INT NULL DEFAULT NULL,
  `alergia` VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE `comunicaciondeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deportistaId` INT NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `instagram` VARCHAR(100) NULL DEFAULT NULL,
  `facebook` VARCHAR(100) NULL DEFAULT NULL,
  `telefonoJugador` VARCHAR(100) NULL DEFAULT NULL,
  `telefonoEmergencia` VARCHAR(100) NULL DEFAULT NULL
);

CREATE TABLE `datosfamiliaresdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deportistaId` INT NULL DEFAULT NULL,
  `nombre` VARCHAR(255) NULL DEFAULT NULL,
  `domicilio` VARCHAR(255) NULL DEFAULT NULL,
  `localidad` VARCHAR(255) NULL DEFAULT NULL,
  `telefono` VARCHAR(100) NULL DEFAULT NULL,
  `telefonoFijo` VARCHAR(100) NULL DEFAULT NULL,
  `facebookTutor` VARCHAR(100) NULL DEFAULT NULL,
  `instagramTutor` VARCHAR(100) NULL DEFAULT NULL,
  `emailResponsable` VARCHAR(100) NULL DEFAULT NULL
);

CREATE TABLE `datosmedicosdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deportistaId` INT NULL DEFAULT NULL,
  `grupoSanguineo` VARCHAR(10) NULL DEFAULT NULL,
  `factor` VARCHAR(5) NULL DEFAULT NULL,
  `coberturaMedica` VARCHAR(100) NULL DEFAULT NULL,
  `numeroAfiliado` VARCHAR(50) NULL DEFAULT NULL
);

CREATE TABLE `datospersonalesdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `fechaNacimiento` DATE NOT NULL,
  `domicilio` VARCHAR(255) NOT NULL,
  `localidad` VARCHAR(100) NOT NULL,
  `escolaridad` VARCHAR(100) NULL DEFAULT NULL,
  `gradoEscolar` VARCHAR(100) NULL DEFAULT NULL,
  `posicionJuego` VARCHAR(50) NULL DEFAULT NULL,
  `altura` DECIMAL(5,2) NULL DEFAULT NULL,
  `peso` DECIMAL(5,2) NULL DEFAULT NULL,
  `id_disciplina` INT NULL DEFAULT NULL
);

CREATE TABLE `disciplinas` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE `disciplinas_abonos` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_disciplina` INT NULL DEFAULT NULL,
  `valor` DECIMAL(10,2) NULL DEFAULT NULL,
  `fecha` DATE NULL DEFAULT NULL,
  `es_ingreso` TINYINT(1) NULL DEFAULT NULL,
  `descripcion` VARCHAR(255) NULL DEFAULT NULL,
  `id_responsable` INT NULL DEFAULT NULL,
  `documentacion` VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE `eventos` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NULL DEFAULT NULL,
  `descripcion` VARCHAR(255) NULL DEFAULT NULL,
  `fechaInicio` DATE NULL DEFAULT NULL,
  `fechaFin` DATE NULL DEFAULT NULL,
  `id_disciplina` INT NULL DEFAULT NULL
);

CREATE TABLE `grupos_familiares` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE `lesionesdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deportistaId` INT NULL DEFAULT NULL,
  `lesion` VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE `patologiasdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deportistaId` INT NULL DEFAULT NULL,
  `patologia` VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE `roles` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE `socios` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NULL DEFAULT NULL,
  `fechaNacimiento` DATE NULL DEFAULT NULL,
  `dni` INT NULL DEFAULT NULL,
  `telefono` VARCHAR(255) NULL DEFAULT NULL,
  `domicilio` VARCHAR(255) NULL DEFAULT NULL,
  `fechaInscripcion` DATE NULL DEFAULT NULL,
  `id_grupo_familiar` INT NULL DEFAULT NULL,
  `id_disciplina` INT NULL DEFAULT NULL,
  `id_tipo_socio` INT NULL DEFAULT NULL
);

CREATE TABLE `socios_abonos` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_socio` INT NULL DEFAULT NULL,
  `valor` VARCHAR(255) NULL DEFAULT NULL,
  `fecha` DATETIME NULL DEFAULT NULL
);

CREATE TABLE `tallesdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deportistaId` INT NULL DEFAULT NULL,
  `talleCalzado` VARCHAR(10) NULL DEFAULT '0.0',
  `talleCamiseta` VARCHAR(10) NULL DEFAULT NULL,
  `tallePantalon` VARCHAR(10) NULL DEFAULT NULL
);

CREATE TABLE `tiposdesocios` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NULL DEFAULT NULL,
  `valorDeCuota` DECIMAL(10,2) NULL DEFAULT NULL
);

CREATE TABLE `tratamientosdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deportistaId` INT NULL DEFAULT NULL,
  `tratamientoDescripcion` VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `contraseña` VARCHAR(255) NULL DEFAULT NULL,
  `id_rol` INT NULL DEFAULT NULL
);


insert into roles(nombre) values
("admin_general"),
("admin_secretaria"),
("admin_futbol"),
("admin_futbol"),
("admin_tenis"),
("admin_patin"),
("admin_voley"),
("admin_basquet"),
("coordinador_futbol"),
("coordinador_tenis"),
("coordinador_patin"),
("coordinador_voley"),
("coordinador_basquet");

insert into disciplinas(nombre) values("futbol"),
("tenis"),("patin"),("voley"),("basquet");

insert into usuarios(nombre,email,contraseña,id_rol) values
("admingeneral","admingeneral31@gmail.com","123",1),
("adminsecretaria","adminsecretaria31@gmail.com","123",2),
("adminfutbol","adminfutbol31@gmail.com","123",3),
("coordinadorfutbol","coordfutbol31@gmail.com","123",9),


INSERT INTO socios (nombre, fechaNacimiento, dni, telefono, domicilio, fechaInscripcion, es_deportista, es_general, id_grupo_familiar, id_disciplina) VALUES
('Juan Pérez', '1990-05-15', 12345678, '1234-5678', 'Calle Falsa 123', '2024-08-01', 1, 0, 1, 3),
('María García', '1985-10-20', 87654321, '9876-5432', 'Avenida Siempre Viva 456', '2024-08-05', 0, 1, 2, NULL),
('Pedro López', '2000-02-25', 56781234, '1234-8765', 'Boulevard Central 789', '2024-08-10', 1, 0, 1, 2),
('Ana Fernández', '1995-07-12', 43218765, '4321-5678', 'Camino Real 234', '2024-08-12', 0, 1, 3, NULL),
('Lucas Martínez', '2003-11-30', 34561278, '5678-1234', 'Ruta 66, Km 23', '2024-08-13', 1, 0, 2, 1),
('Sofía Rodríguez', '1992-03-10', 90123456, '9012-3456', 'Calle de la Luna 456', '2024-08-15', 0, 1, 4, NULL),
('Mateo Gómez', '2001-09-05', 78901234, '7890-1234', 'Avenida del Sol 123', '2024-08-18', 1, 0, 3, 4),
('Isabella Díaz', '1988-01-25', 45678901, '4567-8901', 'Boulevard de la Paz 234', '2024-08-20', 0, 1, 5, NULL),
('Julian Castro', '1998-06-15', 23456789, '2345-6789', 'Camino de la Vida 345', '2024-08-22', 1, 0, 4, 2),
('Valentina Morales', '2002-04-10', 67890123, '6789-0123', 'Ruta 101, Km 12', '2024-08-25', 0, 1, 6, NULL),
('Gabriel Hernández', '1991-11-20', 34567890, '3456-7890', 'Calle de la Esperanza 567', '2024-08-28', 1, 0, 5, 3),
('Daniela López', '1989-08-05', 90123456, '9012-3456', 'Avenida de la Libertad 678', '2024-09-01', 0, 1, 7, NULL),
('Sebastián García', '2004-02-15', 78901234, '7890-1234', 'Boulevard de la Justicia 789', '2024-09-05', 1, 0, 6, 1),
('Catalina Martínez', '1996-10-25', 45678901, '4567-8901', 'Camino del Progreso 890', '2024-09-10', 0, 1, 8, NULL),
('Alejandro Díaz', '2000-07-10', 23456789, '2345-6789', 'Ruta 202, Km 15', '2024-09-12', 1, 0, 7, 4);

insert into socios_abonos(id_socio,fecha,valor) values (1,now(),2000);

INSERT INTO disciplinas_abonos (id_disciplina, valor, fecha, es_ingreso, descripcion, id_responsable) VALUES
(1, '100.00', '2022-01-01', 1, 'Abono inicial', 1),
(2, '50.00', '2022-01-15', 1, 'Abono parcial', 2),
(3, '200.00', '2022-02-01', 1, 'Abono completo', 3),
(4, '25.00', '2022-03-01', 0, 'Descuento', 4),
(5, '150.00', '2022-04-01', 1, 'Abono adicional', 1),
(1, '75.00', '2022-05-01', 1, 'Abono mensual', 2),
(2, '300.00', '2022-06-01', 1, 'Abono anual', 3),
(3, '10.00', '2022-07-01', 0, 'Descuento especial', 4);



