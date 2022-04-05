import mongoose from "mongoose";
var Schema = mongoose.Schema;

// const timings = new Schema({
//     start: Number,
//     end: Number
// });

// const nugget = new Schema({
//     status: {
//         type: Number,
//         default: 0
//     },
//     id : Number,
//     name: String,
//     timings: [timings],
//     video_edited_url : String
   
// });

// const nuggets = new Schema({
//     nugget
// });



const projectSchema = new Schema({
    name : String,
    thumb_url : String,
    status : Number,
    // nuggets : nuggets,
    nuggets : { 
        type : Array , 
        "default" : []
    },
    tags: { 
        type : Array , 
        "default" : []
    },
    duration : Number,
    video_url : String,
    video_name : String,
    fav_status : Boolean,
    createdAt : {
        type: Date,
        default : new Date()
    }

})

const Project = mongoose.model('Project', projectSchema)


export default Project;