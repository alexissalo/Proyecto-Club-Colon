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
  `factor` VARCHAR(10) NULL DEFAULT NULL,
  `coberturaMedica` VARCHAR(100) NULL DEFAULT NULL,
  `numeroAfiliado` VARCHAR(50) NULL DEFAULT NULL,
  `alergias` TEXT,
  `lesiones` TEXT,
  `patologias` TEXT,
  `tratamientos` TEXT
);

CREATE TABLE `datospersonalesdeportista` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `dni` INT UNIQUE NOT NULL,
  `fechaNacimiento` DATE NOT NULL,
  `domicilio` VARCHAR(255) NOT NULL,
  `localidad` VARCHAR(100) NOT NULL,
  `escolaridad` VARCHAR(100) NULL DEFAULT NULL,
  `gradoEscolar` VARCHAR(100) NULL DEFAULT NULL,
  `posicionJuego` VARCHAR(50) NULL DEFAULT NULL,
  `altura` DECIMAL(5,2) NULL DEFAULT NULL,
  `peso` DECIMAL(5,2) NULL DEFAULT NULL,
  `id_disciplina` INT NULL DEFAULT NULL,
  `categoria` VARCHAR(25),
  `id_tipo_cuota` INT
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

CREATE TABLE `roles` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255)
);

CREATE TABLE `socios` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `fechaNacimiento` DATE NOT NULL,
  `dni` INT UNIQUE NOT NULL,
  `telefono` VARCHAR(255) NOT NULL,
  `domicilio` VARCHAR(255) NOT NULL,
  `fechaInscripcion` DATE NOT NULL,
  `email` VARCHAR(255),
  `nroSocio` INT,
  `id_grupo_familiar` INT,
  `id_disciplina` INT,
  `id_tipo_socio` INT,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);

CREATE TABLE socios_abonos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_pago DATE NOT NULL,
    monto_pagado DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    id_facturas JSON NULL
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

CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255),
  `email` VARCHAR(255),
  `contraseña` VARCHAR(255),
  `id_rol` INT
);

CREATE TABLE deportistas_abonos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_pago DATE NOT NULL,
    monto_pagado DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    id_facturas JSON NULL
);

CREATE TABLE facturas_socios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_socio INT,
    fecha_emision DATE,
    monto DECIMAL(10, 2),
    estado ENUM('pendiente', 'pagado'),
    FOREIGN KEY (id_socio) REFERENCES socios(id)
);

CREATE TABLE cuotas_deportistas(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255),
    valorDeCuota DECIMAL(10,2),
    id_disciplina INT
);

CREATE TABLE facturas_deportistas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_deportista INT,
    fecha_emision DATE,
    monto DECIMAL(10, 2),
    estado ENUM('pendiente', 'pagado'),
    FOREIGN KEY (id_deportista) REFERENCES datospersonalesdeportista(id)
);


CREATE TABLE solicitudes (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    tipo_solicitud ENUM('nuevo_socio', 'socio_existente',"registro_deportista") NOT NULL,
    estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    datos_solicitud JSON NOT NULL,
    observaciones TEXT NULL
);


CREATE TABLE categorias_productos (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    id_categoria INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias_productos(id_categoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE talles_productos (
    id_talle INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(50) NULL
);

CREATE TABLE stock_productos (
    id_stock INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_talle INT,
    cantidad INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_talle) REFERENCES talles_productos(id_talle)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    UNIQUE (id_producto, id_talle)
);

CREATE TABLE imagenes_productos (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    ruta_imagen VARCHAR(255) NOT NULL,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    subtitulo VARCHAR(255) NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_categoria INT NOT NULL,
    tags JSON NOT NULL,
    imagen_principal VARCHAR(255) NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias_noticias(id_categoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE categorias_noticias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);