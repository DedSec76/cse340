const pool = require("../database/")

/*/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationid Error" + error)
    }
}

/* ***************************
 *  Get inventory items by inv_id
 * ************************** */
async function getVehicleByInventoryId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getinventoryid Error" + error)
    }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addNewClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification(classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        console.error("Add New Classi Error" + error)
    }
}

async function checkNameExists(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name=$1"
        const name = await pool.query(sql, [classification_name])
        return name.rowCount
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Add new vehicle
 * ************************** */
async function addNewVehicle({inv_make, 
                             inv_model,
                             inv_description,
                             inv_image,
                             inv_thumbnail,
                             inv_price,
                             inv_year,
                             inv_miles,
                             inv_color,
                             classification_id}) {
    try {
        const sql = `INSERT INTO inventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
                     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
        
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    } catch (error) {
        console.error("Error, Couldn't Add new vehicle")
    }
}

/* ***************************
 *  Update vehicle
 * ************************** */
async function updateVehicle({inv_id,
                             inv_make, 
                             inv_model,
                             inv_description,
                             inv_image,
                             inv_thumbnail,
                             inv_price,
                             inv_year,
                             inv_miles,
                             inv_color,
                             classification_id}) {
    try {
        const sql = `UPDATE inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`
        const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])

        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

module.exports = {getClassifications, 
                  getInventoryByClassificationId, 
                  getVehicleByInventoryId,
                  
                  addNewClassification,
                  checkNameExists,
                  addNewVehicle,
                
                  updateVehicle}

