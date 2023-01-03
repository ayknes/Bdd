const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commandeController");

// Routes
router.get("/all", commandeController.view);
// router.post("/", commandeController.find);
router.get("/addcommande", commandeController.form);
router.post("/addcommande", commandeController.create);
router.get("/editcommande/:id", commandeController.edit);
// router.post("/editcommande/:id", commandeController.update);
router.get("/viewcommande/:id", commandeController.viewall);
router.post("/viewcommande/:id", commandeController.getInvoice);

router.get("/deletecommande/:id", commandeController.delete);

module.exports = router;
