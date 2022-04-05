import React, { useState, useEffect } from 'react';

import './ModalInfoNugget.css';


const ModalInfoNugget = ({ nugget, setRenderInfoNugget }) => {

console.log(nugget)


function getValueTime(value)  {
        
       var formateo = value
       
       if (formateo > 59) {
           var decimalizaso = (formateo / 60)
           var minutos = decimalizaso.toString().split('.')[0]
           
           var segundos = decimalizaso.toString().split('.')[1]
           segundos = 60* ( (segundos.substring(0, 4) * 1) / 100 )  /100
           segundos = segundos.toFixed(2)

       }else{
           var minutos = '00'
           var segundos = formateo.toFixed(2)
       }
       segundos = (segundos*1)
       segundos = segundos.toFixed(0)
       segundos = (segundos*1)

       if(segundos.toString().length == 1){
              segundos = "0" + segundos
       }

       var final_num = minutos + ":" + segundos

       console.log(value)
       return final_num 
   }


  function render(){
      return  <>
                     <div id="modal-back">
                            <div id="modal-cont-nuggetInfo">
                                   <img id="close-modal-infoNugget" onClick={  () => {setRenderInfoNugget(false)} } src="./assets/cancel.svg" />
                                   <div>
                                          <h3>{nugget.nombre}</h3>
                                          <div>
                                          <ul>
                                          {nugget.timings.map((timing, index)=>(
                                                 <li>
                                                        <h4>{timing.titulo ? timing.titulo : `Corte ${index+1}` }</h4>

                                                        <b>[ {getValueTime(timing.start)} - {getValueTime(timing.end)} ]</b>
                                                        <br />
                                                        <p><i>"{timing.descr}"</i></p>
                                                 </li>
                                          ))}
                                          </ul>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </>
             

       }
       
       
       return ( render() )
}




export default ModalInfoNugget;
