import JoinServerEvent from "./events/JoinServerEvent.mjs";
import CreateRoomEvent from "./events/CreateRoomEvent.mjs";
import JoinRoomEvent from "./events/JoinRoomEvent.mjs";
import RoomInfoEvent from "./events/RoomInfoEvent.mjs";
import SelectCardEvent from "./events/SelectCardEvent.mjs";
import ResetPointsEvent from "./events/ResetPointsEvent.mjs";
import ShowPointsEvent from "./events/ShowPointsEvent.mjs";
import RefreshEvent from "./events/RefreshEvent.mjs";
import VoterEvent from "./events/VoterEvent.mjs";

export default class SocketConnection {
    io = null;
    events = null;
    appData = null;
    tools = null;
    constructor(io, appData, tools) {
        this.io = io;
        this.appData = appData;
        this.tools = tools;
        this.events = [
            new JoinServerEvent(this.appData),
            new CreateRoomEvent(this.appData),
            new JoinRoomEvent(this.appData),
            new RoomInfoEvent(this.appData),
            new SelectCardEvent(this.appData, this.tools),
            new ResetPointsEvent(this.appData, this.tools),
            new ShowPointsEvent(this.appData),
            new RefreshEvent(this.appData, this.tools),
            new VoterEvent(this.appData, this.tools),
        ]
        this.io.on('connection', (socket) => {
            this.events.map(event => event.listen(socket, this.io));
        });
    }

}