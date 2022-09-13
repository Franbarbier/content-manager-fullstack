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


const NewProject2 = () => {
  
  // lvl 3
  const [nuggetCounter, setNuggetCounter] = useState(1)
  
  // lvl 2
  const [nuggets, setNuggets] = useState([{
    id : nuggetCounter,
    nombre : 'Nombre del nugget ' + nuggetCounter,
    estado : 0,
    timings: []
  }])
  
  // lvl 2.1
  const [activeNugget, setActiveNugget] = useState({})
  const [renderInfoNugget, setRenderInfoNugget] = useState(false)
  const [renderNoteNugget, setRenderNoteNugget] = useState(false)
  
  // lvl 1
  const [projectData, setProjectData] = useState({
    nuggets : [{
    }],
    tags: []
  })

  const [linkYT, setLinkYT] = useState()
  const [txt, setTxt] = useState('')
  const [cortesFormateados, setCortesFormateados] = useState([])
  
  const [saved, setSaved] = useState(0)
  const [newId, setNewId] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const dispatch = useDispatch()

  useEffect(()=>{
    setActiveNugget( nuggets[0] )
  }, [])


  
  function nuevo_nugget() {
    var newNugget = {};
    newNugget.id = nuggetCounter + 1
    newNugget.nombre = 'Nombre del nugget ' +( nuggetCounter + 1 )
    newNugget.timings = []
    newNugget.estado = 0
    setNuggets(nuggets => [...nuggets, newNugget])
    setNuggetCounter(nuggetCounter + 1)
  }

  useEffect(()=>{
    setActiveNugget( nuggets.filter(nugget => nugget.id == nuggetCounter)[0] )
  }, [nuggetCounter])


  function setNuggetNote(nota){
    var oldState = nuggets
    let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget);
    let activeOne = oldState.indexOf(activeNugg[0])

    oldState[activeOne].nota = nota 
  
    setNuggets(oldState)
    setRenderNoteNugget(false)
  }

  function cambiarNombreProject(e) {
    setProjectData( { ...projectData, name: e.target.value } )
  }


  // async function saved_project(id){

  //   // const onSuccess = () => {console.log('en teoria aca')}
  //   // await uploadVideosNuggets(id) 
  //   // onSuccess()
    
  //   setNewId(id)
  //   setTimeout(() => {
  //     setSaved(saved + 1)
  //   }, 350);
  // }

  function save_project(){

    setLoading(true)
    // setProgress(0)
    dispatch(createProject(projectData)).then(
      (e)=> 
       console.log(e)       

      ).catch( (e) =>{
        console.log('error:::', e.error)
        this.props.saveLoader("error",false)
        // this.props.saveLoader("success",false)

    } )

  }
  



  useEffect(()=>{
    setProjectData( { ...projectData, name: "Nuevo proyecto"  } )
  }, [])

  useEffect(()=>{
    console.log(projectData)
  })

  useEffect(()=>{
    setCortesFormateados(activeNugget.timings)
  }, [activeNugget])


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



useEffect(()=>{
  var primerFormat = getFromBetween.get(txt,"{","}");
  console.log(primerFormat)
  if (primerFormat.length > 0) {
    
    let newCortes = []
    
    for (let index = 0; index < primerFormat.length; index++) {
      const element = primerFormat[index];
      
      
      let newCorte = {
        corte : index + 1,
        nugget: activeNugget.id,
        desde : getFromBetween.get(element,"[","]")[0],
        hasta : getFromBetween.get(element,"[","]")[1],
        comentarios :  getFromBetween.get(element,'"','"')
      }

      newCortes.push(newCorte)
    }
  
  var oldState = [...nuggets]
  let activeNugg = nuggets.filter(nugget => nugget.id == activeNugget.id);
  let activeOne = oldState.indexOf(activeNugg[0])

  if (oldState[activeOne]) {
    console.log(newCortes)
    oldState[activeOne].timings = newCortes
    
  }

  setNuggets(oldState)
  
}

},[txt])

useEffect(()=>{
  console.log(nuggets)
  setCortesFormateados(activeNugget.timings)
  setProjectData( { ...projectData, nuggets: nuggets  } )
}, [nuggets])



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
                  {/* <div className="progressBar" style={{'width': progress + "%" }}></div> */}
                  <div id="project-info">
                    <input className='nombre-proyecto' defaultValue='Nuevo proyecto' onChange={ (e) => { cambiarNombreProject(e) } } />
                    <button id="save-project" onClick={ () => { save_project() }}> {loading ? "GUARDANDO" : "CREAR PROYECTO"}</button>
                  </div>
                    <AddTag setProjectData={setProjectData} projectData={projectData} />

                    <input id="link_yt" type="text" placeholder='Link de Youtube' onChange={ (e)=>{ getIdYt(e.target.value) } } />
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
                <Menu />
                 
                  <ul id="nuggets-cont">
                        {nuggets.map((nugget, index)=>(
                            <NuggetTab setRenderNoteNugget={setRenderNoteNugget} setRenderInfoNugget={setRenderInfoNugget} nuggets={nuggets} setNuggets={setNuggets} activeNugget={activeNugget} setActiveNugget={setActiveNugget} nugget={nugget} index={index} />
                        ))}
                  </ul>
                  <button onClick={ () => { nuevo_nugget() }} id="AddNugget">Agregar nugget</button>
                </div>
                {renderInfoNugget &&
                  <ModalInfoTag setRenderInfoNugget={setRenderInfoNugget}  nugget={activeNugget} />
                }
                {renderNoteNugget &&
                  <ModalNuggetNote setRenderNoteNugget={setRenderNoteNugget} nugget={activeNugget} setNuggetNote={setNuggetNote} />
                }
              </div>

       }
       
       
       return ( render() )
}




export default NewProject2;