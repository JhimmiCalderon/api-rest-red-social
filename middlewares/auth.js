// Importar modulos
const jwt = require("jwt-simple");
const moment = require("moment"); // Gestionar fechas

// Importar clave secreta
const linjwt = require("../services/jwt");
const secret = linjwt.secret;

// MIDDLEWARE de autenticacion
exports.auth = (req, res, next) => {
    // Comprobar si me llega la cabecera de auth
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene la cabecera de autenticacion"
        });
    }

    // Decodificar el token 
    let token = req.headers.authorization.replace(/['"]+/g,"");

    // Decodificar token 
    try{
        let payload = jwt.decode(token, secret);  // payload son todos loa datos que se an cargado

        // Comprobar expriracion del token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "Token expirado"
            });
        }
            // Agregar datos de usuarios a request
        req.user = payload; // de esta manera en cada peticion se obtendran los datos del usuario

    }catch(error){
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
            error


        });
    }

 
    // Pasar a ejecucion de accion
    next(); 
}


