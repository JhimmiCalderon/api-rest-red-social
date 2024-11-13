// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "CLAVE_SECRETA_red_social_092839219";

// Crear una funcion para generar tokens
const crateToken = (user) => { // lo exportamos de aqui por que solo es una funcion
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        role: user.role,
        imagen: user.image,
        exp: moment().add(30, "days").unix(),
        iat: moment().unix(),
        
    };
    // Devolver jwt token codificado
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    crateToken
}
