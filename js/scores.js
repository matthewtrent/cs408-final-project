window.onload = loaded;

/**
 * Simple Function that will be run when the browser is finished loading.
 */
function loaded() {
    document.getElementById("submit-item").onclick = search;
    loadData();
}


var loadedData = [];

/**
 * Clears the table of the data then sends a request to the AWS server to get data
 * When retrieved calls addToTable()
 */
function loadData() {
    //Clear Existing Table
    clearTable();

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

function addToTable(response) {
    let table = document.getElementById("db_table");
    for(let i = 0; i < response.length; i++) {
        var row = table.insertRow(i + 1);

        var rowName = row.insertCell(0);
        var rowScore = row.insertCell(1);

        // Add some text to the new cells:
        rowName.innerHTML = response[i].name;
        rowScore.innerHTML = response[i].score;  
    }   
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

