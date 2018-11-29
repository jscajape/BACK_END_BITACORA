const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Mision = require('../models/misionModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const misiones = await Mision.find();
    EnviarEmail('yop_dm@hotmail.com','Prueba','Este es un mensaje de prueba')
    res.json(misiones);
});

router.get('/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await Mision.findOne( {codigo:codigo}, (err, mision) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!mision) return res.status(404).send({ mesagge :' el mision no existe'})

        res.json(mision)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const misiones = await Mision.find(); 
    var num = 0;
    if(misiones.length > 0)
    {
        if(misiones[misiones.length-1])
             num = misiones[misiones.length-1].codigo
    }
    const mision = new Mision(req.body);
    mision.codigo=num+1

    await mision.save();
    res.json({
        status: 'Mision creada exitosamente'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let mision = await Mision.findOne({codigo:req.body.codigo})
    Object.assign(mision, req.body)
    await mision.save()
    res.json({
        status: 'Mision Actualizado'
    });
});

router.delete('/:id',middleware.ensureAuthenticated, async (req, res) => {
  
   await Mision.findByIdAndRemove(req.params.id);
   res.json({
    status:'Mision eliminada'
   });
});

module.exports = router;