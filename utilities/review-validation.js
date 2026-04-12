const invModel = require("../models/inventory-model")
const revModel = require("../models/review-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.addReviewRules = () => {
    return [
        body("review_text")
            .trim()
            .notEmpty().withMessage("The description must not be empty").bail()
            .isLength({ min: 10, max: 800 }).withMessage("Description min 10 chars and max 800 characters"),
    ]
}

validate.checkAddReview = async(req, res, next) => {
    try {
        const { inv_id } = req.body
        
        const data = await invModel.getVehicleByInventoryId(inv_id)
        if (!data) {
            req.flash("error", "Vehicle not found. Couldn't added review.")
            return res.redirect('/')
        }

        const reviews = await revModel.getReviewByInventory(inv_id)

        const { inv_make, inv_model } = data
        const className = `${inv_make} ${inv_model}`

        const card = await utilities.buildVehicleCard(data)
        const nav = await utilities.getNav()
        const errors = validationResult(req)

        reviews.forEach(r => {
            r.screen_name = utilities.buildScreenname(r)
            r.review_date = utilities.formatDate(r.review_date)
        });

        const accountData = res.locals.accountData || null
        const screen_name = utilities.buildScreenname(accountData)

        if (!errors.isEmpty()) {
            return res.render("inventory/vehicle", {
                title: className,
                nav,
                errors,
                card,
                loggedin: res.locals.loggedin,
                reviews,
                inv_id,
                screen_name
            })
        }
        next()
    } catch(error) {
        console.error(error)
        next(error)
    }
}

validate.checkUpdateReview = async(req, res, next) => {
    try {
        const nav = await utilities.getNav()

        const { review_text, review_id } = req.body

        const review = await revModel.getReviewById(review_id)
        const { review_date, inv_make, inv_model, inv_year } = review
        
        const newDate = utilities.formatDate(review_date)
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.render("review/edit", {
                title: `Edit ${inv_year} ${inv_make} ${inv_model} Review`,
                nav,
                errors,
                newDate,
                review_text,
                review_id
            })
        }
        next()
    } catch(error) {
        console.error(error)
        next(error)
    }
}

module.exports = validate

      