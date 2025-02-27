const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

router.get("/modify-content", aiController.modifyContent);

router.get("/translate-content", aiController.translateContent);

router.get("/chatAi", aiController.ChatWithAi);

module.exports = router;
