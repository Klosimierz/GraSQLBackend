const express = require('express');
const { query, getClient } = require('../dbcontrol/index');
const model_calculations = require('../models/model_calculations');
const requirements_calculations = require('../models/requirements_calculator');
const { 
    build_buildings, 
    query_resources_and_lockup, 
    get_building, pay_in_resources, 
    lock_building, unlock_building, 
    get_buildings_all,
    alter_building_level } = require('../routes/query_strings/auth_qs.json');
const router = express.Router();
//NO AUTOCATCH FOR TRANSACTIONS
router.post('/object', async (req, res, next) => {
    const { id, tier, level } = req.body;
    const {
        resources_needed: { A_Cost, B_Cost, C_Cost },
        time_needed,
        name,
        tech_requirements,
        infrastructure_requirements } = model_calculations('B', tier, level);
    const { rows: [row] } = await query(query_resources_and_lockup, [id]);
    const { rows: [row_existing] } = await query(get_building, [id, name]);

    if (row_existing ? (row_existing.name === name && (row_existing.level != level-1)) : false)
        res.status(200).send('Not permitted');
    
    else if(row.building_scheduled != true){
        if (row.resource_a >= A_Cost && row.resource_b >= B_Cost && row.resource_c >= C_Cost) {
            //Here if for technical req
            //get technical requirements
            
            console.log(infrastructure_requirements);
            //Requirements are passed properly
            const client = getClient();
            await client.connect();
            const {rows} = await client.query(get_buildings_all, [id]);
            console.log(rows);
            await client.query(lock_building, [id]);

            if (row_existing ? (row_existing.name === name && row_existing.level < level) : false) {
                try {
                    setTimeout(async () => {
                        await client.query('BEGIN');
                        await client.query(pay_in_resources, [A_Cost, B_Cost, C_Cost, id]);
                        await client.query(alter_building_level, [level, id, name]);
                        await client.query(unlock_building, [id]);
                        await client.query('COMMIT');
                        await client.end();
                    }, time_needed);
                    res.status(200).send(`Building upgrade scheduled, TBD: ${time_needed / 1000}s`);
                }
                catch (exc) {
                    console.log('encountered an error');
                    await client.query('ROLLBACK');
                    await client.query(unlock_building, [id]);
                    await client.end();
                    next(exc);
                }
            }
            else {
                try {
                    setTimeout(async () => {
                        //START TRANS

                        await client.query('BEGIN');
                        await client.query(pay_in_resources, [A_Cost, B_Cost, C_Cost, id]);
                        await client.query(build_buildings, [id, name, level]);
                        await client.query(unlock_building, [id]);
                        await client.query('COMMIT');
                        await client.end();

                    }, time_needed);

                    res.status(200).send(`Building scheduled, TBD: ${time_needed / 1000}s`);
                }
                catch (exc) {
                    console.log('encountered an error');
                    await client.query('ROLLBACK');
                    await client.query(unlock_building, [id]);
                    await client.end();
                    next(exc);
                }
            }
        }
        else
            res.status(200).send('Insufficient resources');
    }
    else
        res.status(200).send('Queue busy');

});

module.exports = router;