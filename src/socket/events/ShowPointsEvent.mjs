export default class ShowPointsEvent {
    appData = null;
    constructor(appData) {
        this.appData = appData;
    }
    listen(socket, io) {
        socket.on('show points', (roomNumber) => {
            let points = [];
            if(this.appData.rooms[roomNumber][0].miniCards) {
                let cards = this.appData.rooms[roomNumber][0].miniCards;
                let keys = Object.keys(cards);
                for(let k = 0; k < keys.length; k++) {
                    let sessionIds = Object.keys(cards[k]);
                    for(let i = 0; i < sessionIds.length; i++) {
                        if(this.appData.rooms[roomNumber][0].miniCards[k][sessionIds[i]].voter) {
                            points.push(this.appData.rooms[roomNumber][0].miniCards[k][sessionIds[i]].value);
                        }
                    }
                }
                this.appData.rooms[roomNumber].showPoints = true;
            }
            socket.join(roomNumber);
            io.to(roomNumber).emit('show points', points)
        });
    }
}