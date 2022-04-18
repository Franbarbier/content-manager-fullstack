import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

// import methodOverride from 'method-override'; //ver si se desinstala
// import fileUpload  from 'express-fileupload'; //ver si se desinstala
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
// import GridFsStorage from 'multer-gridfs-storage'; //ver si se desinstala


import projectsRoutes from './routes/projects.js';

const app = express();

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send({ "msg": "This has CORS enabled 🎈" })
})

app.use(cors({
    // origin: 'http://localhost:3000'
    origin: '*'
}));




// CONFIGURATION OF S3
aws.config.update({
    secretAccessKey: "5jD0MiudlyvXnc2fNBzpSOazb6BugrubpuFVKkkO",
    accessKeyId: "AKIASH5RS7HLRHZUIGHQ",
    region: 'sa-east-1'
});

// CREATE OBJECT FOR S3
const S3 = new aws.S3();
// CREATE MULTER FUNCTION FOR UPLOAD
var upload = multer({
    // CREATE MULTER-S3 FUNCTION FOR STORAGE
    storage: multerS3({
        s3: S3,
        // bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
        bucket: 'content-creator-1/videos',
        // META DATA FOR PUTTING FIELD NAME
        metadata: function (req, file, cb) {
            cb(null, { fieldName:  req.body.new_name });
        },
        // SET / MODIFY ORIGINAL FILE NAME
        key: function (req, file, cb) {
            cb(null,  req.body.new_name); //set unique file name if you wise using Date.toISOString()
        }
    })

    
});
  
app.post('/upload-video', upload.single('file'), function (req, res, next) {
    req.file.originalname = req.body.new_name
    res.send(req.file);
});

app.post('/upload-video-nugget', upload.single('file'), function (req, res, next) {
    req.file.originalname = req.body.new_name
    res.send(req.file);
});



var uploadThumb = multer({
    // CREATE MULTER-S3 FUNCTION FOR STORAGE
    storage: multerS3({
        s3: S3,
        // bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
        bucket: 'content-creator-1/thumbs',
        // META DATA FOR PUTTING FIELD NAME
        metadata: function (req, file, cb) {
            cb(null, { fieldName:  file.originalname });
        },
        // SET / MODIFY ORIGINAL FILE NAME
        key: function (req, file, cb) {
            cb(null,  file.originalname); //set unique file name if you wise using Date.toISOString()
        }
    })

});
  
app.post('/upload-thumb', uploadThumb.single('file'), function (req, res, next) {
    req.file.originalname = req.body.new_name
    res.send(req.file);
});

app.post('/delete-item', function (req, res ) {
    console.log(req.body)
    S3.deleteObject(
        {
            Bucket: 'content-creator-1',
            Key: req.body.video_key
        }, function(deleteErr, data) {
        if (deleteErr) {
            console.log("Error: " + deleteErr);
        }
        else {
            console.log('Successfully deleted the item');
        }
    });
    res.send(req.body);
});



app.use('/projects', projectsRoutes )

// All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

const CONNECTION_URL = 'mongodb+srv://micro-content:microcontent@cluster0.w4vwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

mongoose.connect( CONNECTION_URL, { useNewUrlParser : true, useUnifiedTopology : true } )
                    .then( ()=> app.listen( PORT , ()=> console.log(`Server runing on port: ${PORT}`) ))
                    .catch( (error)=> console.log( error.message ));

