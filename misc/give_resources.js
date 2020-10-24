const ServerTime = require('./server_time');
const bases = require('../models/buildings_bases.json');
const pool = require('../dbcontrol/index');

module.exports = async (playerObjectMines)=>{
    const {level_a,
        level_b,
        level_c,
        id
    } = playerObjectMines;

    const result = await pool.query("SELECT update_resources_t FROM account WHERE id = $1",[id]);
    const difference_adjusted = 1/*Math.floor((ServerTime.time - result.rows[0].update_resources_t)/60)*/;

    if(difference_adjusted) {
        const add_a = calculate(level_a,0);
        const add_b = calculate(level_b,1);
        const add_b = calculate(level_c,2);
        //here update all resources
        const result = await pool.query("UPDATE account SET update_resources_t = $1 WHERE id = $2",[ServerTime.time,id]);
    }
    else {
        //no tick processing when no resources will be given
        return false;
    }

    function calculate(level,type) {
        console.log(bases.objects[type].base_prod);
        return Math.floor(difference_adjusted)*level*bases.objects[type].base_prod;
    }

    
}

