import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import { serverEndpoint } from '../../globals';
import { deleteProject } from '../../actions/projects';
import {AnimatePresence, motion, useCycle } from 'framer-motion'
import React, { useState, useEffect } from 'react';
import "./Menu.css"

const Menu = ({id, projectData, last5minSave}) => {

    const [deleteBtn, setDeleteBtn] = useCycle(false, true)
    const dispatch = useDispatch()
    
    function confirmar(){
            
            if (window.confirm("Do you really want to leave?")) {
                window.open("exit.html", "Thanks for Visiting!");
            }

        
    }

    function deleteProjectBtn(){
        if (window.confirm("Eliminar este proyecto de forma permanente?")) {
            // setLoading(true)
            deleteProject(id, dispatch ).then(
              (e)=> 
            
                alert('Se eliminó correctamente'),

                // check and delete video, thumb y video nuggets
                function deleteAllMedia() {
                    var item = 'videos/' +projectData._id+'-'+projectData.video_url
                    axios.post(serverEndpoint+'delete-item', {item} )
                    if(projectData.thumb_url){
                        item = 'thumbs/' +projectData._id+'-project-thumb.png'
                        axios.post(serverEndpoint+'delete-item', {item} )
                    }

                    for (let index = 0; index < projectData.nuggets.length; index++) {
                        const element = projectData.nuggets[index];
                        if (element.video_name) {
                            item = 'videos/nugget' + element.id + "-"+projectData._id +'-'+ element.video_name
                            axios.post(serverEndpoint+'delete-item', {item} )
                        }
                        
                    }
                }(),

                window.location.href = "/"


              ).catch( (e) =>{
                console.log('error:::', e.error)        
            } )
    }
    }

    
    function render(){
        return  <div id="Menu-component">
                    {id &&
                     <div id="ver-mas" onClick={ ()=>{ setDeleteBtn() } } >
                     <motion.div
                     
                    >
                            <img src="/assets/mas-opciones.png" />
                       </motion.div>
                       <AnimatePresence>
                            {deleteBtn && 
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    duration: 0.1,
                                    translateY: 30
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { delay: 0.1, duration: 0.1 }
                                  }}
                                
                            >
                                
                                <button className={ deleteBtn && 'ajoba' } id="delete-btn">Eliminar Proyecto</button>

                            </motion.div>
                            }
                        </AnimatePresence>
                        </div>
                    }

                    <Link onClick={ (e) => { if (!last5minSave) { if(!window.confirm("No se guardarán automaticamente los cambios realizados.")){ e.preventDefault() } }  } } to={"/"}>
                        <div id="volver" title="Volver al inicio" >
                            <img src="/assets/casa-violeta.png" />
                        </div>
                    </Link>
                </div>
  
         }
         
         
         return ( render() )
}
 
export default Menu;