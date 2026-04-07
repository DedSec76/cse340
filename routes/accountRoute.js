// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to management view
router.get("/",
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildHome))

// Route to edit account
router.get("/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount))

// Route to logout user
router.get("/logout", utilities.logout)



// Process the registration data
router.post(
    "/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.loginAccount)
)

// Process for updating account data
router.post(
    "/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

// Process for updating password account
router.post(
    "/update-password",
    utilities.checkLogin,
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePassword,
    utilities.handleErrors(accountController.updatePassword)
)

module.exports = router

