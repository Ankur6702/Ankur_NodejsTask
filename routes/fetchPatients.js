const { db } = require("../db");
const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');

router.get('/', fetchUser, async (req, res) => {
    const psyId = req.psy.id;
    
    try {
        // fetching patients of the psy
        let patients = `SELECT * FROM patient WHERE Psychiatrist_id = ${psyId}`;
        patients = await new Promise((resolve, reject) => {
            db.query(patients, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        });

        if(patients.length === 0) {
            return res.json({ status: 'error', message: "No patients found" });
        }

        return res.json({ status: 'success', message: "Patients fetched successfully", data: patients });

    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }

});

module.exports = router;