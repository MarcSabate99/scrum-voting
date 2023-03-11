import RouterKernel from "./src/api/RouterKernel.mjs";
import Tools from "./src/utils/Tools.mjs";
import SocketConnection from "./src/socket/SocketConnection.mjs";

import express from 'express';
import http from 'http';
import path from 'path'
const app = express();
const server = http.createServer(app);
import {Server} from "socket.io";
const io = new Server(server);
app.use(express.static(path.dirname('server.js') + '/public'));


let users = [];
let rooms = {};

let appData = {
    users: users,
    rooms: rooms
};

let tools = new Tools();
new SocketConnection(io, appData, tools);
const helpers = {
    tools: tools,
    appData: appData
}

const router = new RouterKernel(app, helpers);
router.init();

server.listen(3000, () => {
    console.log('listening on *:3000');
});
