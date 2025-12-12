window.onload = loaded;

/**
 * Simple Function that will be run when the browser is finished loading.
 */
function loaded() {
    document.getElementById("load-data").onclick = loadData;
    document.getElementById("submit-item").onclick = sendData;
}


/**
 * Clears the table of the data then sends a request to the AWS server to get data
 * When retrieved calls addToTable()
 */
function loadData() {
    //Clear Existing Table
    const table = document.getElementById('db_table');
    while(table.rows[1].cells[0].innerHTML != "...") {
        table.rows[1].remove();
    }


    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.addEventListener("load", function () {
        addToTable(xhr.response);
    });
    xhr.open("GET", "https://cfsl49smnb.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
}

/**
 * Sends the Delete request to AWS
 * @param {*} idValue the id of the given item to be deleted 
 */
function deleteData(idValue) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "https://cfsl49smnb.execute-api.us-east-2.amazonaws.com/items/" + idValue);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

/**
 * Gets the values from the expected Input tabs then sends to the server
 */
function sendData() {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://cfsl49smnb.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        "id": document.getElementById("input_id").value,
        "score": Number(document.getElementById("input_price").value),
        "name": document.getElementById("input_name").value
    }));

    xhr.addEventListener("load", loadData);
}

/**
 * Runs through all objects from the AWS server and then adds them to the table
 * @param {*} response an array of JSON objects that contains the AWS output
 */
function addToTable(response) {
    let table = document.getElementById("db_table");
    for(let i = 0; i < response.length; i++) {
        var row = table.insertRow(i + 1);

        var removeRow = document.createElement("BUTTON");
        removeRow.innerHTML = "Delete";
        removeRow.className = "btn-delete"
        removeRow.id = i + 1;
        removeRow.onclick = BtnDeleteRowClick;

        var rowID = row.insertCell(0);
        var rowName = row.insertCell(1);
        var rowPrice = row.insertCell(2);
        var rowButton = row.insertCell(3);

        // Add some text to the new cells:
        rowID.innerHTML = response[i].id;
        rowName.innerHTML = response[i].name;
        rowPrice.innerHTML = response[i].score;  
        rowButton.appendChild(removeRow);
    }

    
}

/**
 *  Used for when the delete button in the table is pressed 
 *  Finds the id of the row, deletes it and sends the request to the server to delete it
 */
function BtnDeleteRowClick() {
    let rowIndexToDelete = this.id;

    let table = document.getElementById("db_table");
    let wantedRow = table.rows[rowIndexToDelete];

    deleteData(wantedRow.cells[0].innerHTML);

    wantedRow.remove();
}


