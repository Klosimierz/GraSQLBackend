const express = require('express');
const autocatch = require('../misc/asyncautocatch');
const { query, getClient } = require('../dbcontrol/index');
const model_calculations = require('../models/model_calculations');
const { build_buildings, query_resources, get_building, pay_in_resources } = require('../routes/query_strings/auth_qs.json');
const router = express.Router();
//NO AUTOCATCH FOR TRANSACTIONS
router.post('/object',async (req, res, next) => {
    const { id, type, tier, level } = req.body;
    const { resources_needed: { A_Cost, B_Cost, C_Cost }, time_needed } = model_calculations(type, tier, level);
    const { rows: [row] } = await query(query_resources, [id]);
    const { rows: [row_existing] } = await query(get_building, [id]);

    if (row_existing && row_existing.level >= level)
        res.send('Already built');

    else {
        //Technical requirements check TBD
        if (row.resource_a >= A_Cost && row.resource_b >= B_Cost && row.resource_c >= C_Cost) {
            const client = getClient();
            try {
            setTimeout(async () => {
                //START TRANS
                await client.connect();
                await client.query('BEGIN');
                await client.query(pay_in_resources,[A_Cost,B_Cost,C_Cost]);
                await client.query(build_buildings, [id, 'Skup gruzu', level]);
                await client.end();
                
            }, time_needed);

            res.status(200).send('Building scheduled');
            }
            catch(exc) {
                await client.query('ROLLBACK');
                next(exc);
            }
            finally {
               
            }
        }
        else {
            res.send('Insufficient resources');
        }
    }
});

module.exports = router;