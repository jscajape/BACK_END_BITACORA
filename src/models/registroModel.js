const mongoose = require('mongoose');
const { Schema } = mongoose;

const Registro = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    fecha: {
        type: String
    },
    mision:{
        type:Number,
        required: 'Es necesario el código'
    },
    usuario:{
        type:Number,
        required: 'Es necesario el código'
    },
    remisor:
    {
        type: String   
    },
    tipo:
    {
        type:Number //1: chat Interno, 2: geo, 3: reporte hacia pmando
    },
    contenido: {
        type: Object
    }
});
module.exports = mongoose.model('Registro', Registro,'Registro');