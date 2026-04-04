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
    const classificationSelect = await utilities.buildClassificationList()
    
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationSelect
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
 *  Deliver view to update new vehicle
 * ************************** */
invCont.buildUpdateVehicle = async function (req, res, next) {
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const data = await invModel.getVehicleByInventoryId(inv_id)
    const classificationSelect = await utilities.buildClassificationList(data.classification_id)
    
    res.render("inventory/editVehicle", {
        title: `Edit ${data.inv_make} ${data.inv_model}`,
        nav,
        list_classification: classificationSelect,
        errors: null,
        inv_id: data.inv_id,
        inv_make: data.inv_make,
        inv_model: data.inv_model,
        inv_year: data.inv_year,
        inv_description: data.inv_description,
        inv_image: data.inv_image,
        inv_thumbnail: data.inv_thumbnail,
        inv_price: data.inv_price,
        inv_miles: data.inv_miles,
        inv_color: data.inv_color,
        classification_id: data.classification_id
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if(invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  View to Update vehicle 
 *  or return errors 
 * ************************** */
invCont.updateVehicle = async function (req, res) {
    const { classification_id,
            inv_id,
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color} = req.body
    const updateResult = await invModel.updateVehicle({
        classification_id,
        inv_id,
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

    if (updateResult) {
        req.flash("notice", "The vehicle was successfully updated.")
        res.redirect('/inv/')
    } else {
        req.flash("notice", "Sorry, The vehicle couldn't be updated.")
        return res.redirect('/inv/edit/')
    }
}


module.exports = invCont