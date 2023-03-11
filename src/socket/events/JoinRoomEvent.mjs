export default class JoinRoomEvent {
    appData = null;
    constructor(appData) {
        this.appData = appData;
    }
    listen(socket, io) {
        socket.on('join room', (roomNumber, userName) => {
            if(typeof this.appData.rooms[roomNumber] !== "undefined") {
                let user = {
                    name: userName,
                    id: socket.id
                }
                this.appData.rooms[roomNumber][0].users.push(user);
                let socketCurrent = socket.id;
                this.appData.rooms[roomNumber][0].miniCards.push(
                    {
                        [socketCurrent]:
                        {
                            "value": null,
                            "voter": true
                        }
                    }
                );
            }
            socket.join(roomNumber);
            socket.emit('joined room', this.appData.rooms[roomNumber], socket.id);
        });
    }
}