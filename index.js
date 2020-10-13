const express = require('express');
const config = require('config');
const calc = require('./models/model_calculations');

const port = config.get('port');

const app = express();
app.use(express.json());
require('./routes/route_index')(app);

app.use((err)=>{
    console.log('Something went wrong');
});

app.listen(port,(err,done)=>{
    console.log(`Listening on port ${port}`);
});

