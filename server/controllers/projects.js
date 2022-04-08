import Project from "../models/project.js";

export const getProjects = async (req, res) => {
 
    try {
        const projects = await Project.find()
        console.log(projects)
        // const projects = await  Project.remove({})
        res.status(200).json(projects)
    } catch (error) {
        res.status(404).json({message : error.message})
    }
}

export const createProject = async(req, res) =>{

    const project = req.body;
    const newProject = new Project(project);

    try{
        await newProject.save();
        res.status(201).json(newProject)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const deleteProject = async (req, res)=>{
    const id = req.params.id;
    await Project.findByIdAndRemove(id)
    res.json({message: 'Project deleted succesfully', id: id})
}