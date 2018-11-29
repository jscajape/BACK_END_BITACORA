const express = require('express');
const router = express.Router();
var middleware = require('../middleware');

const Operacion = require('../models/operacionModel');
const Usuario = require('../models/usuarioModel');
const Rescatista = require('../models/rescatistaModel');
const Mision = require('../models/misionModel');

var Mail=require("../models/mail")
var objMail=new Mail()


router.get('/', middleware.ensureAuthenticated, async (req, res) => {
    const operaciones = await Operacion.find();
    res.json(operaciones);
});

router.get('/mision/:codigo', middleware.ensureAuthenticated, async (req, res) => {
    let codigo = req.params.codigo
    await Operacion.find({ mision: codigo }, (err, operacion) => {
        if (err) return res.status(500).send({ message: 'error al realizar la petición' })
        if (!operacion) return res.status(404).send({ mesagge: ' el operacion no existe' })
        var misiones = operacion.map(x => x.rescatista);
        Rescatista.find({ ci: { $in: misiones } }, (err, resc) => {
            res.json(resc);
        });
    })
});

router.get('/rescatista/:codigo', middleware.ensureAuthenticated, async (req, res) => {
    let codigo = req.params.codigo
    misiones = []
    await Operacion.find({ rescatista: codigo }, (err, operacion) => {
        if (err) return res.status(500).send({ message: 'error al realizar la petición' })
        if (!operacion) return res.status(404).send({ mesagge: ' el operacion no existe' })
        var misiones = operacion.map(x => x.mision);
        Mision.find({ codigo: { $in: misiones } }, (err, resc) => {
            res.json(resc);
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
    operacion.save(() => {
        objMail.EnviarEmail(rescatista.email,'Sistema de Mando y Control Misiones de Rescate',
        'Estimad@ ha sido asignado a la mision No. '+operacion.mision+'\nPara mayor información ingrese a la app.')
    
        res.json({
            status: 'Operacion Guardada'
        });
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

router.delete('/:mis', middleware.ensureAuthenticated, async (req, res) => {
    let mis = req.params.mis
    Operacion.remove({ mision: mis }, () => {
        res.json({
            status: 'Operacion Eliminada'
        });
    }) 
});

module.exports = router;