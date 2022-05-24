import { combineReducers } from 'redux';
import projects from './DReducers/projects';
import users from './DReducers/users';


export default combineReducers({
    projects, users
})