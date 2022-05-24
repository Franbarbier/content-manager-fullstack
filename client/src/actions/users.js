import {LOGIN} from '../constants/actionTypes';
import * as api from '../api';

export const login = async (user, dispatch) => {

    try{
        const{data} = await api.login(user)
        dispatch({type: LOGIN, payload:data})
        console.log(data)
        return data;
    }catch(error){
        console.log(error.message)
    }

}

