import React, { useState, useEffect } from 'react';

import './ModalNuggetNote.css';


const ModalNuggetNote = ({ nugget, setRenderNoteNugget, setNuggetNote }) => {

console.log(nugget)




  function render(){
      return  <>
                     <div id="modal-back">
                            <div id="modal-cont-nuggetnote">
                                   <img id="close-modal-nuggetnote" onClick={  () => {setRenderNoteNugget(false)} } src="/assets/cancel.svg" />
                                   <div>
                                          <h6>Escriba una nota para el nugget</h6>
                                          <textarea id="textarea-note">{nugget?.nota}</textarea>
                                          <div>
                                                 <button id="save-note" onClick={()=>{ setNuggetNote( document.getElementById('textarea-note').value ) }}>GUARDAR</button>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </>
             

       }
       
       
       return ( render() )
}




export default ModalNuggetNote;
