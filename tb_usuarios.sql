-- --------------------------------------------------------

--
-- Base de datos: `usuarios`
--

-- --------------------------------------------------------

CREATE DATABASE db_usuarios;
USE db_usuarios;

--
-- Estructura de tabla para las tablas
--

CREATE TABLE tr_usuario (
  id_usuario int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  usuario varchar(60) DEFAULT NULL,
  estado varchar(50) DEFAULT NULL,
  password varchar(100) DEFAULT NULL
);

CREATE TABLE tr_producto (  
    id_producto INT AUTO_INCREMENT PRIMARY KEY,  
    producto VARCHAR(100) NOT NULL,  
    descripcion TEXT,  
    categoria VARCHAR(50),  
    precio DECIMAL(10, 2) NOT NULL,  
    cantidad INT NOT NULL
);  

-- INSERT INTO tr_usuario (usuario, password) VALUES ('admin', '1234');
INSERT INTO tr_producto (producto,descripcion,categoria,precio,cantidad) values('Frijoles','Nuevos y rojos','Granos',100,1);
INSERT INTO tr_producto (producto,descripcion,categoria,precio,cantidad) values('Arroz','Precocido','Granos',15,2);
INSERT INTO tr_producto (producto,descripcion,categoria,precio,cantidad) values('Maiz','Blanco','Granos',35,1);

select id_producto, producto, cantidad from tr_producto;