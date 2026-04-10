const pool = require('../database/')

async function getReviewByInventory(inv_id) {
    try {
        const data = await pool.query(`SELECT r.review_id, r.review_text, r.review_date, r.inv_id, r.account_id, a.account_firstname, a.account_lastname
                                       FROM review AS r
                                        JOIN account AS a
                                        ON r.account_id = a.account_id
                                       WHERE r.inv_id = $1
                                       ORDER BY r.review_date DESC`, 
                                       [inv_id]
                    )
        return data.rows
    } catch (error) {
        console.error('Error get review by inv: ' + error)
    }
}

async function addNewReview(review_text, inv_id, account_id) {
    try {
        const sql = 'INSERT INTO review(review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *'
        return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
        console.error("Add New Review: " + error)
    }
}

module.exports = { getReviewByInventory, addNewReview } 