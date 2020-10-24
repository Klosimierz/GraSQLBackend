const express = require('express');
const config = require('config');
const calc = require('./models/model_calculations');
const rccalc = require('./models/requirements_calculator');
const ServerTime = require('./misc/server_time');
const testing = require('./misc/give_resources');
const give_resources = require('./misc/give_resources');

const port = config.get('port');

const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Expose-Headers", "x-auth-token");
    next();
  });

app.use(express.json());
require('./routes/route_index')(app);

app.get('/',(req,res)=>{
    res.send({time: ServerTime.time});
    give_resources({
        level_a: 5,
        level_b: 5,
        level_c: 5,
        id: 100012
    });
})

app.use((err)=>{
    console.log('Something went wrong');
});

app.listen(port,(err,done)=>{
    console.log(`Listening on port ${port}`);
    ServerTime.startServerTime();
});

