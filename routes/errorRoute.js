// Needed Resources
const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to build error view
router.get("/testError", utilities.handleErrors(errorController.buildError))

module.exports = router
