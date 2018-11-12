const express = require('express');
const router = express.Router();
var middleware = require('../middleware');
const Rescatista = require('../models/rescatistaModel');

const Registro = require('../models/registroModel');

const events=['message','location','reporte']

//-------------------------------

//------------------------------------------


io.on('connection', (socket) => {

    socket.on('disconnect', function () {
        console.log(socket.nickname)
        io.emit('users-changed', { user: socket.nickname, event: 'left' });
    });

    socket.on('set-nickname', (nickname) => {
        socket.nickname = nickname;
        io.emit('users-changed', { user: nickname, event: 'joined' });
    });

    socket.on('add-message', (message) => {
        io.emit('message', { text: message.text, from: socket.nickname, created: new Date() });
    });

    socket.on('message', (message) => {
        io.emit('message', { text: message.text, from: socket.nickname, created: new Date() });
    });





});


router.get('/', middleware.ensureAuthenticated, async (req, res) => {
    const registros = await Registro.find();
    res.json(registros);
});

router.get('/:codigo', middleware.ensureAuthenticated, async (req, res) => {
    let codigo = req.params.codigo
    await Registro.findOne({ codigo: codigo }, (err, registro) => {
        if (err) return res.status(500).send({ message: 'error al realizar la petición' })
        if (!registro) return res.status(404).send({ mesagge: ' el registro no existe' })

        res.json(registro)
    })
});

router.put('/', middleware.ensureAuthenticated, async (req, res) => {

    const registros = await Registro.find();
    var num = 0;
    const registro = new Registro(req.body);
    if (registros.length > 0) {
        if (registros[registros.length - 1])
            num = registros[registros.length - 1].codigo
    }
    await Rescatista.findOne({ ci: req.body.rescatista }, (err, resc) => {
        if (err)
            return res.status(500).send({ message: 'error al encontrar rescatista ' })
        if (!registro)
            return res.status(404).send({ mesagge: ' el rescatista no existe' })

        registro.rescatista = resc.codigo
        registro.codigo = num + 1
        registro.fecha = new Date();
        registro.save((err2, r) => {
            if (err2)
                return res.status(500).send({ message: 'error al guardar registro' })
            res.json({
                status: 'Registro Guardado'
            });

            io.emit('registro_'+events[registro.tipo], registro);

        });

    })


});


router.post('/', middleware.ensureAuthenticated, async (req, res) => {
    let registro = await Registro.findOne({ codigo: req.body.codigo })
    Object.assign(registro, req.body)
    await registro.save()
    res.json({
        status: 'Registro Actualizado'
    });
});

router.delete('/', middleware.ensureAuthenticated, async (req, res) => {
    console.log(req.query);
    await Registro.findByIdAndRemove(req.query);
    res.json({
        status: 'Registro Eliminado'
    });
});

module.exports = router;