export default class RoomRouting {
    app = null;
    helpers = null;

    constructor(app, helpers) {
        this.app = app;
        this.helpers = helpers;
    }

    init() {
        this.app.get('/room/:roomNumber', (req, res) => {
            const roomId = req.params.roomNumber;
            if(this.helpers.appData.rooms[roomId]) {
                res.sendFile(this.helpers.tools.ROOT_PATH + '/views/room.html');
            } else {
                res.redirect('/home?room=not_found');
            }
        });
        this.app.get('/room', (req, res) => {
            res.sendFile(this.helpers.tools.ROOT_PATH + '/views/room.html');

        });
    }
}