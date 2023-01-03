const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Routes
router.get("/", clientController.view);
// router.post("/", clientController.find);
router.get("/addclient", clientController.form);
router.post("/addclient", clientController.create);
router.get("/editclient/:id", clientController.edit);
router.post("/editclient/:id", clientController.update);
// router.get("/viewclient/:id", clientController.viewall);
// router.get("/:id", clientController.delete);

module.exports = router;
