const express = require('express');
const router = express.Router();
var middleware = require('../middleware');
const mongoose = require("mongoose");
const fs = require('fs');

let Grid = require("gridfs-stream");
let conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

const Registro = require('../models/registroModel');

/*router.get('/',middleware.ensureAuthenticated, async (req, res) =>{
    const operaciones = await Operacion.find();
    res.json(operaciones);
});*/



conn.once("open", () => {
    gfs = Grid(conn.db);
    router.get('/', (req, res) => {
        res.send('Hello Housem !');
    });
    router.get('/download/:nombreArchivo', (req, res) => {
        let nombreArchivo = req.params.nombreArchivo;
        gfs.files.find({
            filename: nombreArchivo
        }).toArray((err, files) => {

            if (files.length === 0) {
                return res.status(404).send({
                    message: 'File not found'
                });
            }
            let data = [];
            let readstream = gfs.createReadStream({
                filename: files[0].filename
            });

            readstream.on('data', (chunk) => {
                data.push(chunk);
            });

            readstream.on('end', () => {
                data = Buffer.concat(data);
                //let img = 'data:image/png;base64,' + Buffer(data).toString('base64');
                res.end(data);
            });

            readstream.on('error', (err) => {
                // if theres an error, respond with a status of 500
                // responds should be sent, otherwise the users will be kept waiting
                // until Connection Time out
                res.status(500).send(err);
                console.log('An error occurred!', err);
            });
        });
    });
    router.post('/upload/:mision/:rescatista', (req, res) => {
        console.log(req.body)
        let part = req.files.file;
        let mision = req.params.mision
        let rescatista = req.params.rescatista
        let writeStream = gfs.createWriteStream({
            filename: mision + '_' + rescatista + '_' + part.name,
            mode: 'w',
            content_type: part.mimetype
        });

        writeStream.on('close', async (file) => {
            // checking for file
            if (!file) {
                res.status(400).send('No file received');
            }
            const registros = await Registro.find();
            var num = 0;
            if (registros.length > 0) {
                if (registros[registros.length - 1])
                    num = registros[registros.length - 1].codigo
            }
            const registro = new Registro(req.body);
            registro.codigo = num + 1
            registro.fecha = new Date();
            registro.mision = mision;
            registro.rescatista = rescatista;
            registro.contenido = file;
            await registro.save();

            return res.status(200).send({
                message: 'Success',
                //file: file
                registro : registro
                //recibido : part
            });
        });
        // using callbacks is important !
        // writeStream should end the operation once all data is written to the DB 
        writeStream.write(part.data, () => {
            writeStream.end();
        });
    });
});


module.exports = router;