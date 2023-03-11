export default class ResetPointsEvent {
    appData = null;
    tools = null;
    constructor(appData, tools) {
        this.appData = appData;
        this.tools = tools;
    }
    listen(socket, io) {
        socket.on('reset points', (roomNumber) => {
            if(this.appData.rooms[roomNumber][0].miniCards) {
                let cards = this.appData.rooms[roomNumber][0].miniCards;
                let keys = Object.keys(cards);
                for(let k = 0; k < keys.length; k++) {
                    let sessionIds = Object.keys(cards[k]);
                    for(let i = 0; i < sessionIds.length; i++) {
                        this.appData.rooms[roomNumber][0].miniCards[k][sessionIds[i]].value = '?';
                    }
                }
                this.appData.rooms[roomNumber].showPoints = false;
            }
            socket.join(roomNumber);
            io.to(roomNumber).emit("refresh room", this.appData.rooms[roomNumber][0].miniCards, this.tools.getVotes(this.appData.rooms[roomNumber][0].miniCards));
        });
    }
}