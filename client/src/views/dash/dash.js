import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';

import ProjectCard from '../../components/project-card/ProjectCard';

import './dash.css';


const Dash = ({setActiveTab }) => {
    
    const[ buscador, setBuscador ] = useState('')
    const dispatch = useDispatch()

    var projects = useSelector(state => state.projects)

    console.log(projects)

    function changeBsucador(e){
        setBuscador(e.target.value)
    }

    useEffect(()=>{
        console.log(buscador)
    })



    function checkBuscador(proyecto){

        function ifIsInTag(proyecto){
            for (let index = 0; index < proyecto.tags.length; index++) {
                const element = proyecto.tags[index];
                return element.toLowerCase().includes(buscador.toLowerCase())
            }
        }
        if (buscador == '' || proyecto.name.toLowerCase().includes(buscador.toLowerCase()) || ifIsInTag(proyecto) ) {
            return true
        }else{
            return false
        }
    }

  function render(){
      return  <div id="Dash-view">
                <div id="col-1">

                </div>

                <div id="center-col">
                    <div id="top-menu">
                        <input type="text" onChange={ (e) => { changeBsucador(e) } } placeholder="Buscar proyecto" />
                        <Link to='/new-project'>
                            <button onClick={() => setActiveTab('new-project')}>Nuevo proyecto</button>
                        </Link>
                    </div>
                    <div id="project-cards-cont">

                        {projects.map((project, index)=>(
                            <>
                                { checkBuscador(project) &&
                                    <ProjectCard project={project}/>
                                }
                            </>
                        ))}
                        
                    </div>
                </div>



                <div id="col-1">

                </div>
              </div>

       }
       
       
       return ( render() )
}




export default Dash;