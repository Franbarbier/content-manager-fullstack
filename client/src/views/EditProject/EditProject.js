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
import Menu from '../../components/Menu/Menu';
import ModalNuggetNote from '../../components/ModalNuggetNote/ModalNuggetNote';


const EditProject = () => {
 
  const [saved, setSaved] = useState(0)
  const [newId, setNewId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [nuggets, setNuggets] = useState([])
  const [tags, setTags] = useState([])
  const [nuggetCounter, setNuggetCounter] = useState(1)
  const [activeNugget, setActiveNugget] = useState({})
  const [renderInfoNugget, setRenderInfoNugget] = useState(false)
  const [renderNoteNugget, setRenderNoteNugget] = useState(false)
  const [progress, setProgress] = useState()
  const [primeraVez, setPrimeraVez] = useState(true)
  const [timings, setTimings] = useState()
  const [last5minSave, setLast5minSave] = useState(false)
  const [linkYT, setLinkYT] = useState(false)
  
  const [txt, setTxt] = useState('')
  const [cortesFormateados, setCortesFormateados] = useState([])


  const { id } = useParams();

  const projects = useSelector(state => state.projects)
  const project = projects.filter((proyecto)=>proyecto._id === id)[0]

  const [projectData, setProjectData] = useState()

  useEffect(()=> {
    setProjectData(project)
    if (project) {
      if (project.nuggets) {
      console.log(project.nuggets)
      setActiveNugget( project.nuggets[0] )
      }
    }
  }, [project])


  useEffect(()=> {
    console.log(projectData)
  }, [projectData])
  
  useEffect(()=> {
    setCortesFormateados(activeNugget.timings)
  }, [activeNugget])



  console.log(nuggets)

  const dispatch = useDispatch()

  function nuevo_nugget() {

    var newNugget = {};
    newNugget.id = projectData.nuggets[projectData.nuggets.length - 1].id + 1
    newNugget.nombre = 'Nombre del nugget'
    newNugget.timings = []
    newNugget.estado = 0

    setNuggets(nuggets => [...projectData.nuggets, newNugget])

    setNuggetCounter(newNugget.id)
    console.log(nuggets.filter(nugget => nugget.id == (nuggetCounter)[0] +1) )
    // setActiveNugget(nuggets[nuggetCounter])
  }

  

  function recordTimings(timing) {
    var oldState = nuggets
    let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget);
    if (activeNugg == 0) {
      return false
    }
    let indexx = oldState.indexOf(activeNugg[0])
    oldState[indexx].timings = timing

    setNuggets(oldState)
  }


  function setCorteInfo(index, value, type ){

    var oldState = nuggets
    let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget);
    let activeOne = oldState.indexOf(activeNugg[0])

    if (type == "descripcion") { oldState[activeOne].timings[index].descr = value }
    if (type == "titulo") { oldState[activeOne].timings[index].titulo = value }
  
    setNuggets(oldState)

  }
  
  function setNuggetNote(nota){
    var oldState = nuggets
    let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget);
    let activeOne = oldState.indexOf(activeNugg[0])

    oldState[activeOne].nota = nota 
  
    setNuggets(oldState)
    setRenderNoteNugget(false)
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

  function saveLoader(estado, boolean,  ){
    if (boolean) {
      document.getElementById('save-project').classList.add("cargando");
      document.getElementById('save-project').innerHTML = "GUARDANDO";
    }else{
      document.getElementById('save-project').classList.remove("cargando")
      document.getElementById('save-project').innerHTML = "GUARDAR";
    }
    if (estado == "success") {
      alert('Todo joya rrope')
      setLast5minSave(true)
      setTimeout(() => {
        setLast5minSave(false)
      }, 5000);
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
      console.log(element)
      if (element.video) {
          let file = element.video
          const data = new FormData()
          var new_name = 'nugget' + element.id + "-"+project_id +'-'+ file.name
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

  function saved_project(id){
    uploadVideosNuggets(id)  
    setNewId(id)
    setTimeout(() => {
      setSaved(saved)
    }, 350);
  }

  function save_project(){

    setLoading(true)

    editProject(projectData, dispatch).then(
      (e)=> 
        saved_project(id),
        alert('Se guardó correctamente el proyecto'),
        setLast5minSave(true),
        setTimeout(() => {
          setLast5minSave(false)
        }, 300000),
        setLoading(false)
        // async ()=>{
        //   const onSuccess = () => {alert('Se guardó correctamente el proyecto')}
        //   await saved_project(id) 
        //   onSuccess()
        // },

      ).catch( (e) =>{
        console.log('error:::', e.error)
        this.props.saveLoader("error",false)
    } )
  }

  function getTotalDuration(duration){
    console.log(duration)
    // setProjectData( { ...projectData, duration: duration  } )
  }

  useEffect(()=>{
    setProjectData( { ...projectData, nuggets: nuggets  } )
  }, [nuggets])


  function getIdYt(link){
    try {
      
      var video_id = link.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&'); 

      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
      setProjectData({...projectData, video_url : link})
      setLinkYT(video_id)
    } catch (error) {
      setLinkYT('')
    }
  }


  useEffect(()=>{
    // console.log( projectData.video_url )      
      try {
      
      var video_id = projectData.video_url.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&'); 

      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
      console.log(video_id)
      setLinkYT(video_id)
    } catch (error) {
      console.log('no se pudos')
      setLinkYT('')
    }
  }, [projectData])

  function handleTXT(e){
    const reader = new FileReader(); // filereader
    reader.readAsText(e.target.files[0]); // read as text
    reader.onload = () => {
      const text = reader.result;
      // const result = text.split(/\r?\n/); // split on every new line
      const result = text // split on every new line
      setTxt(result); // do something with array
    };
  };
  


  function render(){
      return  <div id="EditProject-view">
                <div id="col-vid">
                  <div id="project-info">
                    <input className='nombre-proyecto' value={ projectData && projectData.name } onChange={ (e) => { cambiarNombreProject(e) } } />
                    <button id="save-project" onClick={save_project}> {loading ? "GUARDANDO" : projectData ? "GUARDAR CAMBIOS" : "CREAR PROYECTO"}</button>
                  </div>
                    {Array.isArray(projectData && projectData.tags) &&
                      <AddTag setProjectData={setProjectData} projectData={projectData} prevTags={tags} />
                    }
                    {/* <VideoEditor projectData={projectData} video_url={projectData._id+'-'+projectData.video_url} getTotalDuration={getTotalDuration} saved={saved} newId={newId} saveLoader={saveLoader} setVideoURL={setVideoURL} getThumbURL={getThumbURL} activeNugget={ nuggets.filter(nugget => nugget.id == activeNugget) } recordTimings={recordTimings} setCorteInfo={setCorteInfo} parentCallback={handleCallback} />                     */}
                    <input id="link_yt" type="text" placeholder='Link de Youtube' onChange={ (e)=>{ getIdYt(e.target.value) } } value={ projectData && projectData.video_url } />
                    <br />
                
                    <iframe width="100%" height="400px" src={"https://www.youtube.com/embed/"+linkYT} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <br />
                    <br />
                    {activeNugget &&
                      <div id="note-cont">
                        <label>Subir cortes del nugget:</label>
                        <input type="file" onChange={(e)=>{ handleTXT(e) }} />
                      </div>
                    }
                    
                    {cortesFormateados &&
                       <ul id="cortes-cont">
                        {cortesFormateados.map((corte, index)=>(
                            <li>
                            <div>
                              <h6>Corte {corte.corte}</h6>
                              <br />
                              <span>Desde: <strong>{corte.desde}</strong></span>
                              <br />
                              <span>Hasta: <strong>{corte.hasta}</strong></span>
                              <br />
                              
                              <div>
                              {corte.comentarios.map((comentario, index)=>(
                                <i>"{comentario}" </i>
                                ))}  
                              </div>
                            </div>
                          </li>
                          ))
                        }
                     </ul>
                    }
                </div>
                
                <div id="col-nuggets">
                  <Menu id={id} projectData={projectData} last5minSave={last5minSave}/>

                  <ul id="nuggets-cont">
                    {projectData &&
                    <>
                      {projectData.nuggets.length > 0 &&
                      <>
                        {projectData.nuggets.map((nugget, index)=>(
                          <NuggetTab project_id={projectData._id} setRenderNoteNugget={setRenderNoteNugget} setRenderInfoNugget={setRenderInfoNugget} nuggets={projectData.nuggets} setNuggets={setNuggets} activeNugget={activeNugget} setActiveNugget={setActiveNugget} nugget={nugget} index={index} />
                         
                        ))}
                      </>
                      }
                    </>
                    }
                  </ul>
                  <button onClick={ () => { nuevo_nugget() }} id="AddNugget">Agregar nugget</button>
                </div>
                {renderInfoNugget &&
                  <ModalInfoNugget setRenderInfoNugget={setRenderInfoNugget}  nugget={getNuggetInfo(activeNugget)} />
                }
                {renderNoteNugget &&
                  <ModalNuggetNote setRenderNoteNugget={setRenderNoteNugget} nugget={getNuggetInfo(activeNugget)} setNuggetNote={setNuggetNote} />
                }
              </div>

  }
       
       
       return ( render() )
}




export default EditProject;