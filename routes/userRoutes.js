const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

///////////////////////administrador de usuarios

router.get("/usuarios", authMiddleware, (req, res) => {
    const sql = "select * from tr_usuario";
    pool.query(sql, (err, resultado) => {
      if (err) {
        res.status(500).json({ error: "Error al obtener los datos" });
      } else {
        res.json(resultado);
      }
    });
  });
  

  /////////////////agregar usuarios
  router.post("/usuarios", async (req, res) => {
    const { username, plainPassword, estado } = req.body;
      
    const sql =
      "INSERT INTO tr_usuario (username, password, estado)VALUES (?,?,'A')";
  
    if (!username || !plainPassword ) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
  
    const saltRound = 10;
    const password = await bcrypt.hash(plainPassword, saltRound);

    pool.query(sql, [username,password], (err, resultado) => {
      if (err) {
        console.error(err);
  
        res.status(500).json({ error: "No se pudo agregar el usuario" });
      } else {
        res.status(201).json({ mensaje: "Usuario agregado", codigo: resultado.insertId });
      }
    });
  });
  
  
  ///////////////////actualizar usuarios
  router.put('/usuarios', (req, res) => {
    const { codigo, username, password, estado } = req.body;
    console.log('Datos recibidos:', req.body);  
  
    if (!codigo || !username || !password || !estado) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    const sql = 'UPDATE tr_usuario SET username = ?, password = ?, estado = ? WHERE codigo = ?';
  
    pool.query(sql, [username, password, estado, codigo], (err, resultado) => {
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

  router.delete('/usuarios/:id', authMiddleware, (req,res)=>{

    //conexión a base de datos y su logica de negocio
    res.status(200).json({mensaje:'Registro eliminado'});
});
  
  module.exports = router;