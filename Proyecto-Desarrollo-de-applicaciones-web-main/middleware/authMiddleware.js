const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY; 

// Middleware para autenticación JWT, Seguridad en las API's
const authMiddleware=(req, res, next) =>{
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({mensaje:'Token no proporcionado'});
    } 
    
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(403).json({mensaje: 'Token inválido o expirado'});
        }

        req.user = user;

        next();
    });

};

module.exports = authMiddleware;