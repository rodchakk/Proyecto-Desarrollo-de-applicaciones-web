const express = require("express");
const app = express();
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "password";
const cors = require("cors");
const port = 3000;

const productos = [{id:1,producto:'Frijoles',descripcion:'Nuevos y rojos',categoria:'granos',precio:'100',cantidad:'1'},{id:2,producto:'Arroz',descripcion:'Precocido',categoria:'granos',precio:'L15',cantidad:'2'}];

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Puchito201524",
  database: "db_usuarios",
});

conexion.connect((err) => {
  if (err) {
    console.error("Error de conexion a la base de datos", err);
  } else {
    console.log("Conexion exitosa");
  }
});

//middleware
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

app.use(cors());
app.use(express.json());

//apps
// Endpoint de login  
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "500h" });
    res.json({ mensaje: "Successs", token });
    console.log("Usuario ha ingresado");
  } else {
    res.status(401).json({ mensaje: "Credenciales invalidas" });
    console.log("Credenciales invalidas");
  }
});

//Mensaje de Bienvenida 
app.get('/', (req, res) => {
  res.send('¡Bienvenido al Sistema de Gestión de Usuarios e Inventario!');
});

//verificarToken, agregar a app.get despues de pruebas
app.get("/inventario", verificarToken, (req, res) => {
  const sql = "select * from tr_usuario";
  res.send("Acceso a formulario de inventario");
  conexion.query(sql, (err, resultado) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(resultado);
    }
  });
});

//Administrador de usuarios
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

//Agregar nuevos usuarios
app.get('/usuarios-nextid', (req,res)=>{
  const sql = "select * from tr_usuario";
  let lastUser = usuarios[usuarios.length-1]
  res.json(lastUser.id + 1);
});

app.post("/usuarios", (req, res) => {
  const { username, password, estado } = req.body;
  console.log(req.body);
  const sql = 'INSERT INTO tr_usuario (username, password, estado)VALUES (?,?,?)';

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

app.put('/usuarios/:id', (req,res)=>{
  const { id } = req.params;  
  const { username, password, estado } = req.body;  

  const sql = 'UPDATE tr_usuario SET username=?, password=?, estado=? WHERE id=?';  

  if (!username || !password || !estado) {  
    return res.status(400).json({ error: "Todos los campos son obligatorios" });  
  }  

  conexion.query(sql, [username, password, estado, id], (err, resultado) => {  
  if(exists){
      res.status(200).json({mensaje: 'Registro actualizado', producto});
  }else{
      res.status(400).json({mensaje: 'Registro no encontrado'});
  }
});
});

//Administrar productos
// Filtro por ID
app.get('/productos/:id',(req,res) =>{
  const id = parseInt(req.params.id);
  
  let producto = productos.find(us => us.id === id);

  if(producto){
      res.json({mensaje:'Ok',producto});
  }else{
      res.status(400).json({mensaje:'producto no encontrado'});
  }
});

//Devolver todos los productos en la base
app.get('/productos', verificarToken, (req,res)=>{
  const sql = 'select producto, descripcion, categoria, precio, cantidad, from tr_producto';
  conexion.query(sql, (err, resultado) =>{
      if(err){
          res.status(500).json({error:'Error al obtener los datos del producto'});
      }else{
          res.json(resultado);
      }
  });
});

app.post('/productos', (req, res)=>{
  const producto = req.body;
  const sql ='insert into tr_producto (producto,descripcion,categoria,precio,cantidad) values(?,?,?)';

  if(!producto.producto || !producto.descripcion || !producto.categoria || !producto.precio || !producto.cantidad){
      return res.status(400).json({error:'Todos los campos son obligatorios'});
  }

  conexion.query(sql, [producto.producto,producto.descripcion,producto.categoria,producto.precio,producto.cantidad],(err, resultado)=>{
      if(err){
          res.status(500).json({error:'Error al agregar el producto'});
      }else{
          res.status(201).json({mesaje:'Producto agregado',codigo: resultado.insertId});
      }
  });
});

app.put('/productos', (req, res)=>{
  const producto = req.body;
  const sql ='update tr_producto set producto=?,descripcion=?,categoria=?,precio=?,cantidad=? where id_producto = ?';

  if(!producto.producto || !producto.descripcion || !producto.categoria || !producto.precio || !producto.cantidad){
      return res.status(400).json({error:'Todos los campos son obligatorios'});
  }

  conexion.query(sql, [producto.producto,producto.descripcion,producto.categoria,producto.precio,producto.cantidad],(err, resultado)=>{
      if(err){
          res.status(500).json({error:'Error al actualizar el producto'});
      }else if(resultado.affectedRows === 0){
          res.status(404).json({mensaje:'Producto no encontrado'});
      }else{
          res.status(200).json({mesaje:'Producto actualizado',producto});
      }
  });
});

app.delete('/productos/:id_producto', (req, res)=>{
  const {id_producto} = req.params;
  const sql ='delete from td_producto where id_producto=?';

  if(!id_producto){
      return res.status(400).json({error:'El parametro id_producto es requerido'});
  }

  conexion.query(sql, [id_producto],(err, resultado)=>{
      if(err){
          res.status(500).json({error:'Error al eliminar el producto'});
      }else{
          res.status(200).json({mesaje:'Producto eliminado'});
      }
  });
});

app.listen(port, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
