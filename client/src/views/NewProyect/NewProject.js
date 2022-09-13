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
    nuggets : [{

    }],
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
  
  const [linkYT, setLinkYT] = useState()
  const [txt, setTxt] = useState('')
  const [cortesFormateados, setCortesFormateados] = useState([])
  const [activeNuggetData, setActiveNuggetData] = useState(false)
  
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


  function getIdYt(link){
    try {
      
      var video_id = link.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&'); 

      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }

      setLinkYT(video_id)
    } catch (error) {
      setLinkYT('')
    }
    
  }




  var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};


// var str = `{
//   corte 1:
//   [42:22] - [52:30]
//   "Hola compa! .... ni ideaa"
// },
// {
//   corte 2:
//   [22:16] - [25:40]
//   "Eldel medio"
// },{
//   corte 3:
//   [33:02] - [39:17]
//   "Hola compa! .... Cortenge 3"
// }
// `;

useEffect(()=>{
  var primerFormat = getFromBetween.get(txt,"{","}");
  console.log(primerFormat)
  if (primerFormat.length > 0) {
    
    let newCortes = []
    
    for (let index = 0; index < primerFormat.length; index++) {
      const element = primerFormat[index];
      
      
      let newCorte = {
        corte : index + 1,
        nugget: activeNugget,
        desde : getFromBetween.get(element,"[","]")[0],
        hasta : getFromBetween.get(element,"[","]")[1],
        comentarios :  getFromBetween.get(element,'"','"')
      }

      console.log(newCorte)

      newCortes.push(newCorte)
    }
    setCortesFormateados(newCortes)
  }

},[txt])
 
useEffect(()=>{
 
  var oldState = nuggets
  let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget);
  let activeOne = oldState.indexOf(activeNugg[0])

  if (oldState[activeOne]) {
    console.log(cortesFormateados)
    oldState[activeOne].timings = cortesFormateados
    
  }

  // oldState[activeOne].timings = cortesFormateados
  setNuggets(oldState)

}, [cortesFormateados])

useEffect(()=>{
  setActiveNuggetData(nuggets.filter(nugget => nugget.id == activeNugget)[0])
},[activeNugget])

useEffect(()=>{
  console.log(activeNuggetData)
},[activeNuggetData])


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
      return  <div id="NewProject-view">
                <div id="col-vid">
                  <div className="progressBar" style={{'width': progress + "%" }}></div>
                  <div id="project-info">
                    <input className='nombre-proyecto' defaultValue='Nuevo proyecto' onChange={ (e) => { cambiarNombreProject(e) } } />
                    <button id="save-project" onClick={ () => { save_project() }}> {loading ? "GUARDANDO" : "CREAR PROYECTO"}</button>
                  </div>
                    <AddTag setProjectData={setProjectData} projectData={projectData} />
                    {/* <VideoEditor getTotalDuration={getTotalDuration} saved={saved} setLoadingProccess={setLoadingProccess} newId={newId} saveLoader={saveLoader} setVideoURL={setVideoURL} getThumbURL={getThumbURL} activeNugget={ nuggets.filter(nugget => nugget.id == activeNugget) } recordTimings={recordTimings} setCorteInfo={setCorteInfo} parentCallback={handleCallback} /> */}
                    <input type="text" placeholder='Link de Youtube' onChange={ (e)=>{ getIdYt(e.target.value) } } />
                    <br />
                    <iframe width="100%" height="60%" src={"https://www.youtube.com/embed/"+linkYT} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <br />
                    <br />

                    {activeNugget &&
                      <input type="file" onChange={(e)=>{ handleTXT(e) }}/>
                    }

                    {activeNuggetData &&
                    <ul id="cortes-cont">
                    {activeNuggetData.timings.map((corte, index)=>(
                      
                      <li>
                        {console.log(corte)}
                        <div>
                          <h6>Corte {corte.corte}</h6>
                          <br />
                          <span>Desde: <strong>{corte.desde}</strong></span>
                          <br />
                          <span>Hasta: <strong>{corte.hasta}</strong></span>
                          <br />
                          
                          <div>
                          {corte.comentarios.map((comentario, index)=>(
                            <p>"{comentario}"</p>
                            ))}  
                          </div>
                        </div>
                        <hr />
                      </li>
                        
                        ))
                    }
                    </ul>
                    }
                    
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