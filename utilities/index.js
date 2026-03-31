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
                                    <select name="classification_id" id="classification_id" required>
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

module.exports = Util