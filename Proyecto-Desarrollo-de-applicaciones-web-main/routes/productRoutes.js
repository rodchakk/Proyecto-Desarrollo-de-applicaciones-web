const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

///////////////////////administrador de productos
//pagina de productos, muestra todos los productos
//verificarToken agregar despues de pruebas
router.get('/productos', authMiddleware, (req,res)=>{
    const sql = 'select * from tr_producto';
    pool.query(sql, (err, resultado) =>{
        if(err){
            res.status(500).json({error:'Error al obtener los datos del producto'});
        }else{
            res.json(resultado);
        }
    });
  });
   
  
  ////////////////agregar nuevo producto/////////////////////////////////
  router.put('/productos', authMiddleware, (req, res)=>{
    const { producto, descripcion, categoria, precio, cantidad, id_producto } = req.body;
  
    if (!producto || !descripcion || !categoria || !precio || !cantidad || !id_producto) {
        return res.status(400).json({error:'Todos los campos son obligatorios'});
    }
  
    const sql = 'UPDATE tr_producto SET producto = ?, descripcion = ?, categoria = ?, precio = ?, cantidad = ? WHERE id_producto = ?';
  
    pool.query(sql, [producto, descripcion, categoria, precio, cantidad, id_producto], (err, resultado)=>{
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
  
    
  
  //actualizar producto existente////////////////////////
  router.post('/productos', authMiddleware, (req, res)=>{
    const producto = req.body;
    const sql ='insert into tr_producto (producto,descripcion,categoria,precio,cantidad) values(?,?,?,?,?)';
  
    if(!producto.producto || !producto.descripcion || !producto.categoria || !producto.precio || !producto.cantidad){
        return res.status(400).json({error:'Todos los campos son obligatorios'});
    }
  
    pool.query(sql, [producto.producto,producto.descripcion,producto.categoria,producto.precio,producto.cantidad],(err, resultado)=>{
        if(err){
            res.status(500).json({error:'Error al agregar el producto'});
        }else{
            res.status(201).json({mesaje:'Producto agregado',codigo: resultado.insertId});
        }
    });
  });


  
module.exports = router;