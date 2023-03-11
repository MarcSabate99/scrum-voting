import Main from "./Main.mjs";
import RoomRouting from "./RoomRouting.mjs";

export default class RouterKernel {
    app = null;
    helpers = null;
    routes = [];

    constructor(app, helpers) {
        this.app = app;
        this.helpers = helpers;
        this.routes = [
            new Main(this.app, this.helpers),
            new RoomRouting(this.app, this.helpers)
        ];
    }

    init() {
        this.routes.map(r => r.init());
    }
}