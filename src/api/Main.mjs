
export default class Main {
    app = null;
    helpers = null;
    constructor(app, helpers) {
        this.app = app;
        this.helpers = helpers;
    }

    init() {
        this.app.get('/', (req, res) => {
            let userName = this.helpers.tools.getCookieFromRequest(req, 'userName');
            if (userName !== "") {
                res.redirect('/home');
            }else {
                res.sendFile(this.helpers.tools.ROOT_PATH + '/views/index.html');
            }
        });

        this.app.post('/home', (req, res) => {
            res.sendFile(this.helpers.tools.ROOT_PATH + '/views/home.html');
        });

        this.app.get('/home', (req, res) => {
            res.sendFile(this.helpers.tools.ROOT_PATH + '/views/home.html');
        });

    }

}