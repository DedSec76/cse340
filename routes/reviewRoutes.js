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
router.get("/edit/:reviewId",
    utilities.checkLogin,
    utilities.handleErrors(revController.buildViewUpdate))

router.get("/delete/:reviewId",
    utilities.checkLogin,
    utilities.handleErrors(revController.buildViewDelete))


// Post Reviews
// Create
router.post("/create",
    utilities.checkLogin,
    reviewValidate.addReviewRules(),
    reviewValidate.checkAddReview,
    utilities.handleErrors(revController.addReview))

// Update
router.post("/edit",
    utilities.checkLogin,
    reviewValidate.addReviewRules(),
    reviewValidate.checkUpdateReview,
    utilities.handleErrors(revController.updateReview))

// Delete
router.post("/delete",
    utilities.checkLogin,
    reviewValidate.addReviewRules(),
    //reviewValidate.checkDeleteReview,
    utilities.handleErrors(revController.deleteReview))


module.exports = router
