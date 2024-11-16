const exppress = require("express");
const router = exppress.Router();
const UserController = require("../controllers/user");
const multer = require("multer");// se encarga de subir archivos al servidor ,procesa los archivos que envian las peticiones  
const check = require("../middlewares/auth");


// Configuracion de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/")
    },
    filname: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
})
const uploads = multer ({storage});

// Definir rutas
router.get("/prueba-user", check.auth, UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id",check.auth, UserController.profile);// Recordar que se usan (":") para enviarle el parametro
router.get("/list/:pag?", check.auth, UserController.list); // "?" Para decir que el parametro s opcional
router.put("/update", check.auth, UserController.update);
router.post("/upload", [check.auth, uploads.single("file0")], UserController.upload);

// Exportar router
module.exports = router;