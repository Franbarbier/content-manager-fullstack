import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

// import methodOverride from 'method-override'; //ver si se desinstala
// import fileUpload  from 'express-fileupload'; //ver si se desinstala
import multer from 'multer';
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
    origin: 'https://content-manager-back.herokuapp.com/'
}));



var storage = multer.diskStorage({

        destination : (req, file, cb) =>{
            cb( null, 'public/')
        },
        filename : (req, file, cb) =>{
            cb( null, req.body.new_name)
        }
})
const uploadVideo = multer({ storage })

app.use('/upload-video', uploadVideo.single("file") , (req, res)=>{
    req.file.originalname = req.body.new_name
    return res.status(200).send(req.file)
} )


var storageThumb = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb( null, 'public')
    },
    filename : (req, file, cb) =>{
        cb( null, file.originalname)
    }
})

const uploadThumb = multer({ storageThumb })
app.use('/upload-thumb', uploadThumb.single("file") , (req, res)=>{
    return res.status(200).send(req.file)
} )


const uploadVideoNugget = multer({ storage })

app.use('/upload-video-nugget', uploadVideoNugget.single("file") , (req, res)=>{
    req.file.originalname = req.body.new_name
    return res.status(200).send(req.file)
} )


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

