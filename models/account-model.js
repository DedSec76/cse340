const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Update account
* *************************** */
async function updateAccount({account_firstname, account_lastname, account_email, account_password, account_id}) {
    try {
        const sql = 'UPDATE account SET account_firstname = COALESCE($1, account_firstname), account_lastname = COALESCE($2, account_lastname), account_email = COALESCE($3, account_email), account_password = COALESCE($4, account_password) WHERE account_id = $5 RETURNING *'
        const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password, account_id])
        return data.rows[0]
    } catch (error) {
        console.error("Error Update: " + error)
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM public.account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1"
        const account = await pool.query(sql, [account_email])
        return account.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

module.exports = { registerAccount, updateAccount, checkExistingEmail, getAccountByEmail }