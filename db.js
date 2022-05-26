const mysql = require('mysql');

const connectionURI = '#';

const db = mysql.createPool(connectionURI);

const connectDB = () => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log('Error connecting to db');
            return;
        }
        console.log('Connected to db');
        connection.release();
    });
}

module.exports = { db, connectDB }