const pg = require('pg');
const config = require('config');

const pool = new pg.Pool({
    password : config.get("dbSettings.password"),
    database : config.get("dbSettings.database"),
    port : config.get("dbSettings.port"),
    user: config.get("dbSettings.user")
});

module.exports.getClient = () => {
    return client = new pg.Client({
        password : config.get("dbSettings.password"),
        database : config.get("dbSettings.database"),
        port : config.get("dbSettings.port"),
        user: config.get("dbSettings.user")
    })
}

module.exports.query = (text,params) => {
    return pool.query(text,params);
}