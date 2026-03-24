const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if(!data || data.length === 0) {
        const error = new Error("Classification not found")
        error.status = 404
        throw error
    }
    
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build view by each car
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inventory_id = req.params.invId
    const data = await invModel.getVehicleByInventoryId(inventory_id)

    // Data Validation
    if( !data || data.length === 0) {
        const error = new Error("Vehicle not found")
        error.status = 404
        throw error
    }

    const card = await utilities.buildVehicleCard(data)
    let nav = await utilities.getNav()
    const className = `${data.inv_make}  ${data.inv_model}`
    
    res.render("./inventory/vehicle", {
        title: className,
        nav,
        card
    })
}

module.exports = invCont