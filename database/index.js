const { query } = require("express-validator")
const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "development"
        ? { rejectUnauthorized: false }
        : false
    })

// Handling pool errors
pool.on("error", (err) => {
    console.error("Unexpected DB error:", err)
})
    
module.exports = {
    query: (text, params) => {
        return pool.query(text, params)
    }
}

