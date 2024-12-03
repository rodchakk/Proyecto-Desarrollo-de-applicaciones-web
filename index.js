const express = require('express');
const jwt = require('jsonwebtoken');
const port = 3000;


const app = express ();


app.use (express.json ());






//middleware
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({message: 'token no proporcionado'});
    }
    
    
    next();
    
    }
    







app.post("/login", verificarToken, (req, res) => {
  res.send("usuario");

});


  


















app.listen(port, () => {
    console.log("Servidor corriendo en http://localhost:3000");
  });
  