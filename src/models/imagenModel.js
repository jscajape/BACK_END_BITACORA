const Imagen = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    descripcion: {
        type: String,
		required:'Es necesario la descripción'
    },
    fechaInicio: {
        type: Date
    },
    observacionInicial: {
        type: String
    },
    fechafin: {
        type: Date
    },
    observacionFinal: {
        type: String
    }
});

module.exports = Imagen;