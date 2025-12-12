window.onload = loaded;

let loadedData = [];

/**
 * Simple Function that will be run when the browser is finished loading.
 */
function loaded() {
    document.getElementById("load-data").onclick = loadData;
    document.getElementById("submit-item").onclick = sendData;
    document.getElementById("submit-item").onclick = search;
    loadData();
}


/**
 * Clears the table of the data then sends a request to the AWS server to get data
 * When retrieved calls addToTable()
 */
function loadData() {
    //Clear Existing Table
    const table = document.getElementById('db_table');
    while(table.rows[1]) {
        table.rows[1].remove();
    }


    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.addEventListener("load", function () {
        var data = xhr.response;
        data = data.sort((a,b) => b.score - a.score);
        addToTable(data);
        loadedData = data;
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
        "id": String(loadedData.length),
        "score": Number(document.getElementById("input_score").value),
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

        var rowName = row.insertCell(0);
        var rowScore = row.insertCell(1);
        var rowButton = row.insertCell(2);
        var rowID = row.insertCell(3);
        rowID.style.display = 'none';

        // Add some text to the new cells:
        rowName.innerHTML = response[i].name;
        rowScore.innerHTML = response[i].score;  
        rowButton.appendChild(removeRow);
        rowID.innerHTML = response[i].id;
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

    deleteData(wantedRow.cells[3].innerHTML);

    wantedRow.remove();
}

var searchedData = [];

function search() {
    clearTable();
    searchedData = [];
    const inputName = document.getElementById("input_name");
    var searchName = inputName.value;
    inputName.value = "";

    if(searchName == "") {
        loadData();
    }

    for(let i = 0; i < loadedData.length; i++) {
        if(loadedData[i].name == searchName) {
            searchedData.push(loadedData[i]);
        }
    }
    addToTable(searchedData);
}

function clearTable() {
    const table = document.getElementById('db_table');
    while(table.rows[1]) {
        table.rows[1].remove();
    }
}
