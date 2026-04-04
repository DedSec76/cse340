// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

/*  **********************************
  *  ROUTES GET
  * ********************************* */
// Route for managing vehicle inventory
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build a single view car
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// Route to Add new classification
router.get("/new-classification", utilities.handleErrors(invController.buildNewClassification))

// Route to Add new vehicle
router.get("/new-vehicle", utilities.handleErrors(invController.buildNewVehicle))

// Route to Get Inventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to Update Inventory
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildUpdateVehicle))


/*  **********************************
  *  ROUTES POST
  * ********************************* */
// Route to send data to storage. New Classification
router.post(
    "/new-classification",
    invValidate.addClassification(),
    invValidate.checkClassification,
    utilities.handleErrors(invController.addNewClassification)
)

// Route to send data to storage. New Vehicle
router.post(
    "/new-vehicle",
    invValidate.addVehicle(),
    invValidate.checkVehicle,
    utilities.handleErrors(invController.addNewVehicle)
)

// Route to update data in storage
router.post(
  "/edit",
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateVehicle)
)


module.exports = router

