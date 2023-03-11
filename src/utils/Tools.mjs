import path from "path";

export default class Tools {
    ROOT_PATH = path.resolve();

    getCookieFromRequest(req, name) {
        let cookie = req.headers.cookie;
        if(typeof cookie === "undefined"){
            return "";
        }
        let ca = cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length).split('=')[1];
            }
        }
        return "";
    }

    getVotes(miniCards) {
        if(!miniCards) {
            return [0, 0];
        }

        let totalVotes = 0;
        let totalValidVotes = 0;
        for(let i = 0; i < miniCards.length; i++) {
            let socketId = Object.keys(miniCards[i]);
            if(miniCards[i].hasOwnProperty(socketId[0]) &&
                miniCards[i][socketId[0]].hasOwnProperty('value') &&
                miniCards[i][socketId[0]].value !== null &&
                miniCards[i][socketId[0]].value !== '?') {

                totalValidVotes++;
            }
            if(miniCards[i][socketId[0]].voter === true){
                totalVotes++;
            }
        }

        return [totalVotes, totalValidVotes];
    }
}