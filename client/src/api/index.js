import axios from 'axios';
import { serverEndpoint } from '../globals';


// Obtenemos el token del localStorage
const token = window.localStorage.getItem('token');

// const headers = {
//     'Authorization': `Bearer ${token}`
// }

const ENDPOINT = serverEndpoint;

const url_projects = ENDPOINT+'projects'
export const getProjects = () => axios.get(url_projects);
export const createProject = (newProject) => axios.post(url_projects, newProject);
export const deleteProject = (id) => axios.delete(`${url_projects}/${id}` );
export const editProject = (project) => axios.patch(`${url_projects}/`, project);

// export const createCliente = (newCliente) => axios.post(url_clientes, newCliente, {headers});



