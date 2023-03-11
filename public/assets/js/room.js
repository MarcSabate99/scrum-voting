const createRoomBtn = document.querySelector('#create_room');
const joinRoomBtn = document.querySelector('#join_room');
const notificationsPanel = document.querySelector('.notifications-panel');

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
if(typeof createRoomBtn !== "undefined" && createRoomBtn !== null) {
    createRoomBtn.addEventListener('click', function () {
        socket.emit('create room', createdRoom);
    });
}
if(typeof  joinRoomBtn !== "undefined" && joinRoomBtn !== null) {
    joinRoomBtn.addEventListener('click', function () {
        let roomNumberInput = document.querySelector('#room_numer');
        roomNumberInput.reportValidity();
        socket.emit('join room', roomNumberInput.value, getCookie('userName'));
    });
}

function createdRoom(roomNumber) {
    socket.emit('join room', roomNumber, getCookie('userName'));
}

function joinedRoom(roomData, socketId) {
    let room = roomData[0];
    createCookie('socketId', socketId, 1);
    window.location.replace('/room/' + room.roomNumber);
}

function checkErrorParams() {
    let room = params.room;
    if (room === null) {
        return;
    }

    if (room === "not_found") {
        const node = document.createElement("div");
        node.className = "alert alert-danger mt-4";
        node.textContent = 'Sala no encontrada';
        node.id = "notfound";
        notificationsPanel.append(node)
    }
}
socket.on('joined room', function(roomData, socketId) {
    joinedRoom(roomData, socketId)
});
checkErrorParams();
