const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Perfil = require('../models/perfilModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const perfiles = await Perfil.find();
    res.json(perfiles);
});

router.get('/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await Perfil.findOne( {codigo:codigo}, (err, perfil) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!perfil) return res.status(404).send({ mesagge :' el perfil no existe'})

        res.json(perfil)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const perfiles = await Perfil.find(); 
    var num = 0;
    if(perfiles.length > 0)
    {
        if(perfiles[perfiles.length-1])
             num = perfiles[perfiles.length-1].codigo
    }
    const perfil = new Perfil(req.body);
    perfil.codigo=num+1

    await perfil.save();
    res.json({
        status: 'Perfil Guardado'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let perfil = await Perfil.findOne({codigo:req.body.codigo})
    Object.assign(perfil, req.body)
    await perfil.save()
    res.json({
        status: 'Perfil Actualizado'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
   await Perfil.findByIdAndRemove(req.query);
   res.json({
    status:'Perfil Eliminado'
   });
});

module.exports = router;