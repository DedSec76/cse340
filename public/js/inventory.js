'use strict'

// Get a list of items in inventory based on the classification_id 
const classificationList = document.getElementById("classificationSelect")

classificationList.addEventListener("change", () => {
    let classification_id = classificationList.value
    let classIdURL = `/inv/getInventory/${classification_id}`

    fetch(classIdURL).then((response) => {
        if (response.ok) {
            return response.json()
        }
        throw Error("Network response was not OK")
    })
    .then((data) => {
        console.log(data)
        buildInventoryList(data);
    })
    .catch((error) => {
        console.error(`There was a problem: ${error.message}`)
    })
})

// Build inventory item into HTML table components
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay")

    // Set up the table labels
    inventoryDisplay.innerHTML = `<thead>
                                    <tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>
                                  </thead>
                                  <tbody>
                                    ${data.map(element => 
                                        `<tr><td>${element.inv_make} ${element.inv_model}</td>
                                            <td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>
                                            <td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>
                                        </tr>
                                        `
                                    ).join("")}
                                  </tbody>
                                  `
}

