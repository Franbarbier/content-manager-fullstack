import {FETCH_ALL_PROJECTS, CREATE_PROJECT} from '../constants/actionTypes';
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