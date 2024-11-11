const mongoose = require("mongoose"); //importamos nuestra liberira que nos permite la conexion a la bd

const connection = async () => {

    try{

        await mongoose.connect("mongodb://localhost:27017/mi_redsocial");// Se puede pasar parrametros para errores

        console.log("¡Conexion a  nuestra base de datos : mi_redsocial Exitosa!");

    }catch(error){
        console.log(error)
        throw new Error ("No se a podido conectar a la Base de Datos ");
    }
}

module.exports = connection