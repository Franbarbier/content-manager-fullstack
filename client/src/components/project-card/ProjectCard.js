import React, { useState, useEffect } from 'react';

// import thumg_img from '../../../../server/public/'

import './ProjectCard.css';


const ProjectCard = ({project}) => {


    const [porAsignado, setPorAsignado] = useState(0)
    const [porEditado, setPorEditado] = useState(0)
    const [porPublicado, setPorPublicado] = useState(0)

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



  function render(){
      return <>
                <div className='project-card'>
                    <div>
                        <div className="thumb">
                            <img src="https://i.ytimg.com/vi/QAuJU5FUyC0/maxresdefault.jpg" />
                        </div>
                        <div>
                            <div className='tags-cont'>
                            {project.tags.map((tag, index)=>(
                                <span>{tag}</span>
                            ))}
                            </div>
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
                    </div>
                </div>
             </>
             

       }
       
       
       return ( render() )
}




export default ProjectCard;
