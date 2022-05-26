const { db } = require("../db");
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {    
    try {
        let sql = "SELECT CONCAT(FirstName, ' ', LastName) AS PsychiatristName, Hospital, NumberOfPatients, token FROM psychiatrists";
        sql = await new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        res.json({ status: 'success', message: 'Details fetched successfully', data: sql });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

module.exports = router;