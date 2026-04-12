const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  *******************************
  *  Data Validation Rules for  
  *  Adding new Classification
  * **************************** */
validate.addClassification = () => {
    return [
        // classification_name is required and must be string
        body("classification_name")
            .trim()
            .notEmpty().withMessage("Your name is required").bail()
            .matches(/^\S+$/)
            .isAlpha()
            .withMessage("The name must be alphabetical and without spaces")
            .isLength({ min: 2})
            .custom(async (classification_name) => {
                const nameExits = await invModel.checkNameExists(classification_name)

                if(nameExits) {
                    throw new Error("The classification name already exists")
                }
            })
    ]
}

/*  *******************************
  *  Data Validation Rules for  
  *  Adding new Vehicle
  * **************************** */
validate.addVehicle = () => {
    return [
        body("classification_id")
            .trim()
            .isNumeric().withMessage("You must choose a classification").bail()
            .notEmpty().withMessage("classification is required"),

        body("inv_make")
            .trim()
            .escape()
            .notEmpty().withMessage("The make must not be empty").bail()
            .matches(/^[A-Za-z]+(\s[A-Za-z]+)*$/).withMessage("Only letters, spaces, ")
            .isLength({ min: 3 }).withMessage("min 3 chars"),
        
        body("inv_model")
            .trim()
            .escape()
            .notEmpty().withMessage("The model must not be empty").bail()
            .matches(/^[A-Za-z]+(\s[A-Za-z]+)*$/).withMessage("Only letters, spaces, ")
            .isLength({ min: 3 }).withMessage("min 3 chars."),
        
        body("inv_description")
            .trim()
            .notEmpty().withMessage("The description must not be empty").bail()
            .isLength({ min: 5 }).withMessage("Description min 5 chars"),
        
        body("inv_image")
            .trim()
            .notEmpty().withMessage("The image path must not be empty").bail()
            .isLength({ min: 5 }).withMessage("The image path must be min 5 chars"),
        
        body("inv_thumbnail")
            .trim()
            .notEmpty().withMessage("The thumbnail path must not be empty").bail()
            .isLength({ min: 5 }).withMessage("The thumbnail path min 5 chars"),
        
        body("inv_price")
            .notEmpty().withMessage("The price must not be empty").bail()
            .isFloat({ min: 0.01, max: 999999 })
            .withMessage("Price must be a valid positive number"),
        
        body("inv_year")
            .trim()
            .notEmpty().withMessage("The year must not be empty").bail()
            .isInt({ min: 1800, max: 2050}).withMessage("The year must be min 4 digits"),
        
        body("inv_miles")
            .notEmpty().withMessage("The miles must not be empty").bail()
            .isInt({ min: 0, max: 999999 })
            .withMessage("Miles must be a valid number between 0 and 999999"),
        
        body("inv_color")
            .trim()
            .notEmpty().withMessage("The color must not be empty").bail()
            .isLength({ min: 2, max: 20}).withMessage("The color must be min 2 chars and max 20"),
    ]
}

/*  *******************************
  *  Data Validation Rules for  
  *  Adding new Vehicle
  * **************************** */
validate.newInventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .isNumeric().withMessage("You must choose a classification").bail()
            .notEmpty().withMessage("classification is required"),

        body("inv_id")
            .trim()
            .notEmpty().withMessage("inventory Id is required"),

        body("inv_make")
            .trim()
            .escape()
            .notEmpty().withMessage("The make must not be empty").bail()
            .matches(/^[A-Za-z]+(\s[A-Za-z]+)*$/).withMessage("Only letters, spaces, ")
            .isLength({ min: 3 }).withMessage("min 3 chars"),
        
        body("inv_model")
            .trim()
            .escape()
            .notEmpty().withMessage("The model must not be empty").bail()
            .matches(/^[A-Za-z]+(\s[A-Za-z]+)*$/).withMessage("Only letters, spaces, ")
            .isLength({ min: 3 }).withMessage("min 3 chars."),
        
        body("inv_description")
            .trim()
            .notEmpty().withMessage("The description must not be empty").bail()
            .isLength({ min: 5 }).withMessage("Description min 5 chars"),
        
        body("inv_image")
            .trim()
            .notEmpty().withMessage("The image path must not be empty").bail()
            .isLength({ min: 5 }).withMessage("The image path must be min 5 chars"),
        
        body("inv_thumbnail")
            .trim()
            .notEmpty().withMessage("The thumbnail path must not be empty").bail()
            .isLength({ min: 5 }).withMessage("The thumbnail path min 5 chars"),
        
        body("inv_price")
            .notEmpty().withMessage("The price must not be empty").bail()
            .isFloat({ min: 0.01, max: 999999 })
            .withMessage("Price must be a valid positive number"),
        
        body("inv_year")
            .trim()
            .notEmpty().withMessage("The year must not be empty").bail()
            .isInt({ min: 1800, max: 2050}).withMessage("The year must be min 4 digits"),
        
        body("inv_miles")
            .notEmpty().withMessage("The miles must not be empty").bail()
            .isInt({ min: 0, max: 999999 })
            .withMessage("Miles must be a valid number between 0 and 999999"),
        
        body("inv_color")
            .trim()
            .notEmpty().withMessage("The color must not be empty").bail()
            .isLength({ min: 2, max: 20}).withMessage("The color must be min 2 chars and max 20"),
    ]
}

/* ******************************
 * Check data and return errors or 
 * add the classification 
 * ***************************** */
validate.checkClassification = async (req, res, next) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()

        const { classification_name } = req.body

        return res.render("inventory/addClassification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name
        })
    }
    next()
}
/* ******************************
 * Check data and return errors or 
 * add the vehicle 
 * ***************************** */
validate.checkVehicle = async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let list_classification = await utilities.buildClassificationList(classification_id)

        const { classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color } = req.body

        return res.render("inventory/addVehicle", {
            title: "Add New Vehicle",
            nav,
            errors,
            list_classification,
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
    }
    next()
}

/* ******************************
 * Check inventory data to
 * update the vehicle 
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let list_classification = await utilities.buildClassificationList(classification_id)

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
            inv_color } = req.body

        return res.render("inventory/editVehicle", {
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            errors,
            list_classification,
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
    }
    next()
}

module.exports = validate