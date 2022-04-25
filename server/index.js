import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import multer from 'multer'; //ver si se desinstala
// import multerS3 from 'multer-s3'; //ver si se desinstala
// import aws from 'aws-sdk'; //ver si se desinstala

import {Storage} from '@google-cloud/storage'

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


const gc = new Storage({
    keyFilename: "pivotal-leaf-190722-47aff9c9d936.json",
    projectId : "pivotal-leaf-190722"
})

const googleBucket = gc.bucket('microcontent-creator')

const multerVar = new multer({
    storage: multer.memoryStorage(),
  });
  
  // A bucket is a container for objects (files).
//   const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
  
  // Display a form for uploading files.
  app.get('/', (req, res) => {
    res.render('form.pug');
  });
  
  // Process the file upload and upload to Google Cloud Storage.
  app.post('/upload-video', multerVar.single('file'), (req, res, next) => {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }
    // req.file.originalname = req.body.new_name
    // Create a new blob in the bucket and upload the file data.
    const blob = googleBucket.file('videos/'+req.body.new_name);
    const blobStream = blob.createWriteStream();
    // console.log(blobStream)
    console.log('videos/'+req.body.new_name )
  
    blobStream.on('error', err => {
      next(err);
    });
  
    blobStream.on('finish', () => {
    //   // The public URL can be used to directly access the file via HTTP.
    //   const publicUrl = format(
    //     `https://storage.googleapis.com/${googleBucket.name}/${blob.name}`
    //   );
    
    res.status(200).send(req.body.new_name);
    });
    
    blobStream.end(req.file.buffer);
    res.status(200);
  });
  
// app.post('/upload-video', function (req, res) {
//     req.file.originalname = req.body.new_name
//     res.send(req.file);
// });

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

