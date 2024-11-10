//imprtar dependencias
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Mensaje Bienvenida
console.log("API NODE para RED SOCIAL arrancada");

// Conexion a Base de Datos
connection();

// Crear servidor node
const app = express();
const port = 4000;

// Configurar cors(Para que se hagan las peticiones correctamenete)
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar conf rutas

// Poner al servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor en el puerto: ", port)
});
