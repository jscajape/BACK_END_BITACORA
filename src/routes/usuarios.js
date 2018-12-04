const express = require('express');
const router = express.Router();
var middleware = require('../middleware');
var Mail=require("../models/mail")

const Usuario = require('../models/usuarioModel');
const Rescatista = require('../models/rescatistaModel');

var objMail=new Mail()

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

router.get('/:usuario',middleware.ensureAuthenticated, async (req, res) =>{
    let usu = req.params.usuario
    await Usuario.findOne( {codigo:usu}, async (err, usuario) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!usuario) return res.status(404).send({ mesagge :' el usuario no existe'})

        res.json(usuario)
    })
});

router.get('/rescatista/:usuario',middleware.ensureAuthenticated, async (req, res) =>{
    let usu = req.params.usuario
    await Usuario.findOne( {codigo:usu}, async (err, usuario) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!usuario) return res.status(404).send({ mesagge :' el usuario no existe'})

        await Rescatista.findOne( {ci:usuario.rescatista}, (err, rescatista) => {
            if(err) return res.status(500).send({ message: 'error al realizar la petición'})
            if(!rescatista) return res.status(404).send({ mesagge :' el rescatista no existe'})
            res.json(rescatista)
        })
    })
});

router.get('/usuario/:rescatista',middleware.ensureAuthenticated, async (req, res) =>{
    let crescatista = req.params.rescatista
    await Usuario.findOne( {rescatista:crescatista}, async (err, usuario) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!usuario) return res.status(404).send({ mesagge :'El usuario no existe'})
        res.json(usuario)
       
    })
});
router.put('/', middleware.ensureAuthenticated, async (req, res) => {
    
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
    objMail.EnviarEmail(usuario.email,'Sistema de Mando y Control Misiones de Rescate',
    'Estimad@ a sido ingresado, con el usuario: '+usuario.nombreUsuario+'\n.Para obtener la apliacion movil: https://drive.google.com/file/d/1zJWfwHJK7wxCgXpr3HCD7HkRocsvEK9p/view?usp=sharing')
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