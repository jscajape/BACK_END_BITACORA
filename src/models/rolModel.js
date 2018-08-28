const mongoose = require('mongoose');
const { Schema } = mongoose;

const Rol = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    descripcion: {
        type: String,
        required:'Es necesaria la descripción'
    },
    estado: {
        type: String,
        required:'Es necesaria la descripción',
        maxlength:[3,"Solo Permitido 3 caracteres"]
    }
});

module.exports = mongoose.model('Rol', Rol,'Rol');