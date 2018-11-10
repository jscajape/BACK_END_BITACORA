const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Operacion = require('../models/operacionModel');
const Usuario = require('../models/usuarioModel');
const Rescatista = require('../models/rescatistaModel');
const Mision = require('../models/misionModel');

router.get('/', middleware.ensureAuthenticated, async (req, res) => {
    const operaciones = await Operacion.find();
    res.json(operaciones);
});

router.get('/mision/:codigo', middleware.ensureAuthenticated, async (req, res) => {
    let codigo = req.params.codigo
    rescatistas = [];
    await Operacion.find({ mision: codigo }, (err, operacion) => {

        if (err) return res.status(500).send({ message: 'error al realizar la petición' })
        if (!operacion) return res.status(404).send({ mesagge: ' el operacion no existe' })

        operacion.forEach(function (item) {
            Usuario.findOne({ codigo: item.usuario }, async function (err, us) {
                Rescatista.findOne({ codigo: us.rescatista }, (err, rescatista) => {
                    rescatistas.push(rescatista);
                    if (rescatistas.length === operacion.length) {
                        res.json(rescatistas);
                    }
                });
            })
            
        });
    })
});

router.get('/rescatista/:codigo', middleware.ensureAuthenticated, async (req, res) => {
    let codigo = req.params.codigo
    misiones = []
    await Operacion.find({ rescatista: codigo }, (err, operacion) => {
        if (err) return res.status(500).send({ message: 'error al realizar la petición' })
        if (!operacion) return res.status(404).send({ mesagge: ' el operacion no existe' })
        
        operacion.forEach(function (item) {
            Mision.findOne( {codigo:item.mision}, (err, mision) => {
                misiones.push(mision);
                    if (misiones.length === operacion.length) {
                        res.json(misiones);
                    }
            })
        });
    })
});

router.put('/', middleware.ensureAuthenticated, async (req, res) => {

    const operaciones = await Operacion.find();
    var num = 0;
    if (operaciones.length > 0) {
        if (operaciones[operaciones.length - 1])
            num = operaciones[operaciones.length - 1].codigo
    }
    const operacion = new Operacion(req.body);
    operacion.codigo = num + 1

    await operacion.save();
    res.json({
        status: 'Operacion Guardado'
    });
});

router.post('/', middleware.ensureAuthenticated, async (req, res) => {
    let operacion = await Operacion.findOne({ codigo: req.body.codigo })
    Object.assign(operacion, req.body)
    await operacion.save()
    res.json({
        status: 'Operacion Actualizado'
    });
});

router.delete('/:mision', middleware.ensureAuthenticated, async (req, res) => {
   
    await Operacion.findByIdAndRemove(req.params.mision);
    res.json({
        status: 'Operacion Eliminado'
    });
});

module.exports = router;