const { connectDB, db } = require("./db");
const express = require('express');
const multer = require('multer')
const bodyparser = require('body-parser');
const path = require('path')
const app = express();

//use express static folder
app.use(express.static("./upload"))

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
const port = process.env.PORT || 9999;

// Connecting to the database
connectDB();

// All routes
app.use('/api/registerPsy', require('./routes/regPsy'));
app.use('/api/registerPatient', require('./routes/regPatient'));
app.use('/api/fetchPatients', require('./routes/fetchPatients'));
app.use('/api/fetchDetails', require('./routes/fetchDetails'));


var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, __dirname + '/upload/images') 
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});

app.get('/', (req, res) => {
    res.send('<h1>Server is running</h1>');
});

app.get('/upload', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post("/", upload.single('image'), (req, res) => {
    let patientId = req.body.patient_id;
    if (!req.file) {
        console.log("No file upload");
    } else {
        // console.log(req.file.filename)
        var imgsrc = `http://127.0.0.1:${port}/images/` + req.file.filename
        var sql = `UPDATE patient SET Photo = '${imgsrc}' WHERE id = '${patientId}'`;
        db.query(sql, [imgsrc], (err, result) => {
            if (err) throw err
            // console.log("Image uploaded")
        })
        // res.send(imgsrc)
        res.send('Image Uploaded successfully. <a href="/upload">Click to go back.</a>')
    }
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});