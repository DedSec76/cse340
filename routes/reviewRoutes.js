// Needed Resources
const express = require("express")
const router = new express.Router()
const revController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require('../utilities/review-validation')

/*  **********************************
  *  REVIEW ROUTES 
  * ********************************* */

// Get Reviews
//router.get("/detail/:invId", utilities.handleErrors(revController.buildReview))

// Post Reviews
router.post("/create",
    utilities.checkLogin,
    reviewValidate.addReviewRules(),
    reviewValidate.checkAddReview,
    utilities.handleErrors(revController.addReview))


module.exports = router
