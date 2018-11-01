const mongoose = require('mongoose'); //Permite incluir el módulo moongose en el código para que pueda ser usado
const { Schema } = mongoose;//Se especifica que se va a usar Schemas

const Rescatista = new Schema({ //Se define el Schema para la entidad Rescatista
    codigo:{   //Se especifica el atributo código que será un número y obligatorio
        type:Number,
        required: 'Es necesario el código'
    },
    rol:{   //Se especifica el código del rol al que pertenece el rescatista
        type:Number,
        required: 'Es necesario el código'
    },
    ci: { //Se especifica el atributo identificación que será una cadena, obligatorio y menor igual a 13 caracteres
        type: String,
        required:'Es necesario el número del documento',
        maxlength:[10,"Número de documento extenso"]
    },
    nombres: {//Se especifica el atributo nombres que será una cadena y es obligatorio
        type: String,
        required:'Son necesarios los nombres'
    },
    apellidos: {//Se especifica el atributo apellidos que será una cadena y es obligatorio
        type: String,
        required:'Son necesarios los apellidos'
    },
    fechaNacimiento: {
        type: Date
    },
    direccion: {//Se especifica el atributo dirección que será una cadena y es obligatorio
        type: String,
        required:'Es necesario la dirección'
    },
    telefono: String,//Se especifica el atributo teléfono que será una cadena
    movil: {//Se especifica el atributo móvil que será una cadena y es obligatorio
        type: String,
    },
    rango: {
        type: String
    },
    genero: {
        type: String,
    },
    estado: {
        type: String,
        maxlength:[3,"Solo Permitido 3 caracteres"]
    }
 });

module.exports = mongoose.model('Rescatista', Rescatista,'Rescatista'); //Permite que el Schema para la entidad Rescatista pueda ser usada en otro parte del código o archivo