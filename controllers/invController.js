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
    res.render("inventory/classification", {
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
    
    res.render("inventory/vehicle", {
        title: className,
        nav,
        card
    })
}

/* ***************************
 *  Build view for car management 
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav
    })
}

/* ****************************************
*  Deliver view to add new classification
* *************************************** */
invCont.buildNewClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    
    res.render("inventory/addClassification", {
        title: "Add Classification",
        nav,
        errors: null,
        classification_name: ""
    })
}

/* ****************************************
*  Deliver view to add new vehicle
* *************************************** */
invCont.buildNewVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let list_classification = await utilities.buildClassificationList()

    res.render("inventory/addVehicle", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        list_classification
    })
}

/* ***************************
 *  View to Add new classification  
 * ************************** */
invCont.addNewClassification = async function (req, res) {
    const { classification_name } = req.body
    const addResult = await invModel.addNewClassification(classification_name)
    
    if(addResult) {
        req.flash("notice", "The newcar classification was successfully added.")

        return res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, Error to Adding")
        return res.redirect("/inv/new-classification")
    }
}

/* ***************************
 *  View to Add new vehicle  
 * ************************** */
invCont.addNewVehicle = async function (req, res) {
    const { classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color} = req.body
    const addResult = await invModel.addNewVehicle({
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    })

    if (addResult) {
        req.flash("notice", "The new vehicle was successfully added.")
        return res.redirect('/inv/')
    } else {
        req.flash("notice", "Sorry, Couldn't add the vehicle")
        return res.redirect('/inv/new-vehicle')
    }
}

module.exports = invCont