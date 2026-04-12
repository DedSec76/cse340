const pool = require('../database/')

async function getReviewById(review_id) {
    try {
        const data = await pool.query(`SELECT r.review_id, r.review_text, r.review_date,
                                              r.inv_id, r.account_id, i.inv_make, i.inv_model, i.inv_year
                                       FROM review AS r
                                            JOIN inventory AS i
                                            ON r.inv_id = i.inv_id 
                                       WHERE review_id = $1`, 
                                       [review_id])
        return data.rows[0]
    } catch (error) {
        console.error(error)
    }
    
}

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

async function getReviewByAccountId(account_id) {
    try {
        const data = await pool.query(`SELECT r.review_id, r.review_text, r.review_date,
                                        r.inv_id, r.account_id, i.inv_year, i.inv_make, i.inv_model 
                                        FROM review AS r
                                        JOIN inventory AS i
                                        ON r.inv_id = i.inv_id
                                        WHERE r.account_id = $1
                                        ORDER BY r.review_date DESC`, 
                    [account_id])
        return data.rows
    } catch (error) {
        console.error('Error get review by id: ' + error)
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

async function updateReview(review_text, review_id) {
    try {
        const data = await pool.query(`UPDATE review
                                       SET review_text = $1
                                       WHERE review_id = $2 RETURNING *`,
                    [review_text, review_id])
        return data.rows[0]
    } catch (error) {
        console.error(error)
    }
}

async function deleteReview(review_id) {
    try {
        const data = await pool.query(`DELETE 
                                       FROM review
                                       WHERE review_id = $1`,
                    [review_id])
        return data
    } catch (error) {
        console.error(error)
    }
}

module.exports = { getReviewById, 
                   getReviewByInventory, 
                   getReviewByAccountId, 
                   addNewReview,
                   updateReview,
                   deleteReview  } 