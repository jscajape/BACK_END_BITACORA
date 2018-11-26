const mongoose = require('mongoose');
const { Schema } = mongoose;

const Operacion = new Schema({
    mision:{
        type:Number,
        required: 'Es necesario el código de la mision'
    },
    rescatista: {
        type: String,
        required:'Es necesario CI de usuario'
    }
});

module.exports = mongoose.model('Operacion', Operacion,'Operacion');