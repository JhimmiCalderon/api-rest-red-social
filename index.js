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
const port = 3000;

// Configurar cors(Para que se hagan las peticiones correctamenete)
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar conf rutas
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

// --->>Para cargar esas rutas vamos a usar (app.use) se usa para cargar una cofiguracion dentro de express
app.use("/api/user" , UserRoutes); // Como primer parametro vamos a indicar un prefijo (/api) para sabr que es un metoo de api a lo que hacemos una peticion
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);

// Poner al servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor en el puerto: ", port)
});
