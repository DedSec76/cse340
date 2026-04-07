const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver Account home view
* *************************************** */
async function buildHome(req, res) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData

    res.render("account/", {
        title: "Account Management",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_type: accountData.account_type,
        account_id: accountData.account_id
    })
}

async function buildUpdateAccount(req, res) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData

    res.render("account/edit", {
        title: "Edit Account",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id
    })
}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword 
    try {
        // regular password and cost (salt is generate automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav
        })
    }

    const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)

    if (regResult) {
        req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`)

        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})

            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            
        return res.redirect("/account/")
        } else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email
            })
        }
    } catch(error) {
        console.error(error)
        throw new Error('Access Forbidden')
    }
}

async function updateAccount(req, res, next) {
    const { account_firstname, account_lastname, account_email} = req.body
    const account_id = res.locals.accountData.account_id
    const updateResult = await accountModel.updateAccount({account_firstname, account_lastname, account_email, account_id})
    
    if(updateResult) {
        const accessToken = jwt.sign({account_id, account_firstname, account_lastname, account_email, account_type: res.locals.accountData.account_type},
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: 3600 * 1000})
        
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        req.flash("notice", "Congratulation, your information has been updated.")
        return res.redirect("/account/")
        
    } else {
        return res.redirect("/account/update")
    }
}

async function updatePassword(req, res) {
    const { account_password, account_id } = req.body
    
    // Hash the password before storing
    let hashedPassword 
    try {
        // regular password and cost (salt is generate automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, The password could not be hashed')
        res.redirect("/account/update")
    }
    const updatePassword = await accountModel.updateAccount({account_password: hashedPassword, account_id})

    if (updatePassword) {
        req.flash("notice", "Congratulation, your password has been updated.")
        return res.redirect("/account/")

    } else {
        req.flash("notice", "Sorry, the password update failed.")
        return res.redirect("/account/update")
    }
}

module.exports = { buildHome, buildUpdateAccount, buildLogin, buildRegister, registerAccount, loginAccount, updateAccount, updatePassword }