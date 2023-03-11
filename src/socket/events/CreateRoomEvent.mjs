export default class CreateRoomEvent {
    appData = null;
    constructor(appData) {
        this.appData = appData;
    }
    listen(socket, io){
        socket.on('create room',(callback) => {
            const keys = Object.keys(this.appData.rooms);
            let nextRoomNumber = null;
            if(keys.length){
                const maxRoomNumber = Math.max(keys.map(key => parseInt(key, 10)));
                nextRoomNumber = maxRoomNumber + 1;
            } else {
                nextRoomNumber = 1;
            }
            this.appData.rooms[nextRoomNumber] = [
                {
                    creator: socket.id,
                    users: [],
                    roomNumber: nextRoomNumber,
                    miniCards: []
                }
            ];
            callback(nextRoomNumber);
        });
    }
}