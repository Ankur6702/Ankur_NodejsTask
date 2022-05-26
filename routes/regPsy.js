const { db } = require("../db");
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');

const JWT_SECRET = "#";

function validatePhonenumber(data) {
    var phoneno = /^\d{12}$/;
    if (phoneno.test(data)) {
        return true;
    }
    else {
        return false;
    }
}

function validatePincode(data) {
    var pincode = /^\d{6}$/;
    if (pincode.test(data)) {
        return true;
    }
    else {
        return false;
    }
}

const states = [
    "andhra pradesh",
    "arunachal pradesh",
    "assam",
    "bihar",
    "chhattisgarh",
    "goa",
    "gujarat",
    "haryana",
    "himachal pradesh",
    "jharkhand",
    "karnataka",
    "kerala",
    "madhya pradesh",
    "maharashtra",
    "manipur",
    "meghalaya",
    "mizoram",
    "nagaland",
    "odisha",
    "punjab",
    "rajasthan",
    "sikkim",
    "tamil nadu",
    "telangana",
    "tripura",
    "uttarakhand",
    "uttar pradesh",
    "west bengal",
];

function validateState(state) {
    state = state.toLowerCase();
    if (states.includes(state)) {
        return true;
    } else {
        return false;
    }
}

router.post('/', [
    body('firstName').isLength({ min: 3, max: 20 }).withMessage('First Name must be at least 3 characters long'),
    body('lastName').isLength({ min: 3, max: 20 }).withMessage('Last Name must be at least 3 characters long'),
    body('hospital').isLength({ min: 3 }).withMessage('Hospital Name must be at least 3 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ status: 'error', errors: errors.array(), message: "firstName, lastName and hospital name are mandatory. Phone number, pincode and state are optional to enter." });
    }

    const { firstName, lastName, hospital, phoneNumber, pincode, state } = req.body;

    if (typeof phoneNumber != 'undefined') {
        if (phoneNumber.length !== 0 && validatePhonenumber(phoneNumber) === false) {
            return res.json({ status: 'error', message: "Phone number should be of 12 digits along with the country code" });
        }
    }

    if (typeof pincode != 'undefined') {
        if (pincode.length !== 0 && validatePincode(pincode) === false) {
            return res.json({ status: 'error', message: "Pincode should be of 6 digits" });
        }
    }

    if (typeof state != 'undefined') {
        if (state.length != 0 && validateState(state) === false) {
            return res.json({ status: 'error', message: "State should be Valid" });
        }
    }

    try {
        let psy = "SELECT * FROM psychiatrists";
        psy = await new Promise((resolve, reject) => {
            db.query(psy, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })

        let exists = false;
        for (let i = 0; i < psy.length; i++) {
            if (psy[i].FirstName == firstName && psy[i].LastName == lastName && psy[i].Hospital == hospital) {
                exists = true;
                break;
            }
        }

        if (exists) {
            return res.json({ status: 'error', message: "Psychiatrist already exists" });
        }

        let totalRows = "SELECT COUNT(*) FROM psychiatrists";
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

        psy = `INSERT INTO psychiatrists (id, FirstName, LastName, Hospital, Phone_number, Pincode, State) VALUES ('${totalRows}', '${firstName}', '${lastName}', '${hospital}', '${phoneNumber}', '${pincode}', '${state}')`;
        psy = await new Promise((resolve, reject) => {
            db.query(psy, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })


        const token = jwt.sign({ id: totalRows }, JWT_SECRET);
        // Store token in the database
        let updateToken = `UPDATE psychiatrists SET token = '${token}' WHERE id = '${totalRows}'`;
        updateToken =  await new Promise((resolve, reject) => {
            db.query(updateToken, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })

        res.json({ status: 'success', message: 'Psychiatrist registered', token });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

module.exports = router;