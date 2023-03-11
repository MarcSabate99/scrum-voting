export default class RoomInfoEvent {
    appData = null;
    constructor(appData) {
        this.appData = appData;
    }

    listen(socket, io) {
        socket.on('room info', (roomNumber, callback) => {
            callback(this.appData.rooms[roomNumber]);
        });
    }


    getPoints(roomNumber) {
        let points = [];
        if(this.appData.rooms[roomNumber][0].miniCards) {
            let cards = this.appData.rooms[roomNumber][0].miniCards;
            let keys = Object.keys(cards);
            for(let k = 0; k < keys.length; k++) {
                let sessionIds = Object.keys(cards[k]);
                for(let i = 0; i < sessionIds.length; i++) {
                    points.push(this.appData.rooms[roomNumber][0].miniCards[k][sessionIds[i]].value);
                }
            }
        }
        return points;
    }
}