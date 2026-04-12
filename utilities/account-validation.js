const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty().withMessage("Firstname is required.").bail()
            .isLength({ min: 2}).withMessage("Please provide a valid first name."), // on error this message is sent.

        // lastname is requiered and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty().withMessage("Lastname is required.").bail()
            .isLength({ min: 2 }).withMessage("Please provide a valid last name."),

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty().withMessage("Password is required.").bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
 validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists) {
                    throw new Error("Email doesn't exist. Please enter a valid email")
                }
            }),
        body("account_password")
            .trim()
            .notEmpty().withMessage("Password is required").bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Incorrect password. Please try again")
    ]
}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty().withMessage("Firstname is required.").bail()
            .isLength({ min: 2}).withMessage("Please provide a valid first name."), // on error this message is sent.

        // lastname is requiered and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty().withMessage("Lastname is required.").bail()
            .isLength({ min: 2 }).withMessage("Please provide a valid last name."),

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
    ]
}

/*  **********************************
 *  Account update data 
 *  validation rules
 * ********************************* */
validate.updatePasswordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty().withMessage("Password is required.").bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to log in
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()

        res.render("account/edit", {
            title: "Edit Account",
            nav,
            errors,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
        return
    }
    next()
}

validate.checkUpdatePassword = async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()

        res.render("/account/edit", {
            title: "Edit Account",
            nav,
            errors
        })
        return
    }
    next()
}

module.exports = validate

