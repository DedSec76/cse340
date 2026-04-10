const invModel = require("../models/inventory-model")
const revModel = require("../models/review-model")
const utilities = require("../utilities/")

revCont = {}

revCont.addReview = async function (req, res, next) {
    try {
        const { review_text, inv_id } = req.body
        const { account_id } = res.locals.accountData
        
        const resultReview = await revModel.addNewReview(review_text, inv_id, account_id)
        
        if(resultReview) {
            return res.redirect(`/inv/detail/${inv_id}`)
        } else {
            return res.redirect(`/inv/detail/${inv_id}`)
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}





module.exports = revCont