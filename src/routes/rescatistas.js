const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Rescatista = require('../models/rescatistaModel');

router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const rescatistas = await Rescatista.find();
    res.json(rescatistas);
});

router.get('/:codigo',middleware.ensureAuthenticated, async (req, res) =>{
    let codigo = req.params.codigo
    await Rescatista.findOne( {codigo:codigo}, (err, rescatista) => {
        if(err) return res.status(500).send({ message: 'Error al realizar la petición'})
        if(!rescatista) return res.status(404).send({ mesagge :'El rescatista no existe'})

        res.json(rescatista)
    })
});

router.put('/',middleware.ensureAuthenticated, async (req, res) => {
    
    const rescatistas = await Rescatista.find(); 
    var num = 0;
    if(rescatistas.length > 0)
    {
        if(rescatistas[rescatistas.length-1])
             num = rescatistas[rescatistas.length-1].codigo
    }
    const rescatista = new Rescatista(req.body);
    rescatista.codigo=num+1

    await rescatista.save();
    res.json({
        status: 'Rescatista Guardado'
    });
});

router.post('/',middleware.ensureAuthenticated, async (req, res) => {
    let rescatista = await Rescatista.findOne({codigo:req.body.codigo})
    Object.assign(rescatista, req.body)
    await rescatista.save()
    res.json({
        status: 'Rescatista Actualizado'
    });
});

router.delete('/:id',middleware.ensureAuthenticated, async (req, res) => {
    let id = req.params.id
    await Rescatista.findByIdAndRemove(id);
   res.json({
    status:'Rescatista Eliminado'
   });
});

module.exports = router;