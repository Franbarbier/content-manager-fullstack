import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import multer from 'multer'; //ver si se desinstala
// import multerS3 from 'multer-s3'; //ver si se desinstala
// import aws from 'aws-sdk'; //ver si se desinstala

import {Storage} from '@google-cloud/storage'

import userRoutes from './routes/users.js'
import projectsRoutes from './routes/projects.js';
import { verifyToken } from './auth.js';

const app = express();

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send({ "msg": "This has CORS enabled 🎈" })
})

// const bucket_name = 'content-creator'
const bucket_name = 'new-content-creator'


app.use(cors({
    // origin: 'http://localhost:3000'
    origin: '*'
}));


// const gc = new Storage({
//     keyFilename: "galvanized-yeti-350622-4ba49a223aa2.json",
//     projectId : "galvanized-yeti-350622"
// })

const gc = new Storage({
  keyFilename: "centering-river-351414-524ce47962b8.json",
  projectId : "centering-river-351414"
})

const googleBucket = gc.bucket(bucket_name)

const multerVar = new multer({
    storage: multer.memoryStorage(),
  });
  
// A bucket is a container for objects (files).
// const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
  
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
      res.status(200).send(req.body.new_name);
    });
    
    blobStream.end(req.file.buffer);
    res.status(200);
  });

  app.post('/upload-thumb', multerVar.single('file'), (req, res, next) => {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }
    // Create a new blob in the bucket and upload the file data.
    const blob = googleBucket.file('thumbs/'+req.file.originalname);
    const blobStream = blob.createWriteStream();
    console.log('thumbs/'+req.file.originalname )
  
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
  app.post('/delete-video', multerVar.single('file'), (req, res, next) => {

        async function deleteFile() {
          // Deletes the file from the bucket
          await gc.bucket(bucket_name).file(req.body.deleted_object).delete();

        }
    
        deleteFile().catch(console.error);
        res.status(200).send(req.body.deleted_object);

  });

app.post('/delete-item', multerVar.single('file'), (req, res, next) => {

  async function deleteFile() {
    // Deletes the file from the bucket
    await gc.bucket(bucket_name).file(req.body.item).delete();

  }
  console.log('deleted',req.body.item)

  deleteFile().catch(console.error);
  res.status(200).send(req.body);

});


app.use('/users', userRoutes)
app.use('/projects', projectsRoutes )



const CONNECTION_URL = 'mongodb+srv://micro-content:microcontent@cluster0.w4vwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;



mongoose.connect( CONNECTION_URL, { useNewUrlParser : true, useUnifiedTopology : true } )
                    .then( ()=> app.listen( PORT , ()=> console.log(`Server runing on port: ${PORT}`) ))
                    .catch( (error)=> console.log( error.message ));

