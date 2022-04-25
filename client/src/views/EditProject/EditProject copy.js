import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';

import VideoEditor from '../../Video_Editor/VideoEditor';
import NuggetProgress from '../../components/NuggetTab/NuggetProgress/NuggetProgress';
import { useParams } from "react-router-dom";

import ModalInfoNugget from '../../components/ModalInfoNugget/ModalInfoNugget';

import { editProject } from '../../actions/projects';

// import videoSrc from '../../../server/public/nugget1-625045231c1087452aae3d68-screen-capture (10).mp4';

import './EditProject.css';
import NuggetTab from '../../components/NuggetTab/NuggetTab';
import AddTag from '../../components/AddTag/AddTag';
import { serverEndpoint } from '../../globals';


const EditProject = () => {
 
  const [saved, setSaved] = useState(0)
  const [newId, setNewId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [nuggets, setNuggets] = useState([])
  const [tags, setTags] = useState([])
  const [nuggetCounter, setNuggetCounter] = useState(1)
  const [activeNugget, setActiveNugget] = useState(1)
  const [renderInfoNugget, setRenderInfoNugget] = useState(false)
  const [progress, setProgress] = useState()
  const [primeraVez, setPrimeraVez] = useState(true)

  const { id } = useParams();

  const projects = useSelector(state => state?.projects)
  const project = projects.filter((proyecto)=>proyecto._id === id)[0]

  const [projectData, setProjectData] = useState()

  useEffect(()=> {
    setProjectData(project)
  }, [project])
  

  function render(){
  
      return  <div id="EditProject-view">
                <div id="col-vid">
                  <div id="project-info">
                    <input className='nombre-proyecto' defaultValue={projectData?.name} />
                    <button id="save-project" > {loading ? "GUARDANDO" : projectData ? "GUARDAR CAMBIOS" : "CREAR PROYECTO"}</button>
                  </div>
                    <AddTag setProjectData={setProjectData} projectData={projectData} prevTags={tags} />
                    {/* <VideoEditor projectData={projectData} video_url={projectData?._id+'-'+projectData?.video_url} getTotalDuration={getTotalDuration} saved={saved} newId={newId} saveLoader={saveLoader} setVideoURL={setVideoURL} getThumbURL={getThumbURL} activeNugget={ nuggets.filter(nugget => nugget.id == activeNugget) } recordTimings={recordTimings} setCorteInfo={setCorteInfo} parentCallback={handleCallback} /> */}
                    
                </div>
                
                <div id="col-nuggets">
                  <ul id="nuggets-cont">
                      {projectData?.nuggets.length > 0 &&
                        projectData.nuggets.map((nugget, index)=>(
                          <NuggetTab project_id={projectData._id} setRenderInfoNugget={setRenderInfoNugget} nuggets={projectData?.nuggets} setNuggets={setNuggets} activeNugget={activeNugget} setActiveNugget={setActiveNugget} nugget={nugget} index={index} />
                        ))
                        }
                  </ul>
                  <button id="AddNugget">Agregar nugget</button>
                </div>
                {renderInfoNugget &&
                  <ModalInfoNugget setRenderInfoNugget={setRenderInfoNugget} />
                }
              </div>

  }
       
       
       return ( render() )
}




export default EditProject;
