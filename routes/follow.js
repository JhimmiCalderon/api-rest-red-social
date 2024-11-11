const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");

// Definir routes
router.get("/prueba-follow", FollowController.pruebaFollow);

// Exportar  route

module.exports = router;