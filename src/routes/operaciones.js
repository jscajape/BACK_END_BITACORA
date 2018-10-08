const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Operacion = require('../models/operacionModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const operaciones = await Operacion.find();
    res.json(operaciones);
});

router.get('/mision/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await Operacion.find( {mision:codigo}, (err, operacion) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!operacion) return res.status(404).send({ mesagge :' el operacion no existe'})

        res.json(operacion)
    })
});

router.get('/usuario/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await Operacion.find( {usuario:codigo}, (err, operacion) => {
        if(err) return res.status(500).send({ message: 'error al realizar la petición'})
        if(!operacion) return res.status(404).send({ mesagge :' el operacion no existe'})

        res.json(operacion)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const operaciones = await Operacion.find(); 
    var num = 0;
    if(operaciones.length > 0)
    {
        if(operaciones[operaciones.length-1])
             num = operaciones[operaciones.length-1].codigo
    }
    const operacion = new Operacion(req.body);
    operacion.codigo=num+1

    await operacion.save();
    res.json({
        status: 'Operacion Guardado'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let operacion = await Operacion.findOne({codigo:req.body.codigo})
    Object.assign(operacion, req.body)
    await operacion.save()
    res.json({
        status: 'Operacion Actualizado'
    });
});

router.delete('/',middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
   await Operacion.findByIdAndRemove(req.query);
   res.json({
    status:'Operacion Eliminado'
   });
});

module.exports = router;