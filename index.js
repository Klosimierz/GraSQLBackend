const express = require('express');
const config = require('config');
const calc = require('./models/model_calculations');
const rccalc = require('./models/requirements_calculator');

const port = config.get('port');

const app = express();
app.use(express.json());
require('./routes/route_index')(app);

app.get('/',(req,res)=>{
    res.send(req.body);
})

app.use((err)=>{
    console.log('Something went wrong');
});

app.listen(port,(err,done)=>{
    console.log(`Listening on port ${port}`);
});

