export default class JoinServerEvent {
    appData = null;
    constructor(appData) {
        this.appData = appData;
    }

    listen(socket, io){
        socket.on('join server', (userName) => {
            const user = {
                userName,
                id: socket.id
            };
            this.appData.users.push(user);
        });
    }
}