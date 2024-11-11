// Importar dependencias y modulos
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Acciones de pruebas 
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js"
    })
}

// Registro de usuarios
const register = async (req, res) => {
// Recoger datos de la peticion
 let params = req.body;

 try {
    // Comprobar que me llagan bien (+ validacion)
    if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos obligatorios",
        });
    }
   
    // Control de usuarios duplicados
    const existingUser = await User.findOne({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() }
        ]
    });

    if (existingUser) {
        return res.status(400).json({
            status: "error",
            message: "El correo o el nick ya están en uso",
        });
    }

    // Cifrar la contraseña
    let pwd = await bcrypt.hash(params.password, 10); // Corrección: ajuste del factor de coste a 10 (recomendado para bcrypt)
    params.password = pwd; // Asigna la contraseña cifrada al objeto `params`

    // Crear objeto de usuario
    let user_save = new User(params); // Para crear nuevo usuario en memoria


    // Guardar usuario en la BD
    const newUser = await user_save.save(); // Uso de `await` para guardar el usuario y esperar el resultado

    // Devolver resultado
    return res.status(200).json({
        status: "succes",
        message: "Accion  de registro de usuarios",
        user: newUser, // Devolver el usuario recién creado
    })
    
 }catch(error){
    console.error(error);
    res.status(500).json({
        estatus: "error",
        message: "Ocurrió un error al registrar el usuario",
        
    });
 }

}


// Exportar acciones

module.exports = {
    pruebaUser,
    register
}