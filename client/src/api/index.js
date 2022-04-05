import axios from 'axios';


// Obtenemos el token del localStorage
const token = window.localStorage.getItem('token');

// const headers = {
//     'Authorization': `Bearer ${token}`
// }

// const ENDPOINT = 'http://localhost:5000/';
const ENDPOINT = 'https://content-manager-back.herokuapp.com:5000/';


const url_projects = ENDPOINT+'projects'
export const getProjects = () => axios.get(url_projects);
export const createProject = (newProject) => axios.post(url_projects, newProject);
// export const createCliente = (newCliente) => axios.post(url_clientes, newCliente, {headers});



