const express = require('express');
const autocatch = require('../misc/asyncautocatch');
const router = express.Router();
const pg = require('pg');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { query, getClient } = require('../dbcontrol/index');
const { query_id_by_username, create_new_user, create_user_account } = require('./query_strings/auth_qs.json');



/*
router.post('/test', autocatch(async (req,res) => {
    res.send(await query('SELECT NOW()'));
}));
*/

router.post('/login', autocatch(async (req, res) => {
    const result = await query(query_id_by_username, [req.body.username]);
    if (result.rows[0]) {
        const pw = result.rows[0].pw;
        if (pw === req.body.password) {
            const token = jwt.sign({
                "username": req.body.username,
                "id": result.rows[0].id
            },'abc');
            res.status(200).send(token);
        }
        else {
            res.status(401).send('Wrong username or password');
        }
    }
    else {
        res.status(401).send('Wrong username or password');
    }
}));
//NO AUTOCATCH FOR TRANSACTIONS
router.post('/register', async (req, res, next) => {
    try{
    const result = await query(query_id_by_username, [req.body.username]);
    if (result.rows[0]) {
        res.status(406).send('Username already exists');
    }
    else {
        const client = getClient();
        await client.connect();
        //TRANSACTION START
        await client.query('BEGIN');
        await client.query(create_new_user,[req.body.username,req.body.pw,req.body.access_level]);
        const {rows} = await client.query('SELECT lastval()');
        console.log(rows[0].lastval);
        await client.query(create_user_account,[rows[0].lastval,req.body.nickname]);
        await client.query('COMMIT');
        
        res.status(200).send('Insert succesful');
    }
    }
    catch(exc) {
        await client.query('ROLLBACK');
        next(exc);
    }
    finally {
        await client.end();
    }
});

module.exports = router;