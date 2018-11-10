const mongoose = require('mongoose');
const { Schema } = mongoose;

const Mision = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    descripcion: {
        type: String,
		required:'Es necesario la descripción'
    },
    fechaInicio: {
        type: Date,
        default: new Date()
    },
    observacionInicial: {
        type: String
    },
    fechafin: {
        type: Date
    },
    observacionFinal: {
        type: String
    },
    estado: {
        type: String
    }
});

module.exports = mongoose.model('Mision', Mision,'Mision');