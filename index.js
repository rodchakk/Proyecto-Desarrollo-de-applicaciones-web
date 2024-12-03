const express = require('express');
const jwt = require('jsonwebtoken');
const SECRET_KEY = ('password');
const port = 3000;


const app = express ();


app.use (express.json ());






//middleware
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({message: 'token no proporcionado'});
    }
    

    const token = authHeader.split (' ' [1]);
    
    jwt.verify(token, SECRET_KEY, (err, user)=>{
        if (err) {
            return res.status(403).json ({mensaje: 'Token Invalido o expirado'})
        }
        req.user = user;

        next();

    } );
    
    
    }
    





app.post("/login", (req, res) => {
    const {username , password} = req.body;

    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({username}, SECRET_KEY, {expiresIn: '2h'});
        res.json({mensaje: 'Successs', token});

    }
    else {
        res.status(401).jason({mensaje: 'Credenciales invalidas'});
    }



  res.send("usuario");

});


  

app.get ("/home", (req, res) => {
    res.send("Acceso Accedido")
})

















app.listen(port, () => {
    console.log("Servidor corriendo en http://localhost:3000");
  });
  