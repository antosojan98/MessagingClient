﻿function sendMessage(apiUrl) {
    var sentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var messageContent = document.getElementById('message').value;
    var messageCategory = document.getElementById('category').value;
    var messageUser = document.getElementById('user').value;

    if (messageContent == null || messageContent == "" || messageCategory == null || messageCategory == "" || messageUser == null || messageUser == "") {
        alert("All fields need to be completed");
        return;
    }

    var url = "libApi/libSendMessage?SentTime=" + sentTime + "&Content=" + messageContent + "&MessageCategory=" + messageCategory + "&MessageUser=" + messageUser;
    fetch(url, { method: 'POST' });

    document.getElementById("serverForm").reset();
    alert("Message submitted")


    var connection = new signalR.HubConnectionBuilder().withUrl(apiUrl + "/messagingHub").build();
    connection.start().then(function () {
        // After connected
        connection.invoke("ReloadMessage", messageUser).catch(function (exception) {
            return console.error(exception.toString());
        });
    }).catch(function (exception) {
        return console.error(exception.toString());
    });
}

function categoryClickListeners() {
    let exp = document.getElementById("exports")
    let sys = document.getElementById("system")
    let wor = document.getElementById("work")
    let oth = document.getElementById("other")
    let category = document.getElementById("category")


    exp.addEventListener("click", function () {
        category.value = exp.value;
    });

    sys.addEventListener("click", function () {
        category.value = sys.value;
    });

    wor.addEventListener("click", function () {
        category.value = wor.value;
    });

    oth.addEventListener("click", function () {
        category.value = oth.value;
    });
}

function groupButtonClickListener() {
    btn = document.getElementById('head-btn');
    box = document.getElementById("groups-popup");

    let visible = false;
    btn.addEventListener("click", function () {
        if (!visible) {
            box.style.visibility = 'visible';
        }
        else {
            box.style.visibility = 'hidden';
        }
        visible = !visible;
    });
}

function groupAdd() {
    let groupItem = prompt("Please enter the group name", "name");

    if (groupItem != null) {
        addItemToGroup(groupItem);
    }
}

function addItemToGroup(groupItem) {
    let list = document.getElementById('groups-list');

    let newListItem = document.createElement('li');
    newListItem.innerHTML = groupItem;

    list.appendChild(newListItem);
}

function memberAdd() {
    let memberItem = prompt("Please enter member name", "name");
    if (memberAdd != null) {
        let list = document.getElementById('members-list');

        let newListItem = document.createElement('li');
        newListItem.innerHTML = memberItem;

        list.appendChild(newListItem);
    }
}

function groupsPopupInit() {
    let url = "libApi/libGetGroups";

    fetch(url)
        .then(res => res.json())
        .then(groups => {
            if (groups.length == 0) {
                // No groups
                addItemToGroup("No groups exist");
            } else {
                for (group of groups) {
                    addItemToGroup(group);
                }
            }
        });
}


categoryClickListeners();
groupButtonClickListener();

groupsPopupInit();