import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { deleteProject } from '../../actions/projects';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { serverEndpoint, bucket_name } from '../../globals';

// import thumg_img from '../../../../server/public/'

import './ProjectCard.css';


const ProjectCard = ({project}) => {


    const [porAsignado, setPorAsignado] = useState(0)
    const [porEditado, setPorEditado] = useState(0)
    const [porPublicado, setPorPublicado] = useState(0)

    const dispatch = useDispatch()

useEffect(()=>{

    var totalDuration = 0
    var totalEdita2 = 0
    var totalPublica2 = 0

    for (let index = 0; index < project.nuggets.length; index++) {
        const nugg = project.nuggets[index];
        console.log( project.nuggets)

        // Get % asginado
        for (let index = 0; index < nugg.timings.length; index++) {
            const timing = nugg.timings[index];
            var smallDuration = timing.end - timing.start
            totalDuration += smallDuration
        }
        // Get % editado
        if (nugg.estado == 2) {
            totalEdita2 += 1
        }
        // Get % publicado
        if (nugg.estado == 3) {
            totalPublica2 += 1
            totalEdita2 += 1

        }
    }


    // Set % asginado
    var porcentajeAsig = totalDuration * 100 / project.duration

    if (porcentajeAsig > 100) { porcentajeAsig = 100 }
    if (!isNaN(porcentajeAsig)) {
        setPorAsignado( Math.round(porcentajeAsig) )
    }else{
        setPorAsignado( 0 )
    }

    // Set % Editado
    var porcentajeEdit = totalEdita2 * 100 / project.nuggets.length
    if (!isNaN(porcentajeEdit)) {
        setPorEditado( Math.round(porcentajeEdit) )
    }else{
        setPorEditado( 0 )
    }

    // Set % Publicado
    var porcentajePublic = totalPublica2 * 100 / project.nuggets.length
    if (!isNaN(porcentajePublic)) {
        setPorPublicado( Math.round(porcentajePublic) )
    }else{
        setPorPublicado( 0 )
    }



},[])

function deleteThisProject(e) {
    e.stopPropagation()
    e.preventDefault()
    if (window.confirm("Eliminar este proyecto de forma permanente?")) {
            // setLoading(true)
            deleteProject(project._id, dispatch ).then(
              (e)=> 
            
                alert('Se eliminó correctamente'),

                // check and delete video, thumb y video nuggets
                function deleteAllMedia() {
                    var item = 'videos/' +project._id+'-'+project.video_url
                    axios.post(serverEndpoint+'delete-item', {item} )
                    if(project.thumb_url){
                        item = 'thumbs/' +project._id+'-project-thumb.png'
                        axios.post(serverEndpoint+'delete-item', {item} )
                    }

                    for (let index = 0; index < project.nuggets.length; index++) {
                        const element = project.nuggets[index];
                        if (element.video_name) {
                            item = 'videos/nugget' + element.id + "-"+project._id +'-'+ element.video_name
                            axios.post(serverEndpoint+'delete-item', {item} )
                        }
                        
                    }
                }()
                    
                      
              ).catch( (e) =>{
                console.log('error:::', e.error)        
            } )
    }
}


  function render(){
      return <>
            <Link to={`/project/${project._id}`}>
                <div className='project-card'>
                    <div>
                        <div className="thumb">
                            <img src={ project.thumb_url ? "https://storage.cloud.google.com/"+bucket_name+"/thumbs/"+project._id+"-"+project.thumb_url : "https://i.ytimg.com/vi/QAuJU5FUyC0/maxresdefault.jpg"}/>
                        </div>
                        <div>
                            <h3>{project.name}</h3>
                        </div>
                        <div className="porcentajes">
                            <div>
                                <p>{porAsignado}%</p><span>Asignado</span>
                                
                            </div>
                            <div>
                                <p>{porEditado}%</p><span>Editado</span>
                            </div>
                            <div>
                                <p>{porPublicado}%</p><span>Publicado</span>
                            </div>
                        </div>
                        <div className='tags-cont'>
                            {project.tags.map((tag, index)=>(
                                <span title={tag}>{tag}</span>
                            ))}
                        </div>
                        <div onClick={ (e)=>{ deleteThisProject(e) }  } className="delete-cont">
                            <div>
                                <img src="./assets/delete-trash.png" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
             </>
             

       }
       
       
       return ( render() )
}




export default ProjectCard;
