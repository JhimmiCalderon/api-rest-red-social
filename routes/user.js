const exppress = require("express");
const router = exppress.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-user", check.auth, UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id",check.auth, UserController.profile);// Recordar que se usan (":") para enviarle el parametro
router.get("/list/:pag?", check.auth, UserController.list); // "?" Para decir que el parametro s opcional

// Exportar router
module.exports = router;