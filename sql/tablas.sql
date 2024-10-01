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
  `nombre` VARCHAR(255)
);

CREATE TABLE `disciplinas_abonos` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_disciplina` INT,
  `valor` DECIMAL(10,2),
  `fecha` DATE,
  `es_ingreso` TINYINT(1),
  `descripcion` VARCHAR(255),
  `id_responsable` INT,
  `documentacion` VARCHAR(255)
);

CREATE TABLE `eventos` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255),
  `descripcion` VARCHAR(255),
  `fechaInicio` DATE,
  `fechaFin` DATE,
  `id_disciplina` INT
);

CREATE TABLE `grupos_familiares` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255)
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
  `nombre` VARCHAR(255)
);

CREATE TABLE `socios` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255),
  `fechaNacimiento` DATE,
  `dni` INT,
  `telefono` VARCHAR(255),
  `domicilio` VARCHAR(255),
  `fechaInscripcion` DATE,
  `id_grupo_familiar` INT,
  `id_disciplina` INT,
  `id_tipo_socio` INT
);

CREATE TABLE `socios_abonos` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_socio` INT,
  `valor` VARCHAR(255),
  `fecha` DATETIME
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
  `nombre` VARCHAR(255),
  `valorDeCuota` DECIMAL(10,2)
);

CREATE TABLE `tratamientosdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deportistaId` INT NULL DEFAULT NULL,
  `tratamientoDescripcion` VARCHAR(255) NULL DEFAULT NULL
);

CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255),
  `email` VARCHAR(255),
  `contraseña` VARCHAR(255),
  `id_rol` INT
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


INSERT INTO `socios` (`nombre`, `fechaNacimiento`, `dni`, `telefono`, `domicilio`, `fechaInscripcion`, `id_grupo_familiar`, `id_disciplina`, `id_tipo_socio`)
VALUES 
('Juan Pérez', '1990-01-15', 12345678, '111-1111', 'Calle Falsa 123', '2020-01-01', 1, 1, 1),
('María García', '1985-05-25', 23456789, '222-2222', 'Avenida Siempre Viva 456', '2019-03-10', 2, 2, 2),
('Carlos López', '1992-07-30', 34567890, '333-3333', 'Calle Luna 789', '2021-06-15', 3, 3, 1),
('Lucía González', '1995-09-10', 45678901, '444-4444', 'Avenida Sol 101', '2020-12-20', 4, 4, 2),
('Pedro Ramírez', '1998-11-22', 56789012, '555-5555', 'Calle Estrella 202', '2018-11-30', 5, 5, 1),
('Ana Fernández', '1988-02-18', 67890123, '666-6666', 'Calle Verde 303', '2021-02-05', 1, 1, 2),
('Martín Sosa', '1993-04-23', 78901234, '777-7777', 'Avenida Azul 404', '2019-07-12', 2, 2, 1),
('Laura Díaz', '1987-08-17', 89012345, '888-8888', 'Calle Roja 505', '2020-08-30', 3, 3, 2),
('Javier Castillo', '1991-10-04', 90123456, '999-9999', 'Calle Amarilla 606', '2018-10-22', 4, 4, 1),
('Carla Herrera', '1996-03-09', 91234567, '101-1010', 'Avenida Blanca 707', '2021-04-19', 5, 5, 2),
('Santiago Peralta', '1990-06-12', 92345678, '202-2020', 'Calle Gris 808', '2019-05-03', 1, 1, 1),
('Paula Giménez', '1984-11-03', 93456789, '303-3030', 'Avenida Naranja 909', '2020-07-07', 2, 2, 2),
('Rodrigo Navarro', '1997-09-16', 94567890, '404-4040', 'Calle Celeste 1010', '2018-09-11', 3, 3, 1),
('Valentina Vega', '1989-12-28', 95678901, '505-5050', 'Avenida Negra 111', '2021-11-25', 4, 4, 2),
('Emiliano Luna', '1994-01-07', 96789012, '606-6060', 'Calle Violeta 1212', '2019-12-13', 5, 5, 1);

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



