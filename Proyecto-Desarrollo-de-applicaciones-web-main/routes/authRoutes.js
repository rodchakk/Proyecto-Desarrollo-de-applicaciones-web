const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const router = express.Router();
require('dotenv').config();
//definición de clave secreta
const SECRET_KEY = process.env.SECRET_KEY;

//apps
/////////////////////login endpoint
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "select * from tr_usuario where username=? and password=? and state='A'"
  
    pool.query(sql, [username, password], (err, resultado)=>{
    if (username === "admin" && password === "1234") {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "500h" });
      res.json({ mensaje: 'Autenticación exitosa', token });
      console.log("Usuario ha ingresado desde login");
    } else {
      res.status(401).json({ mensaje: "Credenciales invalidas" });
      console.log("Credenciales invalidas");
    }

  });
});

module.exports = router;

