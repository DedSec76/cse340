const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    try {
        let data = await invModel.getClassifications()
        let list = "<ul>"
        list += '<li><a href="/" title="Home page">Home</a></li>'
        data.rows.forEach(row => {
            list += "<li>"
            list += 
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
            list += "</li>"
        })
        list += "</ul>"
        return list

    } catch(error) {
        console.error(error)
        return "<ul><li>Error loading navigation</li></ul>"
    }
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/'+ vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a class="title_car" href="../../inv/detail/' + vehicle.inv_id +'" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span class="price_car">$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the single view HTML
* ************************************ */
Util.buildVehicleCard = async function (data) {
    return card = `<div class="card_vehicle">
                        <img src="${data.inv_image}" alt="image of ${data.inv_make} ${data.inv_model} vehicle with details for sale"/>

                        <div class="card_information">
                            <h1 class="title_car">${data.inv_year} ${data.inv_make} ${data.inv_model}</h1>
                            
                            <ul class="vehicle_details">
                                <li><strong>Make:</strong> ${data.inv_make}</li>
                                <li><strong>Model:</strong> ${data.inv_model}</li>
                                <li><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</li>
                                <li><strong>Color:</strong> ${data.inv_color}</li>
                                <li class="price_car">$${new Intl.NumberFormat('en-US').format(data.inv_price)}</li>

                            </ul>
                            <p>${data.inv_description}</p>
                        </div>
                    </div>
                    `
}

/* ************************
 * Build the list for the checkbox 
 * in the classification list.
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
    try {
        let data = await invModel.getClassifications()
        return classificationList = `
                                    <select name="classification_id" id="classificationSelect" required>
                                        <option selected value="" disabled>Choose a Classification</option>
                                        
                                        ${data.rows.map(item => 
                                            `<option value="${item.classification_id}" ${isSelected(item)}>
                                                ${item.classification_name}
                                             </option>`
                                        ).join("")}
                                    </select>
                                    `
        
        function isSelected(item) {
            if (classification_id != null &&
                classification_id == item.classification_id
            ) {
                return "selected"
            }
            return ""
        }
    } catch (error) {
        console.error(error)
        return "No data"
    }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if(err) {
                    req.flash("Please log in from checkToken")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
        })
    } else {
        res.locals.loggedin = 0
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if(res.locals.loggedin === 1) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

Util.isAdministrative = (req, res, next) => {
    const account_type = res.locals.accountData.account_type

    if(account_type == "Employee" ||
        account_type == "Admin"
    ) {
        next()
    } else {
        req.flash("notice", "Restricted area. Your current account doesn't have privileges.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 *  To Know if it is authenticated
 * ************************************ */
Util.checkAuth = (req, res, next) => {
    const token = req.cookies.jwt

    if(!token) {
        res.locals.loggedin = 0
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        res.locals.loggedin = 1
        res.locals.accountData = decoded
    } catch (error) {
        res.locals.loggedin = 0
        res.locals.accountData = null
    }
    next()
}
/* ****************************************
 *  Function to build screen name
 * ************************************ */
Util.buildScreenname = (data) => {
    if (!data) return ''

    const { account_firstname, account_lastname } = data

    if(account_firstname && account_lastname) {
        return account_firstname.charAt(0) + account_lastname
    }

    return 'Anonymous'
}


/* ****************************************
 *  Logout
 * ************************************ */
Util.logout = (req, res, next) => {
    if(req.cookies.jwt) {
        res.clearCookie("jwt")
        //res.redirect("/")
        return res.redirect("/")
    } else {
        next()
    }
}


module.exports = Util