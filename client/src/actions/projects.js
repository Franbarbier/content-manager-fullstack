import {FETCH_ALL_PROJECTS, CREATE_PROJECT, DELETE_PROJECT, EDIT_PROJECT} from '../constants/actionTypes';
import * as api from '../api';

export const getProjects = () => async (dispatch) => {

    try{
        const{data} = await api.getProjects()
        dispatch({type: FETCH_ALL_PROJECTS, payload:data})
        return data;
    }catch(error){
        console.log(error.message)
    }

}

export const createProject = (project) => async (dispatch) => {
    try{
        console.log(project)
        const{data} = await api.createProject(project)
        dispatch({type: CREATE_PROJECT, payload:data})
        return data
    }catch(error){
        console.log(error)
    }

}

export const deleteProject = async (id_project, dispatch) => {
    try{
        const {data} = await api.deleteProject(id_project)
        console.log(data)
        dispatch({type: DELETE_PROJECT, payload:data})
    }catch(error){
        console.log(error)
    }
}
export const editProject = async (projectData, dispatch) => {
    try{
        const {data} = await api.editProject(projectData)
        dispatch({type: EDIT_PROJECT, payload:data})
    }catch(error){
        console.log(error)
    }
}