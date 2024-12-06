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

//apps

app.post("/login",   (req, res) => {
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

//verificarToken, agregar a app.get despues de pruebas
app.get("/inventario", verificarToken, (req, res) => {
  const sql = "select * from tr_usuario";
   return res.send("Acceso a formulario de inventario");
  conexion.query(sql, (err, resultado) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      res.json(resultado);
    }
  });
});

//administrador de usuarios

app.get("/usuarios", (req, res) => {
  const { codigo } = req.query; 

  let sql;
  const params = [];

  if (codigo) {

    sql = "SELECT * FROM tr_usuario WHERE codigo = ?";
    params.push(codigo);
  } else {

    sql = "SELECT * FROM tr_usuario";
  }

  conexion.query(sql, params, (err, resultado) => {
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
      res
        .status(201)
        .json({ mensaje: "Usuario agregado", codigo: resultado.insertId });
    }
  });
});

app.listen(port, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
