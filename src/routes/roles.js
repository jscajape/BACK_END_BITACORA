const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Rol = require('../models/rolModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const roles = await Rol.find();
    res.json(roles);
});

router.get('/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await Rol.findOne( {codigo:codigo}, (err, rol) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!rol) return res.status(404).send({ mesagge :' el rol no existe'})

        res.json(rol)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const roles = await Rol.find(); 
    var num = 0;
    if(roles.length > 0)
    {
        if(roles[roles.length-1])
             num = roles[roles.length-1].codigo
    }
    const rol = new Rol(req.body);
    rol.codigo=num+1

    await rol.save();
    res.json({
        status: 'Rol Guardado'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let rol = await Rol.findOne({codigo:req.body.codigo})
    Object.assign(rol, req.body)
    await rol.save()
    res.json({
        status: 'Rol Actualizado'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
   await Rol.findByIdAndRemove(req.query);
   res.json({
    status:'Rol Eliminado'
   });
});

module.exports = router;