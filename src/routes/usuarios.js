const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Usuario = require('../models/usuarioModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

router.get('/:cliente',middleware.ensureAuthenticated, async (req, res) =>{
    let cli = req.params.cliente
    await Usuario.findOne( {cliente:cli}, (err, usuario) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!usuario) return res.status(404).send({ mesagge :' el usuario no existe'})

        res.json(usuario)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const usuarios = await Usuario.find(); 
    var num = 0;
    if(usuarios.length > 0)
    {
        if(usuarios[usuarios.length-1])
             num = usuarios[usuarios.length-1].codigo
    }
    const usuario = new Usuario(req.body);
    usuario.codigo=num+1

    await usuario.save();
    res.json(usuario);
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let usuario = await Usuario.findOne({cliente:req.body.cliente})
    Object.assign(usuario, req.body)
    await usuario.save()
    res.json({
        status: 'Usuario Actualizado'
    });
});



router.delete('/:id',middleware.ensureAuthenticated, async (req, res) => {//Se define una nueva ruta para el método DELETE en la raíz de la aplicación  
    console.log(req.query);//Imprime por consola la consulta realizada en la petición
   await Usuario.findByIdAndRemove(req.params.id);//Busca el cliente de acuerdo a los parámetros consultados en la petición y lo elimina
   res.json({
    status:'Usuario eliminado'//Se devuelve en la respuesta el estado correspondiente en formato JSON
   });
});

module.exports = router;