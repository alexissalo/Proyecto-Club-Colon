create database admincolon;

use admincolon;

CREATE TABLE disciplinas (
  id int auto_increment PRIMARY KEY,
  nombre varchar(255)
);

CREATE TABLE disciplinas_abonos (
  id int auto_increment PRIMARY KEY,
  id_disciplina int,
  valor varchar(255),
  fecha date,
  es_ingreso tinyint(1),
  descripcion varchar(255),
  id_responsable int
);

CREATE TABLE grupos_familiares (
  id int auto_increment PRIMARY KEY,
  nombre varchar(255)
);

CREATE TABLE socios (
  id int auto_increment PRIMARY KEY,
  nombre varchar(255),
  fechaNacimiento date,
  dni int(8),
  telefono varchar(255),
  domicilio varchar(255),
  fechaInscripcion date,
  es_deportista int,
  es_general int,
  id_grupo_familiar int,
  id_disciplina int
);

CREATE TABLE socios_abonos (
  id int auto_increment PRIMARY KEY,
  id_socio int,
  valor varchar(255),
  fecha datetime
);

CREATE TABLE usuarios (
  id int auto_increment PRIMARY KEY,
  nombre varchar(255),
  email varchar(255),
  contraseña varchar(255),
  id_rol int
);

CREATE TABLE roles (
  id int auto_increment PRIMARY KEY,
  nombre varchar(255)
);

CREATE TABLE eventos(
	id int auto_increment primary key,
    nombre varchar(255),
    descripcion varchar(255),
    fechaInicio date,
    fechaFin date,
    id_disciplina int
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



