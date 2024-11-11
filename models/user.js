const {Schema, model} = require("mongoose");

const  UserSchema = Schema({
    name: {
        type: String,
        require: true
    },
    surname: String,
    nick: {
        type: String,
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "role_user" // Dato por defecto
    },
    image: {
        type: String,
        default: "default.png" 
    },
    create_at: {
        type: Date,
        default: Date.now // Guardar fecha actual de ese registro
    }
});

// Exportar para despues usarlo

module.exports = model("User", UserSchema, "users");    // Devuelvo un modelo  para luego poderlo usar como capa de attraccion intermedia entre lo que es el proyecto Node y la BD
                    //  Coleccion: users