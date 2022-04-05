import React, { useState, useEffect } from 'react';


import './NuggetProgress.css';


const NuggetProgress = ({estadoNugget, setEstadoNugget}) => {



  function render(){
      return  <div id="NuggetProgress-view">
                <div data-estado="asignado" className={estadoNugget >= 1 && "completed"} onClick={ (e) => {  if (estadoNugget == 1){ setEstadoNugget(0) }else{ setEstadoNugget(1) } } } >
                    <div className='circulo-check'>
                        <div></div>
                    </div>
                    <span>Asignado</span>
                </div>
                <div data-estado="editado" className={estadoNugget > 1 && "completed"}  onClick={ (e) => {  setEstadoNugget(2) } } >
                    <div className='circulo-check'>
                        <div></div>
                    </div>
                    <span>Editado</span>

                </div>
                <div data-estado="publicado" className={estadoNugget > 2 && "completed"}  onClick={ (e) => {  setEstadoNugget(3) } } >
                    <div className='circulo-check'>
                        <div></div>
                    </div>
                    <span>Publicado</span>

                </div>
              </div>

       }
       
       
       return ( render() )
}




export default NuggetProgress;