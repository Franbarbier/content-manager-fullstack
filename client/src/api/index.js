import axios from 'axios';
import { serverEndpoint } from '../globals';


// Obtenemos el token del localStorage
const token = window.localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`
}


const ENDPOINT = serverEndpoint;

const url_projects = ENDPOINT+'projects'
export const getProjects = () => axios.get(url_projects);
export const createProject = (newProject) => axios.post(url_projects, newProject);
export const deleteProject = (id) => axios.delete(`${url_projects}/${id}` );
export const editProject = (project) => axios.patch(`${url_projects}/`, project);

// export const createCliente = (newCliente) => axios.post(url_clientes, newCliente, {headers});

const url_users = ENDPOINT+'users'
// export const login = () => axios.get(url_login, user, {headers});
export const login = (user) => axios.post(`${url_users}/login`, user);
// export const login = (user) => axios.post(`${url_users}/login`, user);
export const verifyUser = async (id) => {
    var res = await fetch(`${url_users}/verify`, {method: 'GET', headers})
    .then(response => response.json())
    .then(data => data);
    
    return res
}


