const { times } = require("lodash");

module.exports = class {
    static time = 0;

    static startServerTime() {
        setInterval(()=>{
            this.time += 1;
        },1000);
    };
    get serverTime() {
        return this.time;
    };
}

