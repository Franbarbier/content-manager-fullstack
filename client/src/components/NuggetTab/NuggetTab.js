import React, { useState, useEffect } from 'react';
import NuggetProgress from './NuggetProgress/NuggetProgress';
import axios from 'axios';
import { serverEndpoint, bucket_name } from '../../globals';


import './NuggetTab.css';


const NuggetTab = ({ nuggets, nugget, index, activeNugget, setActiveNugget, setNuggets, setRenderInfoNugget, setRenderNoteNugget, project_id }) => {

const [estadoNugget, setEstadoNugget] = useState(nugget.estado)
const [videoFileNugg, setVideoFileNugg] = useState()
const [progressUpload, setProgressUpload] = useState()

const [videoNugget, setVideoNugget] = useState({
       estado :  nugget.video_name ? "elegido" : "No elegido",
       nombre : nugget.video_name
})


function checkDeleted(e, id) {
       if(!e.target.classList.contains('delete-nugget')){ 
              setActiveNugget(id)
       }
}

useEffect( ()=>{
   
       var newNuggets = nuggets
       newNuggets[newNuggets.indexOf(nugget)].estado = estadoNugget
       setNuggets(newNuggets)

}, [estadoNugget] )

function fromDecToHex(formateo){
       if (formateo > 59) {
              var decimalizaso = (formateo / 60)
              var minutos = decimalizaso.toString().split('.')[0]
              var segundos = formateo - (minutos*60)
              segundos = segundos.toFixed(2)

          }else{
              var minutos = "00"
              var segundos = formateo
          }
       
          return minutos+":"+segundos 
}

function copy_txt(e) {

       var copiado = `Nugget ${index+1}: ${nugget.nombre}. Estado: ${estadoNugget}. Video editado subido: NOP. Cortes:`;
       var anexar = '';
       for (let i = 0; i < nugget.timings.length; i++) {
              const element = nugget.timings[i];
              anexar += ` // Corte ${i+1}: De ${fromDecToHex( element.start.toFixed(2)) } a ${fromDecToHex( element.end.toFixed(2)) }.`
       }
       copiado += anexar
       navigator.clipboard.writeText(copiado);

       if(e.target.tagName == "IMG"){
              var mensajin = e.target.closest('div').querySelector('p')
       }
       if (e.target.tagName == "DIV") {
              var mensajin = e.target.querySelector('p')
       }

       mensajin.style.opacity = 1
       setTimeout(() => {
              mensajin.style.opacity = 0 
       }, 1300);
}


function deleteNugget(){

       if (nuggets.filter(nugg => nugg.id != nugget.id ).length > 0 ) {
              if(nuggets[index-1]){
                      setActiveNugget(nuggets[index-1].id)
              }else{
                      setActiveNugget(nuggets[index+1].id)
              }
              setNuggets(nuggets.filter(nugg => nugg.id != nugget.id ) )
       }else{
              alert('Tiene que haber al menos 1 nugget')
       }
}
function updateNuggetName(e){
       var newNuggets = nuggets
       newNuggets[newNuggets.indexOf(nugget)].nombre = e.target.value
       setNuggets(newNuggets)
}

function selectFileNugget(e){

       if(videoNugget.nombre){
              // Eliminar de AWS
              //Meterlo en un global funcitons
              deleteNuggetVideo(e, "videos/")
       }

       setVideoNugget({ ...videoNugget, nombre: e.target.files[0].name, estado: "elegido"   })
       setVideoFileNugg(e.target.files[0])

       var newNuggets = nuggets
       newNuggets[newNuggets.indexOf(nugget)].video = e.target.files[0]
       newNuggets[newNuggets.indexOf(nugget)].video_name = e.target.files[0].name
       newNuggets[newNuggets.indexOf(nugget)].estado = 2
       setEstadoNugget(2)
       
       setNuggets(newNuggets)
}

function deleteNuggetVideo(e, directory) {
       e.preventDefault()
       console.log(e.target)

       let targett = e.target
       if ( window.confirm("Desea eliminar el video de este nugget?") ) {
       
              let deleted_object = directory+'nugget' + nugget.id + "-"+project_id +'-'+ videoFileNugg?.name

              axios.post(serverEndpoint+'delete-video', {deleted_object}, { 
                    
                     onUploadProgress: (progressEvent) => {
                     const progressNugg = ( (progressEvent.loaded / progressEvent.total) * 100 ).toFixed();
                     setProgressUpload(progressNugg);
                     }
       
              } )
              .then((e)=>{
                     console.log('eliminado', e)
                     if (targett.tagName == 'IMG') {
                            setVideoNugget({estado: "No elegido"})
                            setEstadoNugget(1)
                            var newNuggets = nuggets
                            delete newNuggets[newNuggets.indexOf(nugget)].video_name
                            setNuggets(newNuggets)

                     }
              })
              .catch( (e) =>{
                     console.log('error:::', e.error)
              } )
       

             
       } 
}

useEffect(()=>{
       
       // Ya no se suben videos nugget onChange, sino que cuando se guarda manualmente el proyecto
       // let file = videoFileNugg
       // const data = new FormData()
       // var new_name = 'nugget' + nugget.id + "-"+project_id +'-'+ videoFileNugg?.name
       // data.append('new_name',new_name)
       // data.append( 'file', file )
       

       //  axios.post(serverEndpoint+'upload-video', data, { 
                    
       //      onUploadProgress: (progressEvent) => {
       //          const progressNugg = ( (progressEvent.loaded / progressEvent.total) * 100 ).toFixed();
       //          setProgressUpload(progressNugg+1);
       //          console.log(progressUpload)
       //      }

       //  } )
       //  .then((e)=>{
       //    console.log('el nugget video subido', e)
       //    setProgressUpload(101)
       //  })
       //  .catch( (e) =>{
       //      console.log('error:::', e.error)
       //  } )
}, [videoFileNugg] )



  function render(){
      return <li className={nugget.id == activeNugget && 'nuggetSelected'} onClick={ (e) => { checkDeleted(e, nugget.id) } } >
                     <div id="nugget-titulo">
                            <h4>{index+1} ) </h4>
                            <input defaultValue={nugget.nombre} onChange={ (e) => { updateNuggetName(e) } }  />
                            <div className="look" onClick={  () => {setRenderInfoNugget(true)} } ><img src="/assets/look.png" /> </div>
                            <div className={nugget.nota && nugget.nota != "" ? "hayNota nota" : "nota"} onClick={  () => {setRenderNoteNugget(true)} } ><img src="/assets/notas.png" /> </div>
                            <div className="copy" onClick={ (e) => { copy_txt(e) } } ><img src="/assets/copy.png" /> <p>Copiado en papelera!</p> </div>
                     </div>
                     <div>
                            <NuggetProgress estadoNugget={estadoNugget} setEstadoNugget={setEstadoNugget} />
                     </div>
                     <div className="upload-nugget-vid">
                            <label>Adjuntar video editado</label>
                            <div>
                                   <label className="labelVidNugget" for={`addVid${nugget.id}`}>
                                          <input onChange={(e)=>{ selectFileNugget(e) } } id={`addVid${nugget.id}`} type="file" />
                                          <div id="nameNimg">  
                                                 { videoNugget.estado == "elegido" ? <img src="/assets/comprobar1.png" width='12px' style={{'marginRight':'5px' , 'transform': 'translateY(12%)', 'transition':'.2s'}} /> : <img src="/assets/clip-de-papel.png" width='12px' style={{'marginRight':'5px'}} /> }
                                                 
                                                 <span>{ videoNugget.estado == "elegido" ? videoNugget.nombre : "No hay video subido" }</span>
                                          </div>
                                          
                                          { videoNugget.estado == "elegido" &&
                                                 <div className='video-options'>
                                                        <div><a target="_blank" href={'https://storage.googleapis.com/'+bucket_name+'/videos/nugget' + nugget.id + "-"+project_id +'-'+ videoNugget.nombre.replaceAll( "+", "%2B" ).replace(/\s+/g,'%20')}><img src="/assets/look.png" title="Ver y descargar"/></a></div>
                                                        <div><img src="/assets/pencil.png" onClick={ document.getElementById(`addVid${nugget.id}`)?.click } title="Editar"/></div>
                                                        <div><img src="/assets/delete.png" onClick={ (e)=>{deleteNuggetVideo(e, 'videos/')} } title="Eliminar"/></div>
                                                 </div>
                                          }
                                          
                                          <div id="progress-bar" style={{ 'width': `${videoNugget.progress}%` }} ></div>
                                         
                                   </label>
                            </div>
                     </div>
                     <img className="delete-nugget" data-index={index} src="/assets/cancel.svg" onClick={ () => { deleteNugget() } } /> 
              </li>
             

       }
       
       
       return ( render() )
}




export default NuggetTab;
