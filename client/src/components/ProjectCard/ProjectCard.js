import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { deleteProject } from '../../actions/projects';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { serverEndpoint } from '../../globals';

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
    setPorAsignado( Math.round(porcentajeAsig) )

    // Set % Editado
    var porcentajeEdit = totalEdita2 * 100 / project.nuggets.length
    setPorEditado( Math.round(porcentajeEdit) )

    // Set % Publicado
    var porcentajePublic = totalPublica2 * 100 / project.nuggets.length
    setPorPublicado( Math.round(porcentajePublic) )





},[])

function deleteThisProject(e) {
    e.stopPropagation()
    e.preventDefault()
    if (window.confirm("Eliminar este proyecto de forma permanente?")) {
            // setLoading(true)
            dispatch(deleteProject(project._id, dispatch )).then(
              (e)=> 
            
                alert('Se eliminó correctamente'),

                // check and delete video, thumb y video nuggets
                function deleteAllMedia() {
                    var video_key = 'videos/' +project._id+'-'+project.video_url
                    axios.post(serverEndpoint+'delete-item', {video_key} )

                    if(project.thumb_url){
                        var thumb_key = 'thumbs/' +project._id+'-project-thumb.png'
                        axios.post(serverEndpoint+'delete-item', {video_key:thumb_key} )
                    }
                    for (let index = 0; index < project.nuggets.length; index++) {
                        const element = project.nuggets[index];
                        var nuggVid_key = 'videos/nugget' + element.id + "-"+project._id +'-'+ element.video?.name
                        axios.post(serverEndpoint+'delete-item', {video_key:nuggVid_key} )
                        
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
                            <img src={ project.thumb_url ? "https://content-creator-1.s3.sa-east-1.amazonaws.com/thumbs/"+project._id+"-"+project.thumb_url : "https://i.ytimg.com/vi/QAuJU5FUyC0/maxresdefault.jpg"}/>
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
                                <span>{tag}</span>
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
