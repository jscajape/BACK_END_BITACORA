var nodemailer = require('nodemailer');//Permite incluir el módulo nodemailer en el código para que sea posible el envío de correos electrónicos

var EnviarEmail = function (correo,asunto,texto) {
    var transporter = nodemailer.createTransport({//Se crea el servicio de transporte necesario para poder enviar correos electrónicos
        service: 'gmail',//Se especifica el uso de gmail
        auth: {//Se define el objeto de autenticación especificando la cuenta y contraseña de gmail
            user: 'bit.rescatistas@gmail.com',
            pass: 'rescatistas2018'
        }
    });

    var mailOptions = {//Se especifican los detalles del correo a enviar como emisor, receptor, asunto y texto
        from: 'bit.rescatistas@gmail.com',
        to: correo,
        subject: asunto,
        text: texto
    };

    transporter.sendMail(mailOptions, function (error, info) {//Se usa el servicio de transporte creado anteriormente para enviar el correo de acuerdo a los detalles especificados previamente
        if (error) {
            console.log(error);//Si existe algún error se muestra por consola el error
        } else {
            console.log('Email enviado: ' + info.response);//Caso contrario se muestra por consola el mensaje correspondiente al envío del correo
        }
    });
}
