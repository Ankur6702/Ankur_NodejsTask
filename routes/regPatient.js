const { db } = require("../db");
const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const fetchUser = require('../middleware/fetchUser')

function validatePhonenumber(data) {
    var phoneno = /^\d{12}$/;
    if (phoneno.test(data)) {
        return true;
    }
    else {
        return false;
    }
}

function validatePassword(data) {
    var password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    if (password.test(data)) {
        return true;
    }
    else {
        return false;
    }
}

router.post('/', fetchUser, [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('address').isLength({ min: 10 }).withMessage('Address must be at least 10 characters long'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').not().isEmpty().withMessage('Password cannot be empty'),
], async (req, res) => {
    const psyId = req.psy.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ status: 'error', errors: errors.array(), message: "Name, Address, email password, and photo are mandatory. Phone number is optional to enter." });
    }

    const { name, address, email, password, phoneNumber, photo } = req.body;

    if (typeof phoneNumber != 'undefined') {
        if (phoneNumber.length !== 0 && validatePhonenumber(phoneNumber) === false) {
            return res.json({ status: 'error', message: "Phone number should be of 12 digits along with the country code" });
        }
    }

    if(validatePassword(password) === false) {
        return res.json({ status: 'error', message: "Password should be of 8 characters long and should be less than 16 characters. It should contain at least one uppercase, one lowercase, and one number" });
    }

    try {
        let patients = "SELECT * FROM patient";
        patients = await new Promise((resolve, reject) => {
            db.query(patients, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        });
        // console.log(patients);

        let exists = false;
        for (let i = 0; i < patients.length; i++) {
            if (patients[i].Name == name && patients[i].Address == address && patients[i].Psychiatrist_id == psyId) {
                exists = true;
                break;
            }
        }

        if (exists) {
            return res.json({ status: 'error', message: "Patient already exists" });
        }

        let totalRows = "SELECT COUNT(*) FROM patient";
        totalRows = await new Promise((resolve, reject) => {
            db.query(totalRows, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
        totalRows = totalRows[0]['COUNT(*)'];
        totalRows = parseInt(totalRows);
        totalRows = totalRows + 1;

        let insertPatient = `INSERT INTO patient (id, Name, Address, email, password, Phone_number, Photo, Psychiatrist_id) VALUES ('${totalRows}', '${name}', '${address}', '${email}', '${password}', '${phoneNumber}', '${photo}' , ${psyId})`;
        insertPatient = await new Promise((resolve, reject) => {
            db.query(insertPatient, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        });

        let updatePsy = `UPDATE psychiatrists SET NumberOfPatients = NumberOfPatients + 1 WHERE id = ${psyId}`;
        updatePsy = await new Promise((resolve, reject) => {
            db.query(updatePsy, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        });
        
        res.json({ status: 'success', message: 'Patient registered', insertPatient });

    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }

});

module.exports = router;