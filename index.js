const express = require("express");
const app = express();
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "password";
const cors = require("cors");
const port = 3000;

app.use(cors());
app.use(express.json());

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Holamundo01",
  database: "db_usuarios",
});

conexion.connect((err) => {
  if (err) {
    console.error("Error de conexion a la base de datos", err);
  } else {
    console.log("Conexion exitosa a db_usuarios");
  }
});

//middleware de verificacion
const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ mensaje: "Token Invalido o expirado" });
    }
    req.user = user;

    next();
  });
};






///////////homeee
app.get ('/' , (req, res)=> {
  res.status(201).json({ mensaje: "Bienvenido a Home"});
  console.log("Home Page")
})







//apps
/////////////////////login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "500h" });
    res.json({ mensaje: "Successs", token });
    console.log("Usuario ha ingresado desde login");
  } else {
    res.status(401).json({ mensaje: "Credenciales invalidas" });
    console.log("Credenciales invalidas");
  }
});



///////////////////////administrador de usuarios

app.get("/usuarios", (req, res) => {
  const sql = "select * from tr_usuario";
  conexion.query(sql, (err, resultado) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(resultado);
    }
  });
});

app.post("/usuarios", (req, res) => {
  const { username, password, estado } = req.body;
  console.log(req.body);
  const sql =
    "INSERT INTO tr_usuario (username, password, estado)VALUES (?,?,?)";

  if (!username || !password || !estado) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  conexion.query(sql, [username, password, estado], (err, resultado) => {
    if (err) {
      console.error(err);

      res.status(500).json({ error: "No se pudo agregar el usuario" });
    } else {
      res.status(201).json({ mensaje: "Usuario agregado", codigo: resultado.insertId });
    }
  });
});


//////////actualizar usuarios
app.put('/usuarios', (req, res) => {
  const { codigo, username, password, estado } = req.body;
  console.log('Datos recibidos:', req.body);  // Esto te permitirá ver qué datos estás recibiendo

  // Validación de campos obligatorios
  if (!codigo || !username || !password || !estado) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = 'UPDATE tr_usuario SET username = ?, password = ?, estado = ? WHERE codigo = ?';

  conexion.query(sql, [username, password, estado, codigo], (err, resultado) => {
    if (err) {
      console.error("Error al actualizar el usuario:", err);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    } else if (resultado.affectedRows === 0) {
      console.log("usuario no encontrado")
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    } else {
      console.log("Usuario actualizado en base de datos");
      return res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    }
  });
});



























///////////////////////administrador de productos
//pagina de productos, muestra todos los productos
//verificarToken agregar despues de pruebas
app.get('/productos', (req,res)=>{
  const sql = 'select * from tr_producto';
  conexion.query(sql, (err, resultado) =>{
      if(err){
          res.status(500).json({error:'Error al obtener los datos del producto'});
      }else{
          res.json(resultado);
      }
  });
});


app.put('/productos', (req, res)=>{
  const { producto, descripcion, categoria, precio, cantidad, id_producto } = req.body;

  if (!producto || !descripcion || !categoria || !precio || !cantidad || !id_producto) {
      return res.status(400).json({error:'Todos los campos son obligatorios'});
  }

  const sql = 'UPDATE tr_producto SET producto = ?, descripcion = ?, categoria = ?, precio = ?, cantidad = ? WHERE id_producto = ?';

  conexion.query(sql, [producto, descripcion, categoria, precio, cantidad, id_producto], (err, resultado)=>{
      if (err) {
          console.error("Error al actualizar el producto:", err);
          res.status(500).json({ error: 'Error al actualizar el producto' });
      } else if (resultado.affectedRows === 0) {
          res.status(404).json({ mensaje: 'Producto no encontrado' });
      } else {
        console.log("producto actualizado en base de datos")
          res.status(200).json({ mensaje: 'Producto actualizado', producto });
      }
  });
});


























app.listen(port, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

















//codigo sin utilizar
// //verificarToken, agregar a app.get despues de pruebas
// app.get("/inventario", verificarToken, (req, res) => {
//   const sql = "select * from tr_usuario";
//    return res.send("Acceso a formulario de inventario");
//   conexion.query(sql, (err, resultado) => {
//     if (err) {
//       res.status(500).json({ error: "Error al obtener los datos" });
//     } else {
//       res.json(resultado);
//     }
//   });
// });