const invModel = require("../models/inventory-model")
const revModel = require("../models/review-model")
const utilities = require("../utilities/")

revCont = {}

revCont.buildViewUpdate = async function (req, res, next) {
    const nav = await utilities.getNav()

    const reviewId = parseInt(req.params.reviewId) 
    const reviews = await revModel.getReviewById(reviewId)
    
    const { review_id, review_text, review_date, inv_make, inv_model, inv_year } = reviews

    const newDate = utilities.formatDate(review_date)
    
    res.render("review/edit", {
        title: `Edit ${inv_year} ${inv_make} ${inv_model} Review`,
        nav,
        errors: null,
        review_id,
        review_text,
        newDate,
    })
}

revCont.buildViewDelete = async function (req, res, next) {
    const nav = await utilities.getNav()

    const reviewId = parseInt(req.params.reviewId) 
    const reviews = await revModel.getReviewById(reviewId)
    
    const { review_id, review_text, review_date, inv_make, inv_model, inv_year } = reviews

    const newDate = utilities.formatDate(review_date)
    
    res.render("review/delete", {
        title: `Delete ${inv_year} ${inv_make} ${inv_model} Review`,
        nav,
        errors: null,
        review_id,
        review_text,
        newDate,
    })
}

revCont.addReview = async function (req, res, next) {
    try {
        const { review_text, inv_id } = req.body
        const { account_id } = res.locals.accountData
        
        const resultReview = await revModel.addNewReview(review_text, inv_id, account_id)
        
        if(resultReview) {
            return res.redirect(`/inv/detail/${inv_id}`)
        } else {
            req.flash("notice", "Your review couldn't be added")
            return res.redirect(`/inv/detail/${inv_id}`)
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

revCont.updateReview = async function (req, res, next) {
    try {
        const { review_text, review_id } = req.body
        const updateResult = await revModel.updateReview(review_text, review_id)

        if (updateResult) {
            req.flash("success", "The review has been successfully edited.")
            return res.redirect('/account/')
        } else {
            return res.redirect('/reviews/edit')
        }

    } catch (error) {
        console.error(error)
        next(error)
    }
}

revCont.deleteReview = async function (req, res, next) {
    try {
        const { review_id } = req.body
        
        const deleteResult = await revModel.deleteReview(review_id)
        
        if (deleteResult) {
            req.flash("success", "The review has been deleted.")
            return res.redirect('/account/')
        } else {
            req.flash("error", "Something went wrong when trying to delete.")
            return res.redirect('/reviews/edit')
        }

    } catch (error) {
        console.error(error)
        next(error)
    }
}





module.exports = revCont