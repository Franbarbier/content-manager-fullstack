import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';

import VideoEditor from '../../Video_Editor/VideoEditor';
import NuggetProgress from '../../components/NuggetTab/NuggetProgress/NuggetProgress';
import { Redirect } from "react-router-dom";
import ModalInfoTag from '../../components/ModalInfoNugget/ModalInfoNugget';

import { createProject } from '../../actions/projects';

import './NewProject.css';
import NuggetTab from '../../components/NuggetTab/NuggetTab';
import AddTag from '../../components/AddTag/AddTag';
import { serverEndpoint } from '../../globals';
import Menu from '../../components/Menu/Menu';
import ModalNuggetNote from '../../components/ModalNuggetNote/ModalNuggetNote';


const NewProject = () => {

  const [projectData, setProjectData] = useState({
    nuggets :[],
    tags: []
  })
  const [saved, setSaved] = useState(0)
  const [newId, setNewId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [nuggets, setNuggets] = useState([])
  const [nuggetCounter, setNuggetCounter] = useState(1)
  const [activeNugget, setActiveNugget] = useState(0)
  const [renderInfoNugget, setRenderInfoNugget] = useState(false)
  const [renderNoteNugget, setRenderNoteNugget] = useState(false)
  const [progress, setProgress] = useState()

  
  const [timings, setTimings] = useState()
  
  const dispatch = useDispatch()

  function nuevo_nugget() {
    var newNugget = {};
    newNugget.id = nuggetCounter
    newNugget.nombre = 'Nombre del nugget'
    newNugget.timings = []
    newNugget.estado = 0
    setNuggets(nuggets => [...nuggets, newNugget])
    setNuggetCounter(nuggetCounter + 1)
    setActiveNugget(nuggetCounter)
  }

  function recordTimings(timing) {
    var oldState = nuggets
    let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget);
    let indexx = oldState.indexOf(activeNugg[0])

    oldState[indexx].timings = timing
    setNuggets(oldState)
    // console.log(oldState)
  }


  function setCorteInfo(index, value, type ){

    var oldState = nuggets
    let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget);
    let activeOne = oldState.indexOf(activeNugg[0])

    if (type == "descripcion") { oldState[activeOne].timings[index].descr = value }
    if (type == "titulo") { oldState[activeOne].timings[index].titulo = value }
  
    setNuggets(oldState)

  }

  function getNuggetInfo(activeNugget) {
    let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget);
    return activeNugg[0]
  }

  function handleCallback(childData) {
    if (childData && nuggets.length == 0 ) {
        nuevo_nugget()
    }
  }


  function setNuggetNote(nota){
    var oldState = nuggets
    let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget);
    let activeOne = oldState.indexOf(activeNugg[0])

    oldState[activeOne].nota = nota 
  
    setNuggets(oldState)
    setRenderNoteNugget(false)
  }


  function setLoadingProccess(prog){
    if (prog.toFixed(0) < 85 ) {
      setProgress( prog.toFixed(0) )
    } 
  }

  useEffect(()=>{
    console.log("El progreso: "+progress*1)
  },[progress])

  function saveLoader(estado, boolean, data ){
    if (boolean) {
      document.getElementById('save-project').classList.add("cargando");
      document.getElementById('save-project').innerHTML = "GUARDANDO";
    }else{
      document.getElementById('save-project').classList.remove("cargando")
      document.getElementById('save-project').innerHTML = "GUARDAR";
    }
    if (estado == "success") {
      alert('Todo joya rrope')
      setProgress(100)
      console.log(data.split('-')[0])
      // window.location.href = "localhost/project/"+data.split('-')[0];
      // window.location.href = "https://famous-malasada-c0ea7e.netlify.app/project/"+data.split('-')[0];
      window.location.href = "https://famous-malasada-c0ea7e.netlify.app";
      
    }
    if (estado == "error") {
      alert('Hubo un error al guardar el proyecto')

    }

  }
  function cambiarNombreProject(e) {
    setProjectData( { ...projectData, name: e.target.value } )
  }

  function setVideoURL(e) {
    setProjectData( { ...projectData, video_url: e } )
  }

  function getThumbURL(thumb_url) {

    function urltoFile(url, filename, mimeType){
      mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
      return (fetch(url)
          .then(function(res){return res.arrayBuffer();})
          .then(function(buf){return new File([buf], filename, {type:mimeType});})
      );
    }

    urltoFile(thumb_url, 'project-thumb.png')
    .then(function(file){
      setProjectData( { ...projectData, thumb_url: file.name  } )
    })
  }

  function uploadVideosNuggets(project_id){

    for (let index = 0; index < projectData.nuggets.length; index++) {
      const element = projectData.nuggets[index];
      
      if (element.video) {
          let file = element.video
          const data = new FormData()
          var new_name = 'nugget' + element.id + "-"+project_id +'-'+ file?.name
          data.append('new_name',new_name)
          data.append( 'file', file )
          

          axios.post(serverEndpoint+'upload-video', data, { 
                      
              onUploadProgress: (progressEvent) => {
                  const progressNugg = ( (progressEvent.loaded / progressEvent.total) * 100 ).toFixed();
              }

          } )
          .then((e)=>{
            console.log('el nugget video subido', e)
          })
          .catch( (e) =>{
              console.log('error:::', e.error)
          } )

        
      }
      
    }
  }

  async function saved_project(id){

    const onSuccess = () => {console.log('en teoria aca')}
    await uploadVideosNuggets(id) 
    onSuccess()
    
    setNewId(id)
    setTimeout(() => {
      setSaved(saved + 1)
    }, 350);
  }

  function save_project(){

    if (!projectData.thumb_url) {
      alert("Elige un thumbnail del proyecto")
      return false
    }
    setLoading(true)
    setProgress(0)
    dispatch(createProject(projectData)).then(
      (e)=> 
        saved_project(e._id).then(
          alert('Se guardó correctamente el proyecto')
        )
        

      ).catch( (e) =>{
        console.log('error:::', e.error)
        this.props.saveLoader("error",false)
        // this.props.saveLoader("success",false)

    } )

  }

  function getTotalDuration(duration){
    setProjectData( { ...projectData, duration: duration  } )
  }

  function progressUploadVideoNugget(progress, index){
    console.log(progress*1 , index)
  }
  useEffect(()=>{
    setProjectData( { ...projectData, nuggets: nuggets  } )
    console.log(nuggets)
  }, [nuggets])

  useEffect(()=>{
    setProjectData( { ...projectData, name: "Nuevo proyecto"  } )
  }, [])
  useEffect(()=>{
    console.log(projectData)
  })


  function render(){
      return  <div id="NewProject-view">
                <div id="col-vid">
                  <div className="progressBar" style={{'width': progress + "%" }}></div>
                  <div id="project-info">
                    <input className='nombre-proyecto' defaultValue='Nuevo proyecto' onChange={ (e) => { cambiarNombreProject(e) } } />
                    <button id="save-project" onClick={ () => { save_project() }}> {loading ? "GUARDANDO" : "CREAR PROYECTO"}</button>
                  </div>
                    <AddTag setProjectData={setProjectData} projectData={projectData} />
                    <VideoEditor getTotalDuration={getTotalDuration} saved={saved} setLoadingProccess={setLoadingProccess} newId={newId} saveLoader={saveLoader} setVideoURL={setVideoURL} getThumbURL={getThumbURL} activeNugget={ nuggets.filter(nugget => nugget.id == activeNugget) } recordTimings={recordTimings} setCorteInfo={setCorteInfo} parentCallback={handleCallback} />
                </div>
                <div id="col-nuggets">
                  <Menu />
                  <ul id="nuggets-cont">
                        {nuggets.map((nugget, index)=>(
                            <NuggetTab setRenderNoteNugget={setRenderNoteNugget} setRenderInfoNugget={setRenderInfoNugget} nuggets={nuggets} setNuggets={setNuggets} activeNugget={activeNugget} setActiveNugget={setActiveNugget} nugget={nugget} index={index} />
                        ))}
                  </ul>
                  <button onClick={ () => { nuevo_nugget() }} id="AddNugget">Agregar nugget</button>
                </div>
                {renderInfoNugget &&
                  <ModalInfoTag setRenderInfoNugget={setRenderInfoNugget}  nugget={getNuggetInfo(activeNugget)} />
                }
                {renderNoteNugget &&
                  <ModalNuggetNote setRenderNoteNugget={setRenderNoteNugget} nugget={getNuggetInfo(activeNugget)} setNuggetNote={setNuggetNote} />
                }
              </div>

       }
       
       
       return ( render() )
}




export default NewProject;