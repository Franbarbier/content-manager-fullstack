import React, { useState, useEffect } from 'react';
import NuggetProgress from './NuggetProgress/NuggetProgress';


import './NuggetTab.css';


const NuggetTab = ({ nuggets, nugget, index, activeNugget, setActiveNugget, setNuggets, setRenderInfoNugget }) => {

const [estadoNugget, setEstadoNugget] = useState(0)
const [videoFileNugg, setVideoFileNugg,] = useState()
const [videoNugget, setVideoNugget] = useState({
       estado : "No elegido"
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
       console.log(e.target.files[0].name)
       setVideoNugget({ ...videoNugget, nombre: e.target.files[0].name, estado: "elegido"   })
       setVideoFileNugg(e.target.files[0])

       var newNuggets = nuggets
       newNuggets[newNuggets.indexOf(nugget)].video = e.target.files[0]
       newNuggets[newNuggets.indexOf(nugget)].estado = 2
       setEstadoNugget(2)
       
       setNuggets(newNuggets)
}


  function render(){
      return <li className={nugget.id == activeNugget && 'nuggetSelected'} onClick={ (e) => { checkDeleted(e, nugget.id) } } >
                     <div id="nugget-titulo">
                            <h4>{index+1} ) </h4>
                            <input defaultValue={nugget.nombre} onChange={ (e) => { updateNuggetName(e) } }  />
                            <div className="look" onClick={  () => {setRenderInfoNugget(true)} } ><img src="./assets/look.png" /> </div>
                            <div className="copy" onClick={ (e) => { copy_txt(e) } } ><img src="./assets/copy.png" /> <p>Copiado en papelera!</p> </div>
                     </div>
                     <div>
                            <NuggetProgress estadoNugget={estadoNugget} setEstadoNugget={setEstadoNugget} />
                     </div>
                     <div className="upload-nugget-vid">
                            <label>Adjuntar video editado</label>
                            <div>
                                   <label className="labelVidNugget" for={`addVid${nugget.id}`}>
                                          <input onChange={(e)=>{ selectFileNugget(e) } } id={`addVid${nugget.id}`} type="file" />
                                          <div>  
                                                 { videoNugget.estado == "elegido" ? <img src="./assets/comprobar1.png" width='12px' style={{'marginRight':'5px' , 'transform': 'translateY(12%)', 'transition':'.2s'}} /> : <img src="./assets/clip-de-papel.png" width='12px' style={{'marginRight':'5px'}} /> }
                                                 
                                                 <span>{ videoNugget.estado == "elegido" ? videoNugget.nombre : "No hay video subido" }</span>
                                          </div>
                                          {/* { videoNugget.estado == "elegido" && <button className="upload-video-nugget" onClick={ (e) => { uploadVideoNugget(e, index) } } >SUBIR</button> } */}
                                          { videoNugget.estado == "elegido" && <button className="edit-video-nugget">EDITAR</button> }
                                          {/* { videoNugget.estado == "subido" && 
                                                 <div className='btns-cont'>
                                                        <button className="delete-video-nugget"><img width='18px' src="./assets/delete.png"/></button>
                                                        <button className="download-video-nugget"><img width='18px' src="./assets/download.png"/></button>
                                                 </div>
                                          } */}
                                          <div id="progress-bar" style={{ 'width': `${videoNugget.progress}%` }} ></div>
                                         
                                   </label>
                            </div>
                     </div>
                     <img className="delete-nugget" data-index={index} src="./assets/cancel.svg" onClick={ () => { deleteNugget() } } /> 
              </li>
             

       }
       
       
       return ( render() )
}




export default NuggetTab;
