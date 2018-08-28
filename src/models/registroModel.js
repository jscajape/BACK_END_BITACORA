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
    contenido: {
        type: Object
    }
});
module.exports = mongoose.model('Registro', Registro,'Registro');