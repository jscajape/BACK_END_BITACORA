const express = require('express');//Permite incluir el módulo express (framework para aplicaciones web) en el código para que pueda ser usado
const morgan = require('morgan');//Permite incluir el módulo morgan (middleware registrador de peticiones HTTP) en el código para que pueda ser usado
const mongoose = require('mongoose')//Permite incluir el módulo mongoose (modelamiento de objetos para MongoDB) en el código para que pueda ser usado
var service = require('./services');//Se declara la variable service que permite incluir el módulo services a fin de que pueda ser usado en el código 
var middleware = require('./middleware');//Permite incluir el archivo donde se definió el middleware
busboyBodyParser = require('busboy-body-parser');


const app = express();//Se crea una aplicación de Express


mongoose.connect('mongodb://localhost/Bitacora',{
    "user": "root",
    "pass": "fQf6zgnDKvDD",
    "useMongoClient": true
})                      //Permite conectar a la base de datos local denominada Back_end
    .then(db => console.log('BD está conectada'))
    .catch(err => console.error(err));


//------------------------------------------

app.set('port', 6000);//Se define el puerto port para la aplicación. Se usa el valor de process.env.PORT en el caso que haya sido configurado o en su defecto el puerto 3000

//middlewares
app.use(morgan('dev'));//Establece el formato predefinido llamado dev para las cadenas de caracteres
app.use(express.json());//Permite mapear las peticiones entrantes a payloads JSON
app.use(function (req, res, next) {//Permite habilitar CORS(cross-origin resource sharing) en la aplicación de Express
    //Se define un conjunto de encabezados que permiten al navegador y al servidor conocer qué solicitudes están (y no están) permitidas.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(busboyBodyParser({ limit: '10mb' }));

//Rutas
app.use('/rescatistas', require('./routes/rescatistas'))
app.use('/usuarios', require('./routes/usuarios'))
app.use('/misiones', require('./routes/misiones'))
app.use('/operaciones', require('./routes/operaciones'))
app.use('/perfiles', require('./routes/perfiles'))
app.use('/registros', require('./routes/registros'))
app.use('/roles', require('./routes/roles'))
app.use('/login', require('./routes/login'))
app.use('/archivos', require('./routes/uploadDownload'))

// Permite incluir el servicio de archivos estáticos
app.use(express.static(__dirname + '/public'))


//La aplicación se encuentra escuchando las peticiones en el puerto port
app.listen(app.get('port'), () => {
    console.log('server on port 3000');//Imprime por consola el mensaje correspondiente
});