export default class RefreshEvent {
    appData = null;
    tools = null;
    constructor(appData, tools) {
        this.appData = appData;
        this.tools = tools;
    }
    listen(socket, io) {
        socket.on('refresh', (roomNumber, miniCards, socketId) => {
            if(typeof this.appData.rooms[roomNumber] !== "undefined" &&
                typeof this.appData.rooms[roomNumber][0].miniCards !== "undefined" &&
                this.appData.rooms[roomNumber][0].miniCards !== null) {
                let cards = this.appData.rooms[roomNumber][0].miniCards;
                if (typeof cards !== "undefined" && cards !== null) {
                    for (let i = 0; i < cards.length; i++) {
                        if(typeof this.appData.rooms[roomNumber][0].miniCards[i] !== "undefined" &&
                            this.appData.rooms[roomNumber][0].miniCards[i].hasOwnProperty(socketId)) {
                            this.appData.rooms[roomNumber][0].miniCards[i][socketId].socket = socketId;
                        }
                    }
                }
            }
            socket.join(roomNumber)
            io.to(roomNumber).emit("refresh room", this.appData.rooms[roomNumber][0].miniCards, this.tools.getVotes(this.appData.rooms[roomNumber][0].miniCards));
        });
    }
}