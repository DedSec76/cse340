// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

/*  **********************************
  *  ROUTES GET
  * ********************************* */
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build a single view car
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// Route for managing vehicle inventory
router.get("/", 
          utilities.checkLogin,
          utilities.isAdministrative,
          utilities.handleErrors(invController.buildManagement))

// Route to Add new classification
router.get("/new-classification",
          utilities.checkLogin,
          utilities.isAdministrative,
          utilities.handleErrors(invController.buildNewClassification))

// Route to Add new vehicle
router.get("/new-vehicle", 
          utilities.checkLogin,
          utilities.isAdministrative,
          utilities.handleErrors(invController.buildNewVehicle))

// Route to Get Inventory
router.get("/getInventory/:classification_id", 
          utilities.checkLogin,
          utilities.isAdministrative,
          utilities.handleErrors(invController.getInventoryJSON))

// Route to Update Inventory
router.get("/edit/:inventory_id",
          utilities.checkLogin,
          utilities.isAdministrative,
          utilities.handleErrors(invController.buildUpdateVehicle))

// Route to Delete Inventory
router.get("/delete/:inventory_id", 
          utilities.checkLogin,
          utilities.isAdministrative,
          utilities.handleErrors(invController.buildDeleteVehicle))

/*  **********************************
  *  ROUTES POST
  * ********************************* */
// Route to send data to storage. New Classification
router.post(
    "/new-classification",
    utilities.checkLogin,
    utilities.isAdministrative,
    invValidate.addClassification(),
    invValidate.checkClassification,
    utilities.handleErrors(invController.addNewClassification)
)

// Route to send data to storage. New Vehicle
router.post(
    "/new-vehicle",
    utilities.checkLogin,
    utilities.isAdministrative,
    invValidate.addVehicle(),
    invValidate.checkVehicle,
    utilities.handleErrors(invController.addNewVehicle)
)

// Route to update stored vehicle
router.post(
  "/edit",
  utilities.checkLogin,
  utilities.isAdministrative,
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateVehicle)
)

// Route to delete stored vehicle
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.isAdministrative,
  utilities.handleErrors(invController.deleteVehicle)
)


module.exports = router

