const mongoose = require('mongoose');
const { Schema } = mongoose;

const Usuario = new Schema({
    codigo:{
        type:Number,
        required: 'Es necesario el código'
    },
    rescatista: {
        type: String,
        required:'Es necesaria el codigo del rescatista',    
    },
    nombreUsuario: {
        type: String,
        required:'Es necesario el nombre de usuario'
    },
    password: {
        type: String,
        required:'Es necesario un password'
    },
    email: {//Se especifica el atributo correo que será una cadena y deberá corresponder con el formato para una dirección de correo electrónico valida
        type: String,
        match: /.+\@.+\..+/
    },
    perfil: Number,
    estado: {
        type: String,
        required:'Es necesaria la descripción',
        maxlength:[3,"Solo Permitido 3 caracteres"]
    },
    ultimoAcceso: {
        type: Date
    }
    
});

module.exports = mongoose.model('Usuario', Usuario,'Usuario');