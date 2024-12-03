const express = require('express');
const jwt = require('jsonwebtoken');


const app = express ();




app.post("/login", (req, res) => {
  res.send("usuario");

});


  







//middleware
const verificarToken = (req, res, next) => {
const authHeader = req.headers['authorization'];

if (!authHeader) {
    return res.status(401).json({message: 'token no proporcionado'});
}


next();

}












app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
  });
  