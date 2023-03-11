export default class SelectCardEvent {
    appData = null;
    tools = null;
    constructor(appData, tools) {
        this.appData = appData;
        this.tools = tools;
    }
    listen(socket, io) {
        socket.on('selected point', (socketId, points, roomNumber) => {
            if(typeof this.appData.rooms[roomNumber] !== "undefined" &&
                this.appData.rooms[roomNumber][0].miniCards) {
                for(let i = 0; i < this.appData.rooms[roomNumber][0].miniCards.length; i++) {
                    let miniCard = this.appData.rooms[roomNumber][0].miniCards[i];
                    if(miniCard[socketId]) {
                        this.appData.rooms[roomNumber][0].miniCards[i][socketId].value = points;
                    }
                }
            }
            socket.join(roomNumber);
            io.to(roomNumber).emit('update points',  this.tools.getVotes(this.appData.rooms[roomNumber][0].miniCards));
        });
    }
}