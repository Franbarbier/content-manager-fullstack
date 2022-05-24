import mongoose from "mongoose";
var Schema = mongoose.Schema;



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