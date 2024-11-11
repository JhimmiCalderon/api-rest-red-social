const exppress = require("express");
const router = exppress.Router();
const UserController = require("../controllers/user");

// Definir rutas
router.get("/prueba-user", UserController.pruebaUser);
router.post("/register", UserController.register);

// Exportar router
module.exports = router;